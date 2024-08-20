from datetime import datetime
from pathlib import Path
import json
import os

from crawl import get_posts

from sampling import get_prompt, basic_sample

from score_extract import parse_enumerated_list, combine_claude_reddit_crawl

from write_date_in_dailyData import write_date_in_index_file



posts_reddit = get_posts(10, "all") # this is the first 10 posts from r/all reddit

# print(json.dumps(posts_reddit, indent=2))

prompt = get_prompt(posts_reddit) # this converts the posts into the prompt

claude_sample = basic_sample(prompt) # this returns the message from Claude

claude_data = parse_enumerated_list(claude_sample) # get the scores from claude and save them into this variable

combined_data = combine_claude_reddit_crawl(claude_data, posts_reddit) # combine the data from Claude (permalink, rating,comment) with the data from the reddit crawl (selftext, image url)

### write the file inside dailyData


script_dir = Path(__file__).parent.absolute() # Get the directory of the current script
repo_root = script_dir.parent # Navigate up

# output_dir = Path('../website/dailyData')
output_dir = Path(repo_root) / 'website' / 'dailyData'
output_dir.mkdir(parents=True, exist_ok=True)

current_date = datetime.now().strftime('%Y-%m-%d') # name the file
output_file = output_dir / f'{current_date}.json'
# output_file = output_dir / 'dontsave.json' # uncomment previous line for testing the dumped json
output_file.write_text(json.dumps(combined_data, indent=2))

write_date_in_index_file()

print(f"Demo.py ran successfully. New file {output_file} in {output_dir}")

'''
Saving data as a test

with open('claude_data_test_file.json', 'w') as file:
    json.dump(claude_data, file, indent=4)
'''