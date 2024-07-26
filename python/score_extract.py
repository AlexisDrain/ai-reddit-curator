import re

test_data = """
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

def extract_tags(fullText):

    postPattern = r'<post>(.*?)</post>'
    matches = re.findall(postPattern, fullText, re.DOTALL)
    posts = [dict() for _ in range(len(matches))]
    for i, match in enumerate(matches):
        permalink = re.search(r'<permalink>(.*?)</permalink>', match, re.DOTALL).group(1).strip()
        rating = re.search(r'<rating>(.*?)</rating>', match, re.DOTALL).group(1).strip()
        comment = re.search(r'<comment>(.*?)</comment>', match, re.DOTALL).group(1).strip()


        posts[i]["permalink"] = permalink
        posts[i]["rating"] = rating
        posts[i]["comment"] = comment
            
    return posts

def combine_claude_reddit_crawl(claude_posts, reddit_posts):
    combined_posts = claude_posts

    for i, c_post in enumerate(claude_posts):
        for r_post in reddit_posts:
            if c_post.get("permalink") == r_post["data"]["permalink"]:
                combined_posts[i]["title"] = r_post["data"]["title"]
                if r_post["data"]["selftext"]:
                    combined_posts[i]["selftext"] = r_post["data"]["selftext"]
                if r_post["data"]["url"] : # this is normally an image
                    combined_posts[i]["url"] = r_post["data"]["url"]
                continue

    return combined_posts

"""
python python/score_extract.py
"""