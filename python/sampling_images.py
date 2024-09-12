import base64
import requests
from anthropic import Anthropic
from typing import List, Dict
import os
from tqdm import tqdm
from io import BytesIO
import json
from score_extract import fetch_gallery_firstImage
import logging

# Example usage
# claude example. Don't use
'''
posts = [
    {
        "title": "Interesting sunset",
        "transcription": "A beautiful orange and purple sunset over the ocean.",
        "image_path": "path/to/sunset_image.jpg"
    },
    # ... more posts ...
]
'''
# retro: original prompt
test_get_prompt = '''
Can you help me decide what reddit posts to look at?
I'm going to give a list of reddit posts, and I want you to rate them from 0 to 10.
The best posts are: mind blowing, hilarious, informative, educational, inspiring, or extremely cute.
The worst posts are: ragebait, political, or stupid.
Here are the posts:
<posts>

<post_1>
Donald Trump's press aide displaying a Jan 6th text from Melania Trump on a jumbotron 
/r/pics/comments/1exxsfw/donald_trumps_press_aide_displaying_a_jan_6th/
flair: Politics
</post_1>

<post_2>
Teen girl sues Detroit judge who detained her after she fell asleep in courtroom
/r/news/comments/1exyix4/teen_girl_sues_detroit_judge_who_detained_her/
</post_2>

<post_3>
The power on this guy
/r/nextfuckinglevel/comments/1extcw1/the_power_on_this_guy/
</post_3>

</posts>

Write your scores as an enumerated list, like so:
1. (first_score)
2. (second_score)
3. (third_score)
etc.

Do NOT add anything else like your reasoning in that list. Make the list ordered in the same order that I gave you.
'''

# this is what we currently use
PROMPT_IMAGES_ONEATATIME = """I'm going to give you a reddit post that might include an image, and I want you to rate it from 0 to 10.
The best posts are: mind blowing, hilarious, informative, educational, inspiring, or extremely cute.
The worst posts are: ragebait, political, stupid, disturbing, sad, or recent USA politics.
Your answer will be a score from 0 to 10. Do NOT add anything else like your reasoning.
"""

PRMOPT_COMMENT_HIGH = """This is a reddit post that Claude has rated it highly. Explain why it's a good post in one sentence.
The best posts are: mind blowing, hilarious, informative, educational, inspiring, or extremely cute.
The worst posts are: ragebait, political, or stupid.
"""
PRMOPT_COMMENT_LOW = """This is a reddit post that Claude has rated it poorly. Explain why it's a bad post in one sentence.
The best posts are: mind blowing, hilarious, informative, educational, inspiring, or extremely cute.
The worst posts are: ragebait, political, or stupid.
"""

# rate if above 9 or below 2: This is bad because then the model makes EVERYTHING above 9 or below 2.
PROMPT_TEST_IMAGES_ONEATATIME_COMMENT = """I'm going to give you a reddit post that might include an image, and I want you to rate it from 0 to 10.
The best posts are: mind blowing, hilarious, informative, educational, inspiring, or extremely cute.
The worst posts are: ragebait, political, or stupid.
Your answer will be a score from 0 to 10. If the score is 9 or higher, or if it's 2 or lower, add your reasoning. Here are 4 examples:
3
9 - This post is mindblowing and hilarious, as it showcases Steve's iconic personality and his humble response to a question about his personal fortune.
7
1 - This post is rage-bait.
"""
# Don't use this. claude runs out of tokens FAST. You should work on posts one at a time.
PROMPT_TEST_IMAGES = """Describe each of the following images using this format:
1. (your description of image 1) (link to image 1)
2. (your description of image 2) (link to image 2)
3. (your description of image 3) (link to image 3)
etc
"""

# debug, describe the image.
PROMPT_TEST_IMAGES_ONEATATIME_IMAGEDEBUG = """I'm going to give you a reddit post that might include an image, and I want you to rate it from 0 to 10.
The best posts are: mind blowing, hilarious, informative, educational, inspiring, or extremely cute.
The worst posts are: ragebait, political, or stupid.
Your answer will be a description of the image and a score from 0 to 10. Do NOT add anything else like your reasoning.
"""

