import json
from sampling import get_prompt
from sampling import basic_sample
import re
import numpy as np

# taken from https://docs.google.com/spreadsheets/d/1GOdC_YhIXf4d5d8r8lQ1aeS930U3z1Gd7HxByBYyQS8/edit?gid=0#gid=0
golden_sorted_permalinks = ['https://sh.reddit.com/r/clevercomebacks/comments/1dhjoup/clever_community_note/',
 'https://sh.reddit.com/r/facepalm/comments/1dhkp9a/people_are_monsters/',
 'https://sh.reddit.com/r/WhitePeopleTwitter/comments/1dhjvo9/not_sure_if_ive_seen_a_dumber_tweet/',
 'https://sh.reddit.com/r/politics/comments/1dhm58l/thousands_sign_christian_petition_demanding/',
 'https://sh.reddit.com/r/nottheonion/comments/1dhiatf/restaurant_bans_kids_under_5_citing_dirty_diapers/',
 'https://sh.reddit.com/r/AnythingGoesNews/comments/1dhlzc8/ivanka_trump_mocked_after_amazing_dad_post_on/',
 'https://sh.reddit.com/r/PublicFreakout/comments/1dhinku/sneako_gets_his_tooth_broken_by_security/',
 'https://sh.reddit.com/r/mildlyinteresting/comments/1dhhfdf/local_brewery_had_this_sign_and_beer_for_dads_no/',
 'https://sh.reddit.com/r/DunderMifflin/comments/1dhm0ys/sounds_about_right/',
 'https://sh.reddit.com/r/meirl/comments/1dhl38b/meirl/',
 'https://sh.reddit.com/r/FluentInFinance/comments/1dhiuya/hes_not_wrong/',
 'https://sh.reddit.com/r/todayilearned/comments/1dhkead/til_chinese_emperor_qin_er_shi_was_considered_son/',
 'https://sh.reddit.com/r/golf/comments/1dhhqlj/bryson_signing_a_fans_hat_on_his_way_to_the_next/',
 'https://sh.reddit.com/r/MMA/comments/1dhjare/dustin_on_ig_today_lmfao/',
 'https://sh.reddit.com/r/aww/comments/1dhhu8g/my_cat_gave_birth_to_4_kittens_last_month_finally/',
 'https://sh.reddit.com/r/cats/comments/1dhiamk/say_thanks_to_my_grandmother_for_taking_my_cat_to/',
 'https://sh.reddit.com/r/pics/comments/1dhn11v/daniel_radcliffe_is_now_a_tony_award_winner/',
 'https://sh.reddit.com/r/nextfuckinglevel/comments/1dhhily/former_mma_fighter_perfectly_shuts_down_chokes/',
 'https://sh.reddit.com/r/technology/comments/1dhehde/human_missions_to_mars_in_doubt_after_astronaut/',
 'https://sh.reddit.com/r/wholesomememes/comments/1dhgtnz/youre_a_good_dude/',
 'https://sh.reddit.com/r/CozyPlaces/comments/1dhniv6/my_selfconverted_school_bus/',
 'https://sh.reddit.com/r/Unexpected/comments/1dhiqil/this_cat_doesnt_beg/',
 'https://sh.reddit.com/r/Damnthatsinteresting/comments/1dhhnvp/architectural_assignment_completed/']

golden_sorted_scores = [-1,
0,
0,
0,
0,
0,
0,
0,
0,
0.5,
0.5,
0.5,
0.5,
0.5,
1,
1,
1.5,
1.5,
2,
3,
3.5,
4,
5]

golden_permalink_to_score = {l.removeprefix("https://sh.reddit.com"): s for l,s in zip(golden_sorted_permalinks, golden_sorted_scores)}

with open("test_posts.jsonl",'r') as r:
    test_set = [json.loads(line) for line in r]

def score_basic_prompt():
    prompt = get_prompt(test_set[:25])
    results = basic_sample(prompt)
    print(results)
    return score_results(results)

def score_basic_prompt_lower_variance():
    correlations = []
    for i in range(5):
        correlation = score_basic_prompt()
        correlations.append(correlation)
        print(f"{correlation=}")
    print(f'{correlations=}')
    return correlations

def score_results(results:str):
    """results is a sample from claude, where the urls are sorted from best to worst"""
    urls = re.findall("https://[^\s\)]*", results)

    rank_to_permalink = dict()
    for i,url in enumerate(urls):
        for j,post in enumerate(test_set):
            if post['data']['url'] == url:
                rank_to_permalink[i] = post['data']['permalink']

    claude_permalink_to_rank = {v:k for k,v in rank_to_permalink.items()}

    claude_ranks = []
    golden_scores = []
    for permalink in set(golden_permalink_to_score.keys()) & set(claude_permalink_to_rank.keys()):
        claude_ranks.append(claude_permalink_to_rank[permalink])
        golden_scores.append(golden_permalink_to_score[permalink])

    return -np.corrcoef(claude_ranks, golden_scores)[0][1]

if __name__ == '__main__':
    score_basic_prompt_lower_variance()