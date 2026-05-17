# Miser facts — what the editor must not get wrong

Internal reference for the Miser Blog Editor agent. The other project files (BLOG_EDITOR.md, the canonical posts, about.html, faq.html, index.html) give you voice and worldview. This file gives you the load-bearing facts about the product, the company, and the things you must not claim.

Last updated: 2026-05-17.

---

## What Miser is, in one paragraph

Miser is a behavioral savings app for iPhone. The core loop is *catch → skip → lock*: you catch yourself about to spend money you don't actually need to spend (the coffee, the delivery, the impulse click), you log it as a skip in the app, and the money you didn't spend gets pulled from your linked checking account into your linked savings account. Every Sunday, the week's skips bundle into one ACH transfer between your own accounts. Miser never holds your money. Your funds sit in your own bank accounts, in your own name, the entire time.

That's it. That's the product. Everything else — goals, quit-companion, groups, ranks — is built on top of that one loop.

---

## The company

**MiserSavings Inc.** — Delaware C-Corp. Headquartered in Austin, Texas. Founded March 2026. Pre-launch as of this writing (waitlist phase, iOS app in development).

**Founders:**
- **Magdalena** — co-founder and CEO. The default blog byline.
- **Gardar** — co-founder. Builds the app. Occasional bylines on built-in-public engineering pieces (set `author: Gardar, co-founder` in those post frontmatter).

We use first names only on the public surface. Last names appear in legal documents and regulatory filings.

---

## How the money actually moves

This matters because it's the most-misunderstood part of the product.

- The user links a **checking account** (source) and a **savings account** (destination). Both are accounts they already have at their own bank.
- Bank linking and ACH transit happen through a regulated banking-infrastructure partner — the user authenticates with their bank inside the partner's secure flow. Miser never sees the user's bank login.
- Identity verification (KYC, SSN last 4) is handled by the partner, not by Miser.
- Each Sunday, the partner initiates one ACH transfer from the user's linked checking account to their linked savings account, for the week's total skips.
- Miser is not a custodian. Miser never holds funds. Money never sits on Miser's balance sheet.

**Important — provider selection is in flight.** As of 2026-05-17, Miser is actively evaluating multiple banking-infrastructure providers (Stripe, Plaid, Astra, and others) for both bank-linking and ACH transit. No final partner has been selected and no provider name should be treated as load-bearing in editorial copy.

**You may name in posts:** Anthropic (AI Coach inference), Supabase (database).

**Do NOT name in posts:** Any specific banking, ACH, or bank-link provider — including Stripe, Stripe Financial Connections, Stripe Treasury, Plaid, Plaid Transfer, Astra, GoCardless, Paynote, Dwolla, Increase, Unit, Column, Synctera, Treasury Prime, DriveWealth, Moov. Conversations are ongoing and the decision is not final. Refer to "our banking partner," "our ACH partner," or "a regulated banking-infrastructure provider" generically. The actual name will be disclosed in-app before any user opens an account.

---

## Pricing posture (TBD on the public surface)

The website's public position is: **withdrawals are free. A small service fee applies to the Sunday batch. The exact fee schedule is shown in-app before any money moves, and the user explicitly accepts it.**

That's the line the blog and marketing must hold. **Do not quote a specific batch fee percentage or cap on the blog.** The in-app legally-binding terms quote a working price; the public marketing surface intentionally lags that until launch so we can adjust without re-papering everything.

**Things you may always say:**
- Withdrawals are free.
- Holding a Miser account is free.
- No subscriptions, ever.
- Miser does not earn a spread on your savings. The bank pays you whatever interest the bank pays you.
- The fee schedule is disclosed in full and requires explicit acceptance before any money moves.

