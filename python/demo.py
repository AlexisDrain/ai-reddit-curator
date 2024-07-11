from crawl import get_posts

from sampling import get_prompt, basic_sample



posts = get_posts()

print(f"{posts=}")


prompt = get_prompt(posts)

print(prompt)

print(basic_sample(prompt))


