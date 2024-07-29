from functools import _lru_cache_wrapper, lru_cache
import os
from anthropic import Anthropic
import os
from crawl import get_headers_with_access_token
import requests
from tqdm import tqdm

claude_key = "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"
os.environ["ANTHROPIC_API_KEY"] = claude_key


def basic_sample(prompt: str, model="claude-3-haiku-20240307"):
    # "claude-3-5-sonnet-20240620"
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
        model=model,
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


PROMPT_TEMPLATE_ALEXIS = """Can you help me decide what reddit posts to look at?
I'm going to give a list of reddit posts, and I want you to rate them from 0 to 10.
The best posts are: mind blowing, hilarious, informative, educational, inspiring, or extremely cute.
The worst posts are: ragebait, political, or stupid.
Here are the posts:
<posts>
{POSTS}
</posts>

For each post, write the permalink inside xml tags <permalink></permalink>, write your rating inside <rating></rating>, and write the explanation for your rating inside <comment></<comment>. Then combine those tags into one <post></post> xml tags.
"""

PROMPT_TEMPLATE_ALEXIS_NO_COMMENT = """Can you help me decide what reddit posts to look at?
I'm going to give a list of reddit posts, and I want you to rate them from 0 to 10.
The best posts are: mind blowing, hilarious, informative, educational, inspiring, or extremely cute.
The worst posts are: ragebait, political, or stupid.
Here are the posts:
<posts>
{POSTS}
</posts>

For each post, write the permalink inside xml tags <permalink></permalink>, write your rating inside <rating></rating>. Then combine those tags into one <post></post> xml tags.
"""

PROMPT_TEMPLATE_DAWN_LIST = """Can you help me decide what reddit posts to look at?
I'm going to give a list of reddit posts, and I want you to rate them from 0 to 10.
The best posts are: mind blowing, hilarious, informative, educational, inspiring, or extremely cute.
The worst posts are: ragebait, political, or stupid.
Here are the posts:
<posts>
{POSTS}
</posts>

Write your scores as an enumerated list, like so:
1. (first_score)
2. (second_score)
etc.
"""


def get_prompt(posts, include_comments=False):
    posts_str = ""
    for i, post in tqdm(list(enumerate(posts))):
        # posts_str += f"{i+1}. {post['data']['title']}\n{post['data']['url']}\n" # we don't need an index
        # posts_str += f"{post['data']['title']}\n{post['data']['url']}\n{post['data']['permalink']}\n\n" # Claude cannot read data in ['url']
        if not include_comments:
            posts_str += f"\n<post_{i+1}>\n{post['data']['title']}\n{post['data']['permalink']}\n</post_{i+1}>\n"
        else:
            top_comments = get_top_comments(post)
            posts_str += f"\n<post_{i+1}>\n{post['data']['title']}\n{post['data']['permalink']}\nTop Comments:\n{top_comments}\n</post_{i+1}>\n"
    return PROMPT_TEMPLATE_DAWN_LIST.format(POSTS=posts_str)


#
# Adding comments to each post
#


@lru_cache(1024)
def _get_top_five_comments_with_top_responses(permalink: str):
    headers = get_headers_with_access_token()

    comments_url = f"https://oauth.reddit.com{permalink}.json"
    comments_response = requests.get(comments_url, headers=headers)
    try:
        comments_children = comments_response.json()[1]["data"]["children"]
    except Exception:
        print("*no* comments, hm")
        return ""

    res = ""
    for i, top_node in enumerate(comments_children[:5]):
        try:
            res += f"{i+1}. " + top_node["data"]["body"] + "\n"

            child = top_node["data"]["replies"]["data"]["children"][0]["data"]["body"]
            child = "\n".join(["     " * 1 + line for line in child.split("\n")])
            res += child
        except (KeyError, TypeError):
            pass
        res += "\n\n"
    return res


def get_top_comments(post: dict) -> str:

    # # Step 2: Get the first five posts on r/all
    # url = 'https://oauth.reddit.com/r/all'
    # params = {'limit': limit}
    # response = requests.get(url, headers=headers, params=params)

    # Step 3: Get comments for the post
    return _get_top_five_comments_with_top_responses(post["data"]["permalink"])
