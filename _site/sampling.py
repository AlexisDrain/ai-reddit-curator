import os
from anthropic import Anthropic
import os

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



