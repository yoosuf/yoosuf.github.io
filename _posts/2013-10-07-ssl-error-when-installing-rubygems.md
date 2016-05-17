---
ID: 1490
post_title: SSL Error When installing rubygems
author: Yoosuf Muhammad
post_date: 2013-10-07 11:05:46
post_excerpt: ""
layout: post
permalink: /blog/ssl-error-when-installing-rubygems/
published: true
---
Recently i got an issue saying <code>Gem::RemoteFetcher::FetchError: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed (https://s3.amazonaws.com/production.s3.rubygems.org/gems/fast-stemmer-1.0.2.gem)</code> and mostly struggle to work with my code, and finally, found the solution in the <a href="http://stackoverflow.com/a/19151697" target="_blank">Stackoverflow</a> and it helped me to carry on working with the code.

Make sure you use latest rvm:
<pre>rvm get stable</pre>
Then you can do two things:

Update certificates:
<pre>rvm osx-ssl-certs update all</pre>
Update rubygems:
<pre>rvm rubygems latest</pre>