**Things you may never say:**
- Any specific percentage or dollar cap for the fee.
- That Miser is "always free" (it isn't — there's a small batch fee).
- That Miser pays interest (it doesn't — your bank does).

---

## What we no longer do (and don't reference)

Things the agent must NOT bring up as current Miser features:

- **No tier system.** Bronze / Silver / Gold / Diamond tiers were scrapped. They had mechanical effects (lock periods, fee discounts) that we don't believe in. The new **Ranks** system is purely cosmetic — see below.
- **No $3.49 withdrawal fee.** That was a previous pricing model. Withdrawals are now free.
- **No custodial banking model.** Miser is non-custodial — the user's money lives in their own bank accounts. We are not, and will not be, holding deposits on our own balance sheet. The specific provider that powers bank-linking and ACH transit is still being chosen (see "How the money actually moves" above); the non-custodial framing is firm regardless of who we pick.
- **No tier-named character avatars.** Profile avatars are now photo-or-initials only.
- **No "demo" page on the public site** — it's been retired.

---

## What we're firm on (the non-negotiables)

These are values, not features. They show up in copy and editorial all the time.

- **We don't sell user data for money.** Ever.
- **We don't share user data for advertising.** No third-party ad SDKs in the app. No ad-tracking pixels on the website.
- **We don't run a partner-offers program by default.** Partner offers are **opt-in**, and the only data point ever disclosed to a vetted partner brand is the user's savings goal category (e.g., "travel," "emergency fund"). Never the name, balance, skip log, bank data, or free-text goal name. Off by default. One toggle to leave.
- **We don't moralize.** Posts never shame a reader for spending. We notice; we don't lecture.
- **No affiliate marketing on the blog.** Ever. Conflict of interest, regulator bait, brand-erosive.
- **No "Top 10 cashback apps" content.** We're a fintech, not a media business.

---

## Compliance lines to never cross

Hard limits. These have real legal exposure.

- **Never promise a specific APY.** Frame as "what most online banks offer right now" or "the interest your bank pays you." Never "you'll earn 4% with Miser."
- **Never claim FDIC insurance applies to funds held by Miser.** Miser doesn't hold funds. FDIC applies at the user's own bank, on their own savings account, per their bank's coverage. The blog can say "FDIC insurance applies to your savings account at your bank" — never "FDIC-insured with Miser."
- **Never give individualized financial advice.** The blog argues categories ("microsaving works"). It does not tell a specific reader what to do with their next paycheck.
- **Never imply Miser is a bank, advisor, or broker.** Miser is a financial technology company. Not a bank. Not a registered investment advisor. Not a broker-dealer.
- **Never reproduce the Coach's exact in-app voice in the blog.** The Coach has its own register (terse, direct, sometimes 6-word messages). The blog is essayistic. They share a worldview, not a voice.

---

## Current product features (true as of 2026-05-17)

- **Skip log.** The core action. Tap, amount, category, optional note.
- **Goals.** Multiple parallel savings goals (a trip, an emergency fund, a quit fund). Each skip is tagged to one.
- **Quit Companion.** A mode for people quitting a habit (cigarettes, alcohol, gambling, etc.). The user sets the daily cost of the habit; each daily check-in auto-skips that amount into the vault. Routes to a "quit goal" by default.
- **Groups.** Shared goals between friends or partners. Everyone skips into their own vault; the group bar fills as everyone contributes.
- **Ranks.** Nine-rank cosmetic recognition ladder, earned by paired streak + lifetime-locked thresholds. *Apprentice → Pocket → Tight → Steady → Sworn → Iron → Veteran → Master → Grand.* Purely cosmetic. No mechanical effects. Identity, not perks.
- **Miser Coach.** Anthropic-powered messages that surface streak, momentum, and one thing to focus on each day. Calls users by rank in some contexts. Not a financial advisor.
- **Withdraw.** Free, any amount, any time. Uses a reflection card + 3-second hold-to-confirm instead of a fee — friction designed as honesty, not as a penalty.

---

## Brand basics

- **The name.** *Miser* in body copy. *MiserSavings Inc.* only in legal/regulatory contexts. *mı$er* in the wordmark/logo.
- **Tagline.** *Skip · Lock · Stack.*
- **Palette.** Deep green (#1C3D2B), gold (#C8A820), parchment (#EDE8D0), cream (#F5F0E0), bronze (#8B6914). Use these names in copy ("the gold dollar sign," "the deep-green hero card") if a post needs to reference visual elements; don't quote hex codes in editorial.
- **Platform.** iOS first. Android close behind. iPhone-only at launch.
- **Geography.** US-only at launch. Future expansion possible but not imminent.

---

## When in doubt

If a fact comes up in a post draft that isn't here, in BLOG_EDITOR.md, or in the canonical posts: ask before publishing. Don't invent. Miser is a fintech; getting product facts wrong erodes the only thing we sell, which is trust.
