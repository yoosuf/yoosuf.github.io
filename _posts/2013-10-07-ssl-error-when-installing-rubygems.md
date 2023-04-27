---
ID: 1490
title: SSL Error When installing rubygems
author: Yoosuf
date: 2013-10-07 11:05:46
excerpt: ""
layout: post
permalink: /blog/ssl-error-when-installing-rubygems/
published: true
---

Recently i got an issue saying `Gem::RemoteFetcher::FetchError: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed (https://s3.amazonaws.com/production.s3.rubygems.org/gems/fast-stemmer-1.0.2.gem)` and mostly struggle to work with my code, and finally, found the solution in the [Stackoverflow](http://stackoverflow.com/a/19151697) and it helped me to carry on working with the code.

Make sure you use latest rvm:
`rvm get stable`
Then you can do two things:

Update certificates:
`rvm osx-ssl-certs update all`
Update rubygems:
`rvm rubygems latest`
