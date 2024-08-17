import re
from copy import deepcopy



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

        # For videos: Add the fallback_url if it exists
        if full_post["data"].get("media") and full_post["data"]["media"].get("reddit_video"):
            scored_post["fallback_url"] = full_post["data"]["media"]["reddit_video"].get("fallback_url")

    return combined_posts


"""
python python/score_extract.py
"""
