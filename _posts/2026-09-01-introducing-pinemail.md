---
title: "Introducing Pine Mail: A Tiny SMTP Mail Catcher for Developers and AI Agents"
author: Yoosuf Mohamed
date: 2026-09-01 08:00:00
excerpt: ""
layout: post
permalink: /blog/introducing-pinemail
published: true
description: "Why I built Pine Mail, a single-binary SMTP mail catcher in Rust with a REST API and MCP server for e2e testing and AI agents."
categories: ["Engineering"]
tags: ["Rust", "Open Source", "DevOps", "AI", "Testing"]
---

I was testing a password reset flow for the third time that afternoon, flipping between my test-email provider's dashboard and my app, trying to pick the right OTP out of a cluttered inbox UI. Then I needed to test it again with a different account. Reset. Log back in to the mail dashboard. Find the email. Copy the code. Repeat.

At some point I just got annoyed enough to fix it myself, which is how most of my side projects start.

If you've done any amount of QA work, or built anything with email verification, you know this dance. Mailtrap and Mailhog and the rest all solve the "don't send real email in dev" problem fine. What none of them solved for me was the *next* problem: getting the email's contents back into my test script or my AI agent without babysitting a browser tab.

So I built **Pine Mail**.

## What it is

Pine Mail is a small SMTP mail catcher for local development. You point your app's SMTP client at `localhost:1025`, it captures whatever gets sent, and you look at it — either in a web inbox at `localhost:8025`, or through a REST API, or through an MCP server if you're wiring up an AI agent.

It's the same idea as Mailpit or Mailtrap, honestly — I'm not claiming to have invented the mail-catcher. What's different is that it's written in Rust and ships as one binary (server, UI, and SQLite storage, all under 15MB), and it was built assuming the thing reading the inbox might be a script or an agent, not just me clicking around.

No credentials, no cloud account, no signup form. That was the whole point.

## Why bother building another one

A couple of reasons, and I'll be honest that the second one is really why this exists.

First, I wanted something genuinely boring to run. No JVM warming up, no Node process idling in the background, just a binary you start and forget. Build once, ship once, run it on Linux, macOS, or in Docker.

Second — and this is the actual itch — I'm doing more and more testing where an AI agent is the one driving the browser, not me. And agents are bad at "go check your email" unless you give them a real way to do it. Clicking around a web-based inbox isn't something an agent should have to fake. So the whole thing is built around a REST API first, with the web UI as a nice-to-have on top:

```bash
# Long-poll for an email matching a filter
GET /api/wait?to=user@example.com&subject=Verify&timeout_ms=15000
```

The server blocks until a matching email shows up (or times out), then hands back the full message. No sleep(2) loops in your test suite, no flaky race conditions where the assertion runs a beat before the email lands.

And then there's the MCP server, which is really the part I'm most pleased with. Pine Mail ships an MCP (Model Context Protocol) server that exposes the inbox as tools an agent can call directly — Claude, Copilot, Cursor, whatever you're using. Point it at Pine Mail and it can:

- List captured emails
- Wait for one matching a filter
- Pull OTP codes and magic links straight out of the body
- Delete a message, or clear the whole inbox

Which means you can hand an agent a task like "sign up, verify the email, log in" and it doesn't need you to hand-write the email-scraping logic. It just asks Pine Mail for the email.

## What's actually in it

- SMTP on port 1025 — no auth, no relaying, it only ever accepts mail, never sends it anywhere.
- A web UI and REST API on port 8025, with live updates over WebSockets so new mail just appears.
- HTML and plain-text bodies, raw MIME headers, attachments, bulk delete — the usual inbox stuff.
- A paginated, infinite-scroll inbox that doesn't fall over once you've got 10,000 test emails sitting in it.
- `GET /api/wait` for long-polling, `GET /api/messages/:id/extract` for pulling OTPs and links out automatically.
- An MCP server with seven tools (list, get, wait, extract, delete, clear, send-test).
- SQLite underneath, with automatic pruning, or fully in-memory if you don't want anything persisted at all.
- No runtime dependencies beyond the binary itself — Docker is optional, not required.

## Getting it running

Fastest path is Docker Hub, no build step involved:

```bash
docker run -d \
  --name pinemail \
  -p 1025:1025 \
  -p 8025:8025 \
  -v pinemail-data:/data \
  yoosuf/pinemail:latest
```

That's it. Open `http://localhost:8025`, point your app at `localhost:1025`, done. I checked it on both amd64 and arm64 (my M-series Mac, plus a Raspberry Pi I had lying around) before calling it good.

### If you'd rather build it yourself

I get it, some people don't like running things they can't read. Clone it and build:

```bash
git clone https://github.com/yoosuf/pinemail.git
cd pinemail
cargo build --release
./target/release/pinemail
```

