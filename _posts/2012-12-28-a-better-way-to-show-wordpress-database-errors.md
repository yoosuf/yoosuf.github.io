---
ID: 319
title: A Better Way to Show WordPress Database Errors
author: Yoosuf
date: 2012-12-28 15:30:31
excerpt: ""
layout: post
permalink: /blog/a-better-way-to-show-wordpress-database-errors/
published: true
---

If you visit this website often, you may see some downtime issues (due to the Amazon Cloud server issues). and so many times i felt terrible with that message and finally thought of overriding the WordPress Database Error message and give a better look and feel for the user. to achieve this I followed a <a href="http://digwp.com/2009/11/custom-database-error-page/">blog post</a> of <a title="@perishable" href="http://twitter.com/perishable">Jeff Starr</a> and luckily it worked.

[caption id="attachment_322" align="aligncenter" width="976"]<img class="size-full wp-image-322 " alt="Better way to display WordPress Database Error" src="http://s3.amazonaws.com/yoosuf.me/wp-content/uploads/2012/12/better-way-to-show-wordpress-errors.png" width="976" height="818" /> Better way to display WordPress Database Error[/caption]

Create a file named with <code>db-error.php</code> under <code>wp-content</code> directory and copy and paste the following code. Also style it as you wish.

<pre>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
&lt;meta charset="utf-8"&gt;
&lt;title&gt;Terribly sorry :(&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;div class="container"&gt;
&lt;h1&gt;Terribly sorry &lt;span&gt;:(&lt;/span&gt;&lt;/h1&gt;
&lt;p&gt;I am sorry, looks like the Amazon Cloud Servers are't responding or having some technical issues right now.&lt;/p&gt;
&lt;p&gt;Sometimes refreshing the browser may work, hit on the refresh button or press CMD + R / CTRL + F5&lt;/p&gt;

&lt;/div&gt;
&lt;script type="text/javascript"&gt;

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'YOUR GOOGLE ANALYTICS ID']);
_gaq.push(['_setDomainName', 'YOUR DOMAIN']);
_gaq.push(['_setAllowLinker', true]);
_gaq.push(['_trackPageview']);
_gaq.push(['_setCustomVar', 1, '500 Error', 'Error site Loaidng', 1]);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

&lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;</pre>

And share this anywhere you like.
