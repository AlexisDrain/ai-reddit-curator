# import requests
# import secrets
# from functools import lru_cache
# import os
# from anthropic import Anthropic
# import os

claude_key = "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"
os.environ['ANTHROPIC_API_KEY'] = claude_key

def basic_sample(prompt:str):
    client = Anthropic(
        # This is the default and can be omitted
        api_key=os.environ.get("ANTHROPIC_API_KEY"),
    )

    message = client.messages.create(
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="claude-3-haiku-20240307",
    )
    return message.content[0].text


PROMPT_TEMPLATE = """Can you help me decide what reddit posts to look at?
I'm going to give a list of reddit posts, and I want you to rank them from best to worst.
The best posts are: mind blowing, hilarious, informative, educational, inspiring, or extremely cute.
The worst posts are: ragebait, political, or stupid.
Here are the posts:
<posts>
{POSTS}
</posts>

Write your ranking as an enumerated list, and include the url for each post along with an explanation for its rating.
"""


def get_prompt(posts):
    posts_str = ""
    for i,post in enumerate(posts):
        posts_str += f"{i+1}. {post['data']['title']}\n{post['data']['url']}\n"
    return PROMPT_TEMPLATE.format(POSTS=posts_str)





# Replace the placeholders with your actual values
client_id = "6Hef4rlP_2-rMq5Qfeox5w"
# response_type = "code"
# random_string = secrets.token_urlsafe(16)
# redirect_uri = "https://github.com/AlexisDrain/Claude-Reddit-Curator"
# duration = "permanent"
# scope_string = "read"

# url = f"https://www.reddit.com/api/v1/authorize?client_id={client_id}&response_type={response_type}&state={random_string}&redirect_uri={redirect_uri}&duration={duration}&scope={scope_string}"

# response = requests.get(url)

# if response.status_code == 200:
#     print("Request successful!")
#     print(response.text)
# else:
#     print(f"Request failed with status code: {response.status_code}")



@lru_cache
def get_headers_with_access_token():
    # taken from https://ssl.reddit.com/prefs/apps/
    secret = "c0aOfsj7xRn3JzuoJC2EPfeVlHiQAA"

    # Step 1: Get an access token
    auth = requests.auth.HTTPBasicAuth(client_id, secret)
    data = {'grant_type': 'client_credentials'}
    headers = {"User-Agent": "AIRedditCurator/1.0 by my_tummy_hurts"}
    res = requests.post('https://www.reddit.com/api/v1/access_token',
                        auth=auth, data=data, headers=headers)
    token = res.json()['access_token']
    headers = {**headers, **{'Authorization': f'Bearer {token}'}}
    return headers




# subreddit name "all" as in r/all.
# time_filter "all" as in the top of all time
def get_posts(limit=10, subredditName="all", sortByTop=False, time_filter='all'):
    headers = get_headers_with_access_token()

    # Step 2: Get the first five posts on r/all
    if sortByTop:
        url = f'https://oauth.reddit.com/r/{subredditName}/top'
        params = {'limit': limit,
                't': time_filter,
                'sort': "top",
                }
    else:
        url = f'https://oauth.reddit.com/r/{subredditName}'
        params = {'limit': limit}

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        posts = response.json()['data']['children']
        return posts
        for post in posts:
            print(post['data']['title'])
    else:
        print(f"Request failed with status code: {response.status_code}")


print(f"{posts=}")


prompt = get_prompt(posts)

print(prompt)

print(basic_sample(prompt))


