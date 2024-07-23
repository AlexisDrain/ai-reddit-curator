from crawl import get_posts

from sampling import get_prompt, basic_sample



posts = get_posts() # this is the 100 posts from reddit
# print("get posts()" + f"{posts=}")


prompt = get_prompt(posts) # this converts the posts into the prompt
# print("get_prompt()" +prompt)

print("basic_sample()\n" + basic_sample(prompt)) # this returns the message from Claude


