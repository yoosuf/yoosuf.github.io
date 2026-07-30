---
ID: 1928
title: "WordPress: How to trigger the Post publish event"
author: Yoosuf Mohamed
date: 2016-02-28 17:51:26
excerpt: ""
layout: post
permalink: /blog/wordpress-how-to-trigger-the-post-publish-event/
published: true
description: "How to hook into and trigger the WordPress post-publish event for custom automation."
categories: ["Engineering"]
tags: ["WordPress", "WordPress Hooks", "PHP", "Automation"]
---

These days I'm working on a news publishing app, focused on its back-end API. Now that we're in the final stage of development, we've started adding push notifications, so I needed a way to trigger an event the moment a WordPress post is published, in order to send push notifications to Android and iOS devices. While experimenting with WordPress functions, I came up with this solution, which is handy, and I believe it'll be useful for anyone wanting to build a similar feature.

By the way, if you know a better way to handle this, please let me know. Improvements are always welcome for apps dealing with millions of users, right?

<script src="https://gist.github.com/yoosuf/3890f3789754afe65525.js"></script>

You can find the gist at <a href="https://gist.github.com/yoosuf/3890f3789754afe65525">https://gist.github.com/yoosuf/3890f3789754afe65525</a>.
