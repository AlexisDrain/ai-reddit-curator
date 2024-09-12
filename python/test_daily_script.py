from datetime import datetime
from pathlib import Path
import json
import os

from crawl import get_posts, get_posts_300

# from sampling import get_prompt, basic_sample
from sampling_images import analyze_reddit_posts

from score_extract import combine_postScores_claudeComments_reddit

from write_date_in_dailyData import write_date_in_index_file


posts_reddit = get_posts_300(300, "all")

# old, claudeComments
# post_scores, post_claudeComments, post_claudeComment_index = analyze_reddit_posts(posts_reddit, allow_claudeComments=True, debug_prompt=False)
# combined_data = combine_postScores_claudeComments_reddit(posts_reddit, post_scores, post_claudeComments, post_claudeComment_index) # combine the data from Claude (permalink, rating,comment) with the data from the reddit crawl (selftext, image url)


post_scores = analyze_reddit_posts(posts_reddit, allow_claudeComments=False, debug_prompt=False)
# uncomment next line for faster/no claude test
# post_scores = [10 for _ in range(len(posts_reddit))] 

combined_data = combine_postScores_claudeComments_reddit(posts_reddit, post_scores, allow_claudeComments=False) # combine the data from Claude (permalink, rating,comment) with the data from the reddit crawl (selftext, image url)

script_dir = Path(__file__).parent.absolute() # Get the directory of the current script
repo_root = script_dir.parent # Navigate up

# output_dir = Path('../website/dailyData')
output_dir = Path(repo_root) / 'website' / 'dailyData'
output_dir.mkdir(parents=True, exist_ok=True)
output_file = output_dir / 'dontsave.json'
output_file.write_text(json.dumps(combined_data, indent=2))
