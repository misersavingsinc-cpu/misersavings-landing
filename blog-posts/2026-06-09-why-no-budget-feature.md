---
slug: why-no-budget-feature
title: Why Miser doesn't have a *budget feature*
description: Every personal finance app eventually builds a budget. We decided not to. Here's the thinking, and what we built instead.
date: 2026-06-09
category: Built in public
next: goal-vs-guilt-machine
---

At some point in building Miser, someone on every call we took would ask the same question: "Will you add budgeting?"

It's a reasonable question. Budgeting is what personal finance apps do. It's the expected feature. We talked about it seriously for a while.

Then we decided not to build it, and not to build it on purpose.

## What a budget feature would have cost us

Adding a budget feature isn't just a feature. It's a product philosophy.

A budget feature says: the problem is that you don't know where your money goes. If we show you clearly enough, and let you set limits clearly enough, you'll spend less.

We wrote about why we don't think that's true. The short version: awareness of spending has never been the bottleneck for most households. People know, roughly, that they're spending too much on delivery or Amazon or whatever their category is. Showing them a cleaner pie chart of the thing they already knew doesn't close the gap.

More than that, a budget feature would have required us to become a tracking product. To pull in all your transactions. To categorize them. To build a dashboard that shows you last month's damage. To become, essentially, a better-looking Mint.

> We didn't want to build a retrospective tracker. We wanted to build something that shows up before the money moves.

## What we built instead

The core of Miser is a skip. You see a purchase you were about to make, you pass on it, and you log it. The money you would have spent gets set aside and moves to your savings automatically every 7 days, on your personal cycle day.

That's a very small product surface compared to a full budget. No categories. No monthly review screen. No red bars.

What it does instead: it acts at the moment of decision, not after. The skip is a present-tense thing. A budget is a past-tense thing with future-tense ambitions. Those are genuinely different products, and they're based on different theories of what actually changes behavior.

We also built Goals, which is the closest we come to the budget world. You name something you're saving toward and track progress. But a goal in Miser is a destination, not a constraint. It doesn't yell at you if you ordered delivery last Tuesday. It just shows you how close you are to the thing you said you wanted.

## What this means for people who like budgeting

If you're a spreadsheet person who does a monthly review and finds it genuinely useful, Miser is probably not your primary tool. We're not trying to replace that.

What we're trying to do is different: we're trying to be useful to the much larger group of people for whom the night-before budget ritual never stuck. People who have tried Mint, YNAB, Copilot, a spreadsheet, and a notes app, and still have less saved than they'd like. Not because they lack information about their spending, but because none of those tools were present at the moment it mattered.

For that person, adding a budget feature to Miser would make us worse, not better. More surface area, more friction, more of the thing that didn't work the first time.

<div class="callout">
<strong>We might be wrong.</strong> This is a deliberate product bet, not a permanent position. If we find that the people using Miser are consistently asking for something budget-adjacent and it would genuinely help them, we'll build it. We just won't build it because it's expected, or because every other app has one.
</div>

The shortest version of our product philosophy: the best time to think about saving is when you're about to spend. Everything we build is aimed at that moment.
