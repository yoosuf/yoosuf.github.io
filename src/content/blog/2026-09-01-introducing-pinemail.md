---
title: "Introducing Pine Mail: A Tiny SMTP Mail Catcher for Developers and AI Agents"
author: Yoosuf Mohamed
date: 2026-09-01 00:00:00
excerpt: ""
layout: post
permalink: /blog/introducing-pinemail
published: true
description: "Why I built Pine Mail: a single-binary SMTP mail catcher in Rust with a REST API and MCP server for automated testing and AI agents."
categories: ["Engineering", "AI & Tech"]
tags: ["Rust", "Open Source", "DevOps", "AI", "Testing"]
---

We are living in an era where an AI coding agent can scaffold an entire full-stack application in two prompts, spin up cloud infrastructure, and generate fifty integration tests before you've finished your morning coffee.

Yet the moment that automated test suite or browser agent encounters this one innocent sentence:

*“Please enter the 6-digit verification code sent to your email.”*

Everything collapses.

The test suite hangs. The CI pipeline times out. The AI agent starts hallucinating or burns ten thousand tokens trying to scrape a webmail dashboard. And the developer sighs, pulls up a browser tab, clicks around an inbox UI, copies an OTP code, and pastes it into a terminal by hand.

In 2026, we have solved distributed consensus, edge computing, and neural code generation. But testing email verification is still fundamentally broken.

A few weeks ago, after repeating that manual dance for the fourth time on a Friday afternoon while debugging a password-reset flow, I decided I had reached my limit.

So I built **Pine Mail**.

## The absurd problem with testing email

If you build web applications, you already know the frustration. When an application sends an email during local development or end-to-end testing, you have three traditional options, and all three come with annoying compromises:

1. **The Cloud Sandbox SaaS (Mailtrap, SendGrid Sandbox, etc.)**  
They solve the basic problem of not blasting test spam to real users. But now your local test suite depends on an external network connection, third-party API keys, webhook configurations, and monthly subscription tiers. Why should testing an authentication flow running on `localhost:3000` require making API calls across the Atlantic?

2. **The Classic Local Catchers (MailHog, Mailpit)**  
These are genuinely great open-source tools, and I've used Mailpit happily for years. But they were designed primarily for human eyes looking at a browser tab. When you want to automate them inside a Playwright test or a CI runner, you run into the same friction:
- You have to write clumsy `while true; sleep(2); poll_api()` loops in your test suite to wait for the email to land.
- The assertion frequently runs a split second before the SMTP server flushes to disk, resulting in flaky, non-deterministic test failures.
- When the email finally arrives, you receive a massive, unparsed multipart MIME payload. You then spend the next hour writing and debugging fragile regexes to pluck out the six-digit code from deeply nested HTML tables.

3. **The AI Agent Wall**  
This is the real kicker. I am running more and more workflows where autonomous agents (Claude Code, Cursor, Windsurf, browser agents) drive our test suites and verify feature implementations end-to-end. Asking an LLM agent to navigate a webmail UI via headless browser vision is slow, fragile, and expensive. And asking it to curl an arbitrary REST endpoint and parse raw MIME headers leads to subtle hallucinations.

Agents need a clean, structured, native way to interact with email. They need to be able to say: *"Wait for the verification email sent to `test@local`, give me the OTP code, and tell me when it's done."*

That was the itch. Pine Mail is the scratch.

## What Pine Mail actually is

Pine Mail is a lightweight, single-binary SMTP mail catcher built specifically for local development, automated test suites, and autonomous AI agents.

You point your application's SMTP configuration at `localhost:1025`. It intercepts every email sent by your app. You can view the messages in a clean web UI at `localhost:8025`, query them via a REST API, or connect an AI agent directly using its native Model Context Protocol (MCP) server.

It doesn't require a cloud account, doesn't require Docker (though a Docker image is available), and doesn't ask for credentials. It's a single static binary written in Rust that compiles the server, SQLite storage, and the embedded web frontend into an executable under 15MB.

No JVM warming up. No Node.js runtime idling in the background. It starts in under 5 milliseconds and sits comfortably at 12MB of RAM.

## The two features that change everything