# retro: rate all the posts in one go.
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
3. (third_score)
etc.

Do NOT add anything else like your reasoning in that list. Make the list ordered in the same order that I gave you.
"""
import re
def _extract_first_number(s):
    if s is None:
        Warning(f"Error in _extract_first_number: string is empty.")
        return None
    match = re.search(r'\d+', str(s))
    if match:
        return int(match.group())
    Warning(f"Error in _extract_first_number: could not parse integer.")
    return None

claude_key = os.environ.get("ANTHROPIC_API_KEY")

if not claude_key:
    with open("../_misc/scriptSecret.txt", "r") as file:
        content = file.read()
        claude_key = re.search(r"ANTHROPIC_API_KEY:\s*([\w-]+)", content).group(1)


def analyze_reddit_posts(posts: List[Dict], model: str = "claude-3-haiku-20240307", allow_claudeComments=False, debug_prompt=False):
    client = Anthropic(api_key=claude_key)
    
    def process_post(index):
        content = [{"type": "text", "text": PROMPT_IMAGES_ONEATATIME}]
        post = posts[index]
        posts_str = ""

        # add post info
        if not post['data']['link_flair_text']: # post flair
            post['data']['link_flair_text'] = ""
        else:
            post['data']['link_flair_text'] = "flair: " + post['data']['link_flair_text']
        # We send to Claude the following:
        # title
        # permalink
        # flair
        # selftext
        # image
        posts_str += f"{post['data']['title']}\n{post['data']['permalink']}\n{post['data']['link_flair_text']}\n{post['data']['selftext']}"
        content.append({
            "type": "text",
            "text": posts_str
        })

        if(debug_prompt):
            print(posts_str)
        # Add post image
        imgSource = ""
        
        if "gallery" in post['data'].get('url', ''):
            imgSource = fetch_gallery_firstImage(post['data']['url'])
            if debug_prompt:
                print("gallery url " + imgSource)
            # url. mostly for uploaded images
        elif post['data'].get('url', '').lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')): # .gif uses only the first frame
            imgSource = post['data']['url']
            if debug_prompt:
                print("url " + imgSource)
        # url for newsposts
        elif post['data'].get('thumbnail', '').lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
            imgSource = post['data']['thumbnail']
            if debug_prompt:
                print("thumbnail " + imgSource)
        # url for videos.
        elif post["data"]["is_video"] and post["data"]["preview"]["images"][0]["source"].get('url', '').lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
            try:
                imgSource = post["data"]["preview"]["images"][0]["source"]["url"]
                imgSource = imgSource.replace("&amp;", "&")
                if debug_prompt:
                    print("video thumbnail " + imgSource)
            except (KeyError, IndexError, TypeError):
                print("video thumbnail not found")
                pass  # or set a default value if needed

        if imgSource != "":
            try:
                max_size=5242879 # one bit smaller than 5mb

                # Send a HEAD request first to check the content length
                head_response = requests.head(imgSource, timeout=10)
                content_length = int(head_response.headers.get('Content-Length', 0))
                
                # Estimate base64 size (33% larger than original)
                estimated_base64_size = content_length * 4 // 3
                
                if estimated_base64_size > max_size:
                    print(f"Image is likely too large after base64 encoding (estimated {estimated_base64_size} bytes). Skipping download.")
                    return None
                
                # If the image might be small enough, proceed with GET request
                response = requests.get(imgSource, timeout=10)
                response.raise_for_status()
                
                # Encode to base64
                image_data = BytesIO(response.content)
                base64_image = base64.b64encode(image_data.getvalue()).decode('utf-8')
                
                # Check actual base64 size
                if len(base64_image) > max_size:
                    print(f"Image is too large after base64 encoding ({len(base64_image)} bytes). Discarding.")
                    return None
            
                extension = imgSource.split('.')[-1].lower()
                if extension == "jpg":
                    extension = "jpeg"

                content.append({
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": f"image/{extension}",
                        "data": base64_image
                    }
                })
                
            except requests.RequestException as e:
                Warning(f"Error downloading image from {imgSource}: {e}")
                # Optionally, add a placeholder or error message to the content
            
                    
        message = client.messages.create(
            max_tokens=4096,
            messages=[{"role": "user", "content": content}],
            model=model,
        )
        return message.content[0].text
    
    def process_post_claudeComment(index, rate_high = True):
        if rate_high:
            content = [{"type": "text", "text": PRMOPT_COMMENT_HIGH}]
        else:
            content = [{"type": "text", "text": PRMOPT_COMMENT_LOW}]

        post = posts[index]
        posts_str = ""

        # add post info
        if not post['data']['link_flair_text']: # post flair
            post['data']['link_flair_text'] = ""
        else:
            post['data']['link_flair_text'] = "flair: " + post['data']['link_flair_text']
        # We send to Claude the following:
        # title
        # permalink
        # flair
        # selftext
        # image
        posts_str += f"{post['data']['title']}\n{post['data']['permalink']}\n{post['data']['link_flair_text']}\n{post['data']['selftext']}"
        content.append({
            "type": "text",
            "text": posts_str
        })
        message = client.messages.create(
            max_tokens=4096,
            messages=[{"role": "user", "content": content}],
            model=model,
        )
        return message.content[0].text

    # Process posts in batches
    results = []
    results_comment = []
    results_comment_index = []
    # debug_listOfPosts = []
    for i in tqdm(range(0, len(posts)), desc="Processing posts"):
        result = process_post(index=i)
        results.append(result)
        # debug_listOfPosts.append(posts[i]["data"]["url"])
    
    if debug_prompt:
        print(results)
    if allow_claudeComments:
        for i, score in tqdm(enumerate(results), desc="Adding Claude comments for exceptional posts"):
                try:
                    val = _extract_first_number(score)
                    if val is not None:
                        if val >= 9:
                            comment = process_post_claudeComment(i, rate_high=True)
                            results_comment.append(comment)
                            results_comment_index.append(i)
                        if val <= 2:
                            comment = process_post_claudeComment(i, rate_high=False)
                            results_comment.append(comment)
                            results_comment_index.append(i)
                except Exception as e:
                    logging.warning(f"sampling_images: Error processing score at index {i}: {score}. Error: {str(e)}")
        
        if debug_prompt:
            print(results_comment)
            print(results_comment_index)
        return results, results_comment, results_comment_index

    return results


    '''
    # Combine and summarize results
    final_summary = client.messages.create(
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": f"Here are the analyses of Reddit posts in batches. Please provide a final summary and recommendation:\n\n{''.join(results)}"
            }
        ],
        model=model,
    )
    return final_summary.content[0].text
    '''


'''
def get_prompt(posts, include_comments=False):
    posts_str = ""
    for i, post in tqdm(list(enumerate(posts))):
        # posts_str += f"{i+1}. {post['data']['title']}\n{post['data']['url']}\n" # we don't need an index
        # posts_str += f"{post['data']['title']}\n{post['data']['url']}\n{post['data']['permalink']}\n\n" # Claude cannot read data in ['url']
        if not include_comments:
            if not post['data']['link_flair_text']:
                post['data']['link_flair_text'] = ""
            else:
                post['data']['link_flair_text'] = "\nflair: " + post['data']['link_flair_text']
            posts_str += f"\n<post_{i+1}>\n{post['data']['title']}\n{post['data']['permalink']}{post['data']['link_flair_text']}\n</post_{i+1}>\n"
        else:
            top_comments = get_top_comments(post)
            posts_str += f"\n<post_{i+1}>\n{post['data']['title']}\n{post['data']['permalink']}\nTop Comments:\n{top_comments}\n</post_{i+1}>\n"
    return PROMPT_TEMPLATE_DAWN_LIST.format(POSTS=posts_str)
'''
