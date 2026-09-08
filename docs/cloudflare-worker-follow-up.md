# Follow-up: the two fixes that need Cloudflare, not the repo

**Status: not done, deliberately deferred. Neither is user-visible today.**
Written 2026-09-08 after verifying the live site.

## Why the repo cannot fix these

misersavings.com is served by **GitHub Pages**, not Cloudflare Pages:

```
phone -> Cloudflare (our DNS) -> Fastly (GitHub's CDN) -> GitHub Pages -> this repo
```

Evidence: every response carries `x-github-request-id` and `x-github-edge-region`.
Nameservers are `rommy.ns.cloudflare.com` / `savanna.ns.cloudflare.com`.

GitHub Pages serves files and does nothing else. It cannot set a custom
`Content-Type`, and it cannot route a path that is not a real file. The
`_headers` file in the sibling `misersavings-com-static/` folder was written
for Cloudflare Pages, which we never deployed to. **It has never had any
effect and never will.** Do not "fix" it, and do not treat its existence as
evidence that anything is configured.

## Item 1: AASA served as application/octet-stream

`/.well-known/apple-app-site-association` has no file extension, so GitHub
Pages labels it `application/octet-stream` with `x-content-type-options:
nosniff`. Apple documents `application/json`.

**This is hardening, not a bug fix. Universal Links are NOT broken.**
Verified 2026-09-05 against Apple's own association CDN, which is what iOS
devices actually read:

```
curl https://app-site-association.cdn-apple.com/a/v1/misersavings.com
-> HTTP 200, body byte-identical to our origin
```

Apple fetched, parsed and accepted the file despite the content type, and is
serving it to devices. Any claim that "every Universal Link is dead" is
disproven by that request. Re-run it before acting on a report to the contrary.

Still worth fixing eventually, because it relies on Apple's leniency rather
than on the documented contract.

## Item 2: /join/<CODE> returns HTTP 404

`/join/ABC123` is not a file, so GitHub Pages 404s. Today the 404 page carries
a JS forwarder that rewrites the location to `/join/?c=ABC123`, which is a real
200 page. **A human tapping an invite link reaches a working invite page.** The
cost is the 404 status itself: crawlers see it, and a `curl -I` check fails.

## The fix for both: one Cloudflare Worker

Cloudflare sits in front of GitHub Pages and sees every request first.

Worker code:

```js
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 1. Relabel the AASA file as JSON. Apple documents application/json;
    //    GitHub Pages emits octet-stream because the file has no extension.
    if (url.pathname === '/.well-known/apple-app-site-association') {
      const res = await fetch(request);
      const body = await res.arrayBuffer();          // content unchanged
      const h = new Headers(res.headers);
      h.set('content-type', 'application/json');
      h.set('cache-control', 'no-cache');
      return new Response(body, { status: res.status, headers: h });
    }

    // 2. Serve the invite page for /join/<CODE> without a redirect,
    //    preserving the code as ?c= so the page can read it.
    const m = url.pathname.match(/^\/join\/([A-Za-z0-9]{1,16})\/?$/);
    if (m) {
      const origin = new URL(request.url);
      origin.pathname = '/join/';
      origin.searchParams.set('c', m[1].toUpperCase());
      const res = await fetch(new Request(origin.toString(), request));
      return new Response(res.body, { status: 200, headers: res.headers });
    }

    return fetch(request);
  },
};
```

Deploy: Cloudflare dashboard -> Workers & Pages -> Create Worker -> paste ->
Deploy. Then Settings -> Domains & Routes -> add two routes on zone
`misersavings.com`:

- `misersavings.com/.well-known/*`
- `misersavings.com/join/*`

Free plan covers this (100k requests/day; this is far below that).

**Do not change the AASA file's contents.** It registers `/coach`, `/coach/*`,
`/group/*`, `/join-group`, `/join-group/*`, `/join/*`, `/history`, `/saves`,
`/goals`, `/goals/*`, `/log-save`, `/connect-bank`, `/plaid-oauth` for app ID
`3M6H932HKA.com.misersavings.app`. Dropping any of them breaks a working deep
link. The Worker changes the header only.

## Verify after deploying

```
curl -sI https://misersavings.com/.well-known/apple-app-site-association | grep -i content-type
# must say: application/json

curl -s -o /dev/null -w '%{http_code}\n' https://misersavings.com/join/TESTCODE
# must say: 200

curl -s https://app-site-association.cdn-apple.com/a/v1/misersavings.com
# must still return the same JSON, unchanged
```

Keep the 404 page's JS forwarder afterwards. It costs nothing and it is the
safety net if a Worker route is ever removed.