Same ports either way — SMTP on `1025`, UI on `8025`.

### Wiring it into an agent

If you're on Claude Desktop, Copilot, or Cursor, the MCP config is just:

```json
{
  "mcpServers": {
    "pinemail": {
      "command": "pinemail-mcp",
      "env": { "PINEMAIL_URL": "http://localhost:8025" }
    }
  }
}
```

Ask your agent to "wait for an email from support@example.com with subject 'Password Reset'" and it does exactly that. No regex you wrote at 11pm, no manual extraction step.

## Where this is actually useful

I'll admit most "here's why my tool is great" sections in blog posts are padding, so I'll keep this to what I've actually used it for.

Testing a three-step signup with email verification used to mean: trigger the signup, tab over to Mailhog, find the email, copy the OTP by hand, tab back, paste it, continue. With Pine Mail's `/api/wait` endpoint, that whole dance turns into a few lines in the test itself:

```python
# Trigger signup
response = requests.post("http://api.myapp.local/signup", json=data)

# Wait for verification email (blocks until it arrives)
email = requests.get(
    "http://localhost:8025/api/wait",
    params={"to": "testuser@example.com", "subject": "Verify", "timeout_ms": 10000}
).json()

# Extract OTP
codes = requests.get(f"http://localhost:8025/api/messages/{email['id']}/extract").json()
otp = codes['codes'][0]

# Continue test
requests.post("http://api.myapp.local/verify", json={"otp": otp})
```

Nothing clever here, which is the point — the boring parts of the test stay boring, and you're not babysitting a browser tab waiting for an email to land.

The more interesting case, for me at least, is handing this off entirely to an agent. I've had a Claude-driven test run through "sign up as test@example.com, verify the email, set a password, log in" as a single instruction — it posts the signup, calls the MCP `wait_for_email` tool, pulls the link out with `extract_signals`, clicks it, sets the password, and logs in. I didn't write any of the email-handling code for that run. It just used the tools.

And then there's the plain, low-stakes version: I'm building a password-reset screen, I run Pine Mail in one terminal and my app in another, trigger the reset, and click the link straight out of the inbox at `localhost:8025`. No throwaway Gmail accounts, no rate limits interrupting me mid-flow.

## Why Rust, since people ask

Honestly, if you're just running the Docker image, the language underneath shouldn't matter to you at all — that's kind of the point of shipping a single binary.

But for me, building it, Rust mattered. One binary, no runtime to install, no "works on my machine" arguments about Node versions. It stays memory-light even with a few thousand emails sitting in the inbox, async I/O keeps the WebSocket connections and SMTP sessions cheap, and the type system caught a handful of bugs for me before they ever became 2am debugging sessions.

If you want to hack on it, you'll need the Rust toolchain, obviously. The codebase is a monorepo and reasonably tidy — I've tried to keep it that way on purpose, since I'd like other people to actually contribute rather than bounce off it.

## How it's put together, if you're curious

Three crates:

- `pinemail-core` — the shared library: SQLite storage, MIME parsing, the regex-based OTP/link extraction.
- `pinemail-server` — the SMTP server plus the HTTP API and UI. This is the binary you actually deploy.
- `pinemail-mcp` — the MCP stdio server, run as its own process if you want an agent talking to Pine Mail.

The frontend is React and Vite, but it gets embedded into the binary at build time, so there's no separate asset bundle to manage or serve.

If you want to add a feature, it usually belongs in `core` first, then gets exposed from `server` and `mcp` — that way it shows up in the REST API, the MCP tools, and the UI all at once, instead of getting bolted onto just one of them.

## What's next, and what isn't yet

Pine Mail is at v0.1.0 and I've been using it in real agentic test runs for a few weeks now — signup flows, password resets, magic links. It holds up.

Things I still want to add: an IMAP fallback for apps that insist on IMAP instead of SMTP, some rate-limiting so you can simulate a mail provider that isn't infinitely generous, webhooks for triggering things when mail arrives, and a better attachments UI (right now it's functional, not pretty).

None of that is blocking anyone from using it today, though.

## If you want to poke at it

- Docker Hub, fastest way to try it: [`yoosuf/pinemail`](https://hub.docker.com/r/yoosuf/pinemail) — tags `latest`, `0.1.0`, more coming.
- GitHub, if you want the source or want to contribute: [yoosuf/pinemail](https://github.com/yoosuf/pinemail). It's a small project and I'd genuinely like help with it, so don't be shy about opening an issue even for something small.
- If something's broken or confusing, tell me. I'd rather hear about it than have you quietly give up on it.

I built this because I was tired of clicking through an inbox to find a six-digit code. If you're in the same boat — or if your test suite is increasingly being driven by an agent instead of a person — give it a run.

— Yoosuf
