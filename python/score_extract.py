import re
from copy import deepcopy
import requests
import logging
import os
import time

old_test_data = """
Here is the list of posts with my ratings and comments:

<post>
<permalink>/r/interestingasfuck/comments/1ebdyv5/early_dementia_warning_signs/</permalink>
<rating>8</rating>
<comment>This post is informative and educational, providing important information about early signs of dementia. It's relevant and interesting.</comment>
</post>

<post>
<permalink>/r/BeAmazed/comments/1ebbsdw/before_and_after_limb_lengthening/</permalink>
<rating>9</rating>
<comment>This post is mind-blowing and amazing, showcasing the incredible medical advancements in limb lengthening procedures. It's both informative and visually striking.</comment>
</post>

<post>
<permalink>/r/politics/comments/1ebcexk/elon_musk_is_spending_millions_to_elect_trump/</permalink>
<rating>2</rating>
<comment>This post is political in nature and seems to be ragebait, attempting to stir up controversy rather than provide objective information. It's not the type of content I would recommend.</comment>
</post>

<post>
<permalink>/r/MadeMeSmile/comments/1eb8iid/his_mum_fainted_and_he_went_and_asked_for_help/</permalink>
<rating>8</rating>
<comment>This post is heartwarming and inspiring, showcasing a young person's compassion and concern for their mother. It's the kind of content that can brighten someone's day.</comment>
</post>

<post>
<permalink>/r/mildlyinfuriating/comments/1eb8h1p/my_wife_has_donated_hundreds_of_hours_time_to_our/</permalink>
<rating>7</rating>
<comment>This post is mildly infuriating, as it highlights an instance of entitled behavior and lack of appreciation for someone's volunteer efforts. It's a relatable and relevant post.</comment>      
</post>

<post>
<permalink>/r/Damnthatsinteresting/comments/1eb99c9/the_worlds_thinnest_skyscraper_in_new_york_city/</permalink>
<rating>8</rating>
<comment>This post is interesting and informative, showcasing an impressive architectural feat. It's the kind of content that can spark curiosity and appreciation for engineering and design.</comment> 
</post>

<post>
<permalink>/r/HumansBeingBros/comments/1eb8k09/his_mum_fainted_and_he_went_and_asked_for_help/</permalink>
<rating>9</rating>
<comment>This post is heartwarming and inspiring, highlighting the kindness and compassion of a young person. It's the kind of content that can restore faith in humanity and bring a smile to people's faces.</comment>
</post>

<post>
<permalink>/r/comics/comments/1eb7l0u/time_to_go/</permalink>
<rating>7</rating>
<comment>This comic post is creative and thought-provoking, dealing with the theme of mortality and the passage of time. It's the kind of content that can spark introspection and discussion.</comment> 
</post>

<post>
<permalink>/r/BlackPeopleTwitter/comments/1eb7kri/biden_as_ally_a_matter_of_words_vs_deeds/</permalink>
<rating>5</rating>
<comment>This post is political in nature and could be considered ragebait, as it seems to be criticizing a political figure. While it raises a valid point, the content is not the kind I would recommend for most users.</comment>
</post>

<post>
<permalink>/r/pics/comments/1ebci2b/rashida_tlaib_during_satanyahus_congressional/</permalink>
<rating>6</rating>
<comment>This post is political in nature and could be considered ragebait, as it seems to be highlighting a controversial political moment. While it may be of interest to some, it's not the kind of content I would recommend for most users.</comment>
</post>
</post>

"""

'''
# Old. expects the tags above. We moved on to making the sampling a list instead of an XML file
def extract_tags(fullText):

    postPattern = r"<post>(.*?)</post>"
    matches = re.findall(postPattern, fullText, re.DOTALL)
    posts = [dict() for _ in range(len(matches))]
    for i, match in enumerate(matches):
        permalink = (
            re.search(r"<permalink>(.*?)</permalink>", match, re.DOTALL)
            .group(1)
            .strip()
        )
        rating = re.search(r"<rating>(.*?)</rating>", match, re.DOTALL).group(1).strip()
        # comment = re.search(r'<comment>(.*?)</comment>', match, re.DOTALL).group(1).strip()

        posts[i]["permalink"] = permalink
        posts[i]["rating"] = rating
        posts[i]["comment"] = "No comment"  # comment

    return posts
'''

def parse_enumerated_list(claude_sample: str) -> list[int]:
    res = []
    for line in claude_sample.splitlines():
        if "." not in line:
            continue
        line_count, score = line.split(".")
        line_count = int(line_count)
        score = int(score)
        assert line_count == len(res) + 1
        res.append(score)
    return res


def test_parse_enumerated_list():
    my_sample = """Here you go friend:
    1. 8
    2. 3
    3. 9
Hope you enjoy!"""
    assert parse_enumerated_list(my_sample) == [8, 3, 9]

"""
def test_image_sample_results():
    example = ['2. The cozy Amsterdam summer garden studio post is highly rated as it showcases a beautifully designed and inviting living space that is both aesthetically pleasing and creates a sense of comfort and relaxation for the viewer.', '3. This post showcases an impressive LOTR-themed living room that is highly detailed, cozy, and visually appealing, making it an excellent example of a "mind-blowing" and "inspiring" post on the r/CozyPlaces subreddit.', '4. The reddit post you provided is highly rated by Claude because it appears to be a visually stunning and cozy living space that evokes a sense of maximalist, playful, and whimsical design, which can be considered "mind-blowing" and "extremely cute" based on the criteria you provided.']
    assert parse_image_claudeComment(example) 
"""


'''How to convert galleries to our website:
    start with: https://www.reddit.com/gallery/1eem8zd
    [replace gallery with comments and add .json]
    https://www.reddit.com/comments/1eem8zd.json
    [0][data][children][0][gallerydata][0][id] get the id and put it in https://i.redd.it/
    https://i.redd.it/d22w83turcfd1.jpg
'''


