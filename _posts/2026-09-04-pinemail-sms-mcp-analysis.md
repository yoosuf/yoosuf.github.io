---
title: "Beyond Email: Dual-Channel SMS Catching, 14 MCP Tools, and Email Analysis in Pine Mail"
author: Yoosuf Mohamed
date: 2026-09-04 00:00:00
excerpt: ""
layout: post
permalink: /blog/pinemail-sms-mcp-analysis
published: true
description: "Pine Mail grows from a tiny SMTP catcher into a dual-channel auth testing hub: SMS catching with Twilio webhooks, 14 MCP tools for AI agents, and Litmus-style email analysis."
categories: ["Engineering", "AI & Tech"]
tags: ["Rust", "Open Source", "DevOps", "AI", "Testing", "SMS"]
---

A few days after shipping [Pine Mail](https://yoosuf.me/blog/introducing-pinemail)—the tiny, single-binary SMTP mail catcher with a native Model Context Protocol (MCP) server—the feedback started rolling in. Mostly from people running autonomous agents and headless browser test runners, the Claude Codes and Cursors and Windsurfs of the world, plus a fair few plain old Playwright CI pipelines.

The core stuff had landed well. Server-side long-polling on `/api/wait`, automatic OTP extraction, no more polling loops or regex puzzles. Test suites were passing faster, CI stopped timing out on async email, and agents were completing signup flows without getting stuck on a verification link.

But the same theme kept coming back, phrased slightly differently each time:

> "Email catching is great, but our app needs SMS 2FA for login. How does my test agent get the SMS code?"

That one cut deeper than I expected. It took me a beat to realize why.

## Email was only half the problem

Modern authentication rarely relies on email alone. Think about the actual flow of most production apps: an email confirmation link, sure, and then straight into a 6-digit SMS code sent over Twilio, AWS SNS, or Vonage. One channel verifies the address, the other proves possession of a phone. They cooperate.

My mail catcher could handle the first leg flawlessly and then hit a brick wall on the second. And that's a genuinely weird failure mode, because the whole point of a local catcher is to remove the flakiness and the manual copy-pasting from your test loop. If the developer still has to fish a text message off their phone, or spin up some cloud sandbox with another API key, the tool hasn't actually finished its job.

So I took it back to the workshop, and spent the last couple weeks turning a lightweight SMTP catcher into something that looks a lot more like a dual-channel authentication testing hub. Here's what changed.

## Dual-channel SMS catching and Twilio webhooks

Pine Mail now ships with a real SMS catcher inside the same binary, sitting alongside the SMTP engine:

```
                  ┌──────────────────────────────┐
                  │          Pine Mail           │
                  │                              │
  SMTP (:1025) ───┼─► Email Store (MIME/HTML)    ├─┐
                  │                              │ │ Web UI & REST API (:8025)
  HTTP (:8025) ───┼─► SMS Store (JSON / Twilio)  ├─┼─► 14 MCP Tools (stdio)
                  └──────────────────────────────┘ │ Long-polling Engine
                                                   └─► Signal Extractor (OTP/URLs)
```

No separate mock service, no third-party sandbox account. It captures SMS through two routes:

1. **Direct REST ingestion (`POST /api/sms`)** — push structured JSON from your test drivers or a local notification service.
2. **Native Twilio webhook parsing (`POST /api/sms/webhook`)** — point your app's Twilio client or webhook dispatcher straight at Pine Mail and it unpacks the standard `x-www-form-urlencoded` fields (`From`, `To`, `Body`) into the captured log.

The embedded React dashboard on `localhost:8025` grew a dual-tab layout to match, so you can flip between emails and SMS in real time. New messages push in over a WebSocket (`ws://localhost:8025/api/events`) rather than waiting for a refresh.

### SMS long-polling and extraction

The email wait endpoint got a sibling. You pause server-side until an SMS lands:

```bash
# Long-poll up to 10 seconds for an SMS to +15550100
curl "http://localhost:8025/api/sms/wait?to=%2B15550100&timeout_ms=10000"
```

And the signal extractor got one too, so the 4-to-8 digit code and any embedded URLs come back ready to use:

```json
{
  "codes": ["839201"],
  "links": []
}
```

No regexes, no fragile string slicing in your test files.

## Fourteen MCP tools, or: agents can now do full MFA

The original `pinemail-mcp` server exposed seven tools. Adding the SMS channel meant I couldn't just leave it at seven—an agent that can read email but not text messages is back to the same dead end. So the MCP stdio server now exposes fourteen tools, one set per channel:

| Email tools | SMS tools |
|---|---|
| `list_emails` | `list_sms` |
| `get_email` | `get_sms` |
| `wait_for_email` | `wait_for_sms` |
| `extract_signals` | `extract_sms_signals` |
| `send_test_email` | `send_test_sms` |
| `delete_email` | `delete_sms` |
| `clear_inbox` | `clear_sms_inbox` |

This is the part that makes me grin. An agent driving a browser can now finish an entire multi-factor flow without breaking character:

> *"Sign up a new user, verify their email, enable 2FA with phone +15550199, grab the SMS OTP, and complete the login."*

It calls `wait_for_email`, follows the confirmation link, calls `wait_for_sms`, pulls `codes[0]` out of the extract response, types it into the browser, done. In seconds. Natively, over MCP, no browser vision, no webmail scraping.

## Email analysis, the not-so-glamorous part

While I was in there, I added something that wasn't on anyone's request list but solves a quiet pain: `GET /api/messages/:id/analysis`. Because catching an email is one thing—knowing whether that same email is going to render or land in spam in production is another entirely.

```bash
curl "http://localhost:8025/api/messages/msg_01J6XYZ.../analysis"
```

It runs two passes over each captured HTML email:

1. **A compatibility check** across eleven formatting factors that trip up legacy clients like Outlook, Gmail mobile, and older Apple Mail—missing `<!DOCTYPE html>`, flexbox or grid where a table would be safer, un-inlined `style` blocks, images without `alt` text or explicit dimensions, payloads creeping past the ~102KB clipping threshold.
2. **A heuristic spam score** in the spirit of SpamAssassin—text-to-HTML ratio imbalances, uppercase and exclamation-mark clusters, suspicious link shorteners or mismatched anchor hrefs, missing plain-text MIME alternatives.

Neither pass replaces a real rendering test or a real spam filter. It's a fast, deterministic signal you can assert against in CI before code merges, and honestly sometimes that's all you need to catch the email that was doomed the moment it was written.

## Killing the race condition for real

The flakiness that bites hardest in async testing is the gap between triggering an action and starting to wait for the result. The message arrives and you weren't listening yet. I wanted that gone.

Both `/api/wait` and `/api/sms/wait` now accept an ISO-8601 `since` timestamp:

```javascript
// 1. Capture the exact timestamp BEFORE triggering the action
const since = new Date().toISOString();

// 2. Trigger the SMS 2FA request in your app
await api.requestSmsOtp({ phone: "+15550199" });

// 3. Long-poll against the pre-captured timestamp
const res = await fetch(`http://localhost:8025/api/sms/wait?to=%2B15550199&since=${since}`);
```

If the SMS lands in the few milliseconds before your fetch connects, Pine Mail checks `received_at >= since` and hands it back instead of missing it. And for tidying up between test runs, there are bulk endpoints to match: `POST /api/messages/bulk-delete` and `/api/sms/bulk-delete`, plus `PATCH /api/messages/bulk-read` and `/api/sms/bulk-read` to mark batches seen.

## A full SMS 2FA test, start to finish

Here's what the whole thing looks like from the test's point of view in modern Node.js:

```javascript
import fetch from 'node-fetch';

async function testSmsAuthentication() {
  const userPhone = "+15550199";

  // 1. Record the timestamp prior to triggering the SMS
  const since = new Date().toISOString();

  // 2. Ask your app to send the SMS 2FA code
  await fetch("http://localhost:3000/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: userPhone }),
  });

  // 3. Long-poll Pine Mail until the SMS arrives
  const waitRes = await fetch(
    `http://localhost:8025/api/sms/wait?to=${encodeURIComponent(userPhone)}&since=${since}&timeout_ms=10000`
  );
  const sms = await waitRes.json();

  // 4. Pull the OTP straight out of the body
  const extractRes = await fetch(`http://localhost:8025/api/sms/${sms.id}/extract`);
  const { codes } = await extractRes.json();
  const otpCode = codes[0]; // e.g. "839201"

  // 5. Complete the login
  const loginRes = await fetch("http://localhost:3000/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: userPhone, code: otpCode }),
  });

  console.log("MFA Login Success:", loginRes.status === 200);
}

