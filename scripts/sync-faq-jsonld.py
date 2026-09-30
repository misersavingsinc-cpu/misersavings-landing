# Make every FAQPage answer in faq.html's JSON-LD equal to the visible answer text.
import re, json, html, sys
p = sys.argv[1]
s = open(p).read()
ld_m = re.search(r'(<script type="application/ld\+json">)(.*?)(</script>)', s, re.S)
d = json.loads(ld_m.group(2))
def visible(name):
    h = '<h2 class="faq-q">' + html.escape(name, quote=False) + '</h2>'
    i = s.find(h)
    if i < 0:
        h = '<h2 class="faq-q">' + name + '</h2>'; i = s.find(h)
    assert i >= 0, name
    j = s.find('<h2 class="faq-q">', i + len(h)); j = len(s) if j < 0 else j
    seg = s[i + len(h):j]
    paras = re.findall(r'<p class="faq-a">(.*?)</p>', seg, re.S)
    assert paras, name
    t = ' '.join(html.unescape(re.sub(r'<[^>]+>', '', x)) for x in paras)
    return re.sub(r'\s+', ' ', t).strip()
changed = []
for q in d['mainEntity']:
    v = visible(q['name'])
    if q['acceptedAnswer']['text'] != v:
        q['acceptedAnswer']['text'] = v; changed.append(q['name'])
# Rewrite each changed "text" in place so the file's formatting is kept.
out = ld_m.group(2)
for q in d['mainEntity']:
    if q['name'] not in changed: continue
    pat = re.compile(r'("name": ' + re.escape(json.dumps(q['name'])) + r',\s*"acceptedAnswer": \{\s*"@type": "Answer",\s*"text": )"(?:[^"\\]|\\.)*"')
    out, n = pat.subn(lambda m: m.group(1) + json.dumps(q['acceptedAnswer']['text'], ensure_ascii=False), out)
    assert n == 1, q['name']
json.loads(out)
s = s[:ld_m.start(2)] + out + s[ld_m.end(2):]
open(p, 'w').write(s)
# verify
d2 = json.loads(out); body = html.unescape(re.sub(r'<[^>]+>', '', s.replace(out, '')))
bad = [q['name'] for q in d2['mainEntity'] if q['acceptedAnswer']['text'] not in re.sub(r'\s+',' ',body)]
print('changed:', changed); print('still mismatched:', bad); print('em dashes left in JSON-LD:', out.count('—'))