I didn't want to build just another clone of Mailpit. Pine Mail was built around two specific capabilities designed to eliminate test flakiness and agent friction.

### 1. Long-polling built into the HTTP API (`GET /api/wait`)

The worst part of testing asynchronous messaging is polling. You send an email in your test, and then you either throw an arbitrary `sleep(3)` into your code (which slows down CI) or you poll a list endpoint every 500ms (which adds noise and causes race conditions).

Pine Mail solves this at the protocol level with a long-polling wait endpoint:

```bash
# Wait up to 15 seconds for an email matching these filters
curl "http://localhost:8025/api/wait?to=user@example.com&subject=Verify&timeout_ms=15000"
```

The HTTP request stays open. The instant the SMTP listener finishes processing the incoming message, the server pushes the completed message payload back over the connection and closes the request. If the email doesn't arrive before the timeout, it returns a clean 408.

Zero `sleep()` calls in your test harness. Zero polling loops. Your assertions run the millisecond the email exists.

### 2. Automatic signal and token extraction (`/api/messages/:id/extract`)

In 95% of automated test scenarios, you do not care about the MIME boundary delimiters, the CSS styling of the hero header, or the tracking pixels. You care about two things:

- What was the verification code?
- What was the magic link / password reset URL?

Pine Mail runs incoming email bodies through a dedicated signal extraction engine. When you query the extraction endpoint:

```bash
curl "http://localhost:8025/api/messages/msg_01J6XYZ.../extract"
```

It returns structured JSON:

```json
{
  "codes": ["849201"],
  "links": [
    "http://localhost:3000/auth/verify?token=d8f1e09a8b2c4d5e"
  ],
  "action_urls": [
    "http://localhost:3000/auth/verify?token=d8f1e09a8b2c4d5e"
  ]
}
```

It recognizes 4 to 8-digit numeric and alphanumeric OTPs, magic login links, password reset URLs, and confirmation triggers. You never have to write regexes in your test scripts again.

## What this looks like in an automated test

Here is a practical example. Suppose you are writing an end-to-end authentication test in Python using Playwright or `requests`.

Instead of juggling browser tabs or sleeping:

```python
import requests

# 1. Trigger the signup in your application
signup_resp = requests.post("http://localhost:3000/api/signup", json={
    "email": "sarah@company.test",
    "password": "CorrectHorseBatteryStaple!"
})
assert signup_resp.status_code == 201

# 2. Block until Pine Mail receives the verification email (no sleep needed)
email = requests.get(
    "http://localhost:8025/api/wait",
    params={
        "to": "sarah@company.test",
        "subject": "Confirm your account",
        "timeout_ms": 10000
    }
).json()

# 3. Pull the OTP code straight out of the parsed signals
extracted = requests.get(f"http://localhost:8025/api/messages/{email['id']}/extract").json()
otp_code = extracted["codes"][0]

# 4. Submit the verification code
verify_resp = requests.post("http://localhost:3000/api/verify-email", json={
    "email": "sarah@company.test",
    "code": otp_code
})
assert verify_resp.status_code == 200
```

The test is fast, robust, and completely deterministic. If the email delivery fails inside your app, the test fails immediately on the timeout without hanging indefinitely.

## The native MCP server for AI agents

This is where things get genuinely fun.

Model Context Protocol (MCP) has rapidly become the standard way AI agents interact with local developer tools. Pine Mail ships with a dedicated MCP server binary (`pinemail-mcp`) that exposes the entire inbox to your AI agents as native callable tools.

Whether you're using Claude Desktop, Cursor, Windsurf, Claude Code, or an autonomous framework, you configure the server in your MCP settings:

```json
{
  "mcpServers": {
    "pinemail": {
      "command": "pinemail-mcp",
      "env": {
        "PINEMAIL_URL": "http://localhost:8025"
      }
    }
  }
}
```

Once wired up, your agent has access to seven targeted tools:
- `wait_for_email` (blocks until matching email arrives)
- `extract_signals` (pulls OTP codes and URLs)
- `list_messages` (queries inbox with pagination)
- `get_message` (fetches full HTML, plain text, and MIME data)
- `delete_message` (cleans up a specific message)
- `clear_inbox` (resets state between test runs)
- `send_test_email` (injects a simulated test message)

