# Claude-Reddit-Curator  
https://alexisdrain.github.io/ai-reddit-curator/  

We use Claude to rate content from reddit.  

That way you can see the best of the best (posts that are awe-inspiring, laugh-out-loud hilarious, or educational) while avoiding the worst (ragebait or doomscroll'y).  

This site uses Claude 3 Haiku and it is updated daily using Github Actions. We fetch posts from r/all, which is a diverse subreddit that exhibits the daily posts that reach the front page of Reddit (It's so diverse that most subreddits appear less than twice per 100 posts). We then feed the posts to Claude 3 Haiku which rates them. Then we show you a sorted list of the highest scoring posts split into various categories like "educational" or "cute."  

This website is non-commercial. We use the official Reddit API to crawl once a day. The data we crawl is not used for training the AI.  

This site was made by me, [Alexis Drain](https://github.com/AlexisDrain) (front-end, TypeScript), and [Dawn Drain](https://github.com/DawnDrain) (back-end, Python). [Send me an email](mailto:AlexisDrain97@gmail.com) with feedback if you love or hate AI Reddit Curator!  

Check out my other work, such as the browser extension [Less Addictive YouTube](https://addons.mozilla.org/en-US/firefox/addon/less-addictive-youtube/)... or [my 15 web games](https://alexclay.itch.io/)!

### Android build instructions:  
The Android studio project is located in this repository [here](https://github.com/AlexisDrain/ai-reddit-curator/tree/main/website/my-app/android).  


### Credits:  
Icons from https://iconsvg.xyz/  
chevron-right.svg  
play-circle.svg  
settings.svg  
lock.svg  
trash.svg  

### Photo of web version:
![Photo of web version in action](https://raw.githubusercontent.com/AlexisDrain/ai-reddit-curator/refs/heads/main/_misc/screenshots/Web-screenshot.png)  