testSmsAuthentication();
```

No arbitrary sleeps, no scraping a dashboard, no timing guesswork. Just deterministic, and it completes in well under fifty milliseconds.

## Installing it

Nothing about the install story changed, which is the point. Still one static binary, still about 15MB, React frontend embedded inside, still no JVM or Node runtime idling in the background.

There are a few more distribution paths now though:

- **Homebrew:** `brew tap yoosuf/tap && brew install pinemail` (and `brew services start pinemail` if you want it running as a background service)
- **One-liner installers:** a `curl | sh` script for macOS and Linux, and a PowerShell equivalent for Windows
- **Native packages:** `.deb` for Debian/Ubuntu, `.rpm` for Fedora/RHEL, an AUR package, plus Scoop, Winget, and Chocolatey for Windows
- **Docker Hub:** `docker run -d -p 1025:1025 -p 8025:8025 yoosuf/pinemail:latest`

## Where it goes from here

Pine Mail started as a way to stop copy-pasting OTP codes out of my own inbox, and it's grown into a single-binary multi-channel auth catcher built for an era where the "developer" testing a feature might be a spell of tokens on a headless browser. I'm not sure I fully predicted that, but I'm not complaining either.

If you're writing Playwright integration tests, running CI, or standing up autonomous agents with Claude or Cursor, give it a spin against your real MFA flow and see if it holds up where the old catchers didn't.

- GitHub: [github.com/yoosuf/pinemail](https://github.com/yoosuf/pinemail)
- Docker Hub: [hub.docker.com/r/yoosuf/pinemail](https://hub.docker.com/r/yoosuf/pinemail)
- Product Hunt: [producthunt.com/products/pinemail](https://www.producthunt.com/products/pinemail)

The repo's `AGENTS.md` and `ARCHITECTURE.md` cover integration and design. Drop an issue or a PR if you hit a wall, and tell me what feels missing next—I genuinely want to hear how this behaves under the weird auth flows people keep throwing at it.

— Yoosuf