Now, you can hand your agent a high-level task:

> *"Use the browser to register a new account as alex@test.local, wait for the confirmation email, extract the verification link, visit it to complete registration, and confirm that the user dashboard renders."*

The agent navigates to your signup page, fills in the form, calls the `wait_for_email` tool, retrieves the extracted URL via `extract_signals`, navigates directly to the confirmation link, and validates the dashboard.

No brittle webmail scraping. No custom bash glue. The agent just does the job.

## Why Rust? (And how it's engineered)

People always ask why I chose Rust for this instead of Go or TypeScript.

I don't rewrite tools in Rust just for the sake of writing Rust. But for developer tooling that sits in the background of your daily workflow, three constraints matter:

1. **Zero runtime overhead:** When I'm developing, Docker containers, language runtimes, and background daemons consume battery and RAM quickly. Pine Mail compiles to a single, statically linked binary. It starts instantly and uses barely 12MB of resident memory.
2. **Single-file distribution:** The web frontend (built with React and Vite) is embedded directly into the Rust executable at compile time using `rust-embed`. There are no `node_modules`, no static asset directories to configure, and no external HTML files to keep track of. One file on disk does everything.
3. **Resilience under load:** SMTP connections and WebSocket streams can easily lead to memory leaks or deadlocks if not handled cleanly. Tokio's async runtime handles hundreds of simultaneous SMTP connections effortlessly, while SQLite in WAL (Write-Ahead Logging) mode guarantees fast, reliable persistence without locks freezing the UI.

The codebase is organized as a clean cargo workspace with three focused crates:

- `pinemail-core`: Contains the SQLite storage engine, MIME parsing logic, signal extraction rules, and shared domain models.
- `pinemail-server`: Houses the Tokio-based SMTP server (port 1025), the Axum HTTP REST API, and the embedded WebSockets inbox dashboard (port 8025). This is the primary binary.
- `pinemail-mcp`: The Model Context Protocol stdio server that translates MCP tool calls into HTTP queries against the server.

For CI environments, you can pass `--memory` to run Pine Mail with an in-memory SQLite database. Tests run at lightning speed, and when the process exits, zero temporary files are left on disk.

## Quick start

You can get Pine Mail running in your environment in less than 30 seconds.

### Via Docker

If you prefer containers, the official image is on Docker Hub:

```bash
docker run -d \
  --name pinemail \
  -p 1025:1025 \
  -p 8025:8025 \
  -v pinemail-data:/data \
  yoosuf/pinemail:latest
```

Open `http://localhost:8025` to view the inbox, and point your application's SMTP host to `localhost:1025`.

### From source

If you have the Rust toolchain installed:

```bash
git clone https://github.com/yoosuf/pinemail.git
cd pinemail
cargo build --release
./target/release/pinemail
```

That's all it takes.

## What's on the roadmap

Pine Mail is currently at `v0.1.0`. I've been running it in local development and in automated agentic test suites for several weeks, and it has already replaced both Mailhog and Mailtrap across my personal workflow.

A few capabilities I'm actively working on for upcoming releases:

- **Incoming mail webhooks:** Register a webhook endpoint so Pine Mail pushes an HTTP POST payload to your local server the moment a matching message arrives.
- **Configurable rate-limiting simulation:** The ability to simulate real-world email provider throttling and temporary greylisting errors (421/450 responses) to test your application's email queue backoff logic.
- **IMAP read-only interface:** For legacy apps or desktop email clients that insist on fetching mail via IMAP rather than checking a REST API.

## Wrap up

Software development has gotten dramatically faster over the last two years, but we often overlook the mundane friction points that break our flow. Email verification shouldn't be the thing that slows down an automated deployment or confuses an AI agent.

Pine Mail is free, open source under the MIT license, and ready for you to poke at:

- GitHub repository: [github.com/yoosuf/pinemail](https://github.com/yoosuf/pinemail)
- Docker Hub: [hub.docker.com/r/yoosuf/pinemail](https://hub.docker.com/r/yoosuf/pinemail)

If you find a bug, want a new feature, or want to contribute to the codebase, open an issue or submit a pull request. I'd love to hear how you're using it in your test suites and agent setups.

— Yoosuf
