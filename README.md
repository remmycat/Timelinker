# Update 2022: Please don't use this app in its current state!

While I tried to keep this as secure as possible at the time (by relying on webview/iframe sandboxing and the fact that the visited URLs are mostly trusted), there are still a bunch of security dangers with maintaining any kind of browser, most of which I'm probably not even aware of.

However, the biggest one is that browsers need to be kept as up-to-date as possible to stay secure due to vulnerabilites that get found and patched.

This app hasn't been updated in years, so it's running on outdated versions of Electron, Chromium, and other dependencies.

# Timelinker

### A column-browser for your social timelines

_Built using React & Electron, for **MacOS**, **Windows**, and **Linux**_

Think of it as Tweetdeck, but unopinionated on the social network you use. Twitter, Mastodon, Tumblr, you name it.
Most social networks have nice-to-use mobile websites, while their desktop websites are bloated to make use of all the space they have available. **Timelinker makes use of these mobile sites to allow you to take back your space!**

You can align all your timelines neatly next to each other in a unified view, and even have multiple accounts of the same service open at once, because every Column has its own browser session.

![Timelinker Screenshot showing three timeline columns next to each other. Twitter, Mastodon, and Tumblr](/screenshot.png)