client_id = os.environ.get("REDDIT_CLIENTID_2")
secret = os.environ.get("REDDIT_SECRET2")

if not client_id:
    with open("./../_misc/scriptSecret.txt", "r") as file:
        
        content = file.read()
        client_id = re.search(r"REDDIT_CLIENTID:\s*([\w-]+)", content).group(1)
        secret = re.search(r"REDDIT_SECRET:\s*([\w-]+)", content).group(1)

def get_headers_with_access_token():
    # taken from https://ssl.reddit.com/prefs/apps/
    # REDDIT_SECRET2

    # Step 1: Get an access token
    auth = requests.auth.HTTPBasicAuth(client_id, secret)
    data = {"grant_type": "client_credentials"}
    headers = {"User-Agent": "AIRedditCurator/1.0 by my_tummy_hurts"}
    res = requests.post(
        "https://www.reddit.com/api/v1/access_token",
        auth=auth,
        data=data,
        headers=headers,
    )
    token = res.json()["access_token"]
    headers = {**headers, **{"Authorization": f"Bearer {token}"}}
    return headers


def fetch_gallery_firstImage(url="https://www.reddit.com/gallery/1eem8zd"):
    try:
        # Add a user agent to avoid potential 429 errors
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        # {
        #     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        #     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        #     'Accept-Language': 'en-US,en;q=0.5',
        #     'Accept-Encoding': 'gzip, deflate, br',
        #     'DNT': '1',
        #     'Connection': 'keep-alive',
        #     'Upgrade-Insecure-Requests': '1'
        # }


        # new url after replace: "https://www.reddit.com/comments/1eem8zd.json"
        gallery_json = url.replace("gallery", "comments")
        gallery_json += ".json"

        time.sleep(0.2) # small delay

        response = requests.get(gallery_json, headers=headers, timeout=10)
        response.raise_for_status() # Check if the request was successful
        
        # Parse the JSON data
        data = response.json()
        
        id_ = str(data[0]["data"]["children"][0]["data"]["gallery_data"]["items"][0]["media_id"])

        return f'https://i.redd.it/{id_}.jpg'
    
    except requests.RequestException as e:
        print(f"An error occurred while fetching the data: {e}")
        return None

def combine_postScores_claudeComments_reddit(posts, scores, claudeComments=None, claudeComments_index=None, allow_claudeComments=False):
    # Initialize combined_posts as a list of dictionaries
    combined_posts = []

    for i, (score, full_post) in enumerate(zip(scores, posts, strict=True)):
        # Create a new dictionary for each post
        combined_post = {}

        # Add score
        try:
            if isinstance(score, (int, float, str)):
                combined_post["rating"] = score
            elif isinstance(score, dict):
                combined_post.update(score)
            else:
                raise TypeError(f"Unexpected type for score: {type(score)}")
        except TypeError as e:
            # Log the error
            logging.warning(f"score_extract: Error processing score at index {i}: {e}")
            # Optionally, you can set a default value or skip this score
            combined_post["rating"] = None  # or any default value you prefer

        # Add Reddit post data
        combined_post.update({
            k: full_post["data"][k] for k in ["permalink", "url", "title", "selftext", "thumbnail", "link_flair_text", "author"]
        })
        
        if full_post["data"]["is_video"] and full_post["data"]["preview"]["images"][0]["source"]["url"]:
            imgSource = full_post["data"]["preview"]["images"][0]["source"]["url"]
            imgSource = imgSource.replace("&amp;", "&")
            combined_post["thumbnail"] = imgSource

        if "gallery" in full_post["data"]["url"]:
            combined_post["thumbnail"] = fetch_gallery_firstImage(full_post["data"]["url"])

        #elif combined_post["thumbnail"] in ["self", "default"]:
        #    combined_post["thumbnail"] = ""
        
        if allow_claudeComments:
            # Add Claude comment if the index is in claudeComments_index
            if i in claudeComments_index:
                comment_index = claudeComments_index.index(i)
                combined_post["claudeComment"] = claudeComments[comment_index]

        combined_posts.append(combined_post)

    return combined_posts

# [Depricated. Doesn't handle images or claudeComments]
def combine_claude_reddit_crawl(
    scored_claude_posts: list[dict | int], reddit_posts
) -> list[dict]:
    if isinstance(scored_claude_posts[0], int):
        scored_claude_posts = [{"rating": r} for r in scored_claude_posts]
    combined_posts = deepcopy(scored_claude_posts)
    reddit_posts = deepcopy(reddit_posts)

    # print(combined_posts[0])
    # print(reddit_posts[0])
    for scored_post, full_post in zip(combined_posts, reddit_posts, strict=True):
        scored_post.update({
            k: full_post["data"][k] for k in ["permalink", "url", "title", "selftext", "thumbnail", "link_flair_text", "author"]
        })

        # [This is deleted because of anthropic safety]
        # For NSFW posts
        # if full_post.get("over_18", False):
        #     scored_post["over_18"] = True

        # [Deprecated Video because I cannot sync video+audio easily]
        # For videos: Add the fallback_url if it exists
        if "gallery" in full_post['data'].get('url', ''):
            print(full_post["data"]["url"])
        if full_post["data"]["is_video"]:
            try:
                videoThumbnail = full_post["data"]["preview"]["images"][0]["source"]["url"]
                videoThumbnail = videoThumbnail.replace("&amp;", "&")
                scored_post["thumbnail"] = videoThumbnail
            except (KeyError, IndexError, TypeError):
                print("video thumbnail not found")
                pass  # or set a default value if needed
            

    return combined_posts


"""
python python/score_extract.py
"""
