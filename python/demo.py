from crawl import get_posts

from sampling import get_prompt, basic_sample



posts = get_posts()

print("get posts()" + f"{posts=}")


prompt = get_prompt(posts)

print("get_prompt()" +prompt)

print("basic_sample()" +basic_sample(prompt))


