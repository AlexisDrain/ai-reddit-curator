from datetime import datetime
from pathlib import Path
import json

from crawl import get_posts

from sampling import get_prompt, basic_sample

from score_extract import extract_tags, combine_claude_reddit_crawl


posts_reddit = get_posts() # this is the 100 posts from reddit

prompt = get_prompt(posts_reddit) # this converts the posts into the prompt

claude_sample = basic_sample(prompt) # this returns the message from Claude

claude_data = extract_tags(claude_sample) # get the scores from claude and save them into this variable

combined_data = combine_claude_reddit_crawl(claude_data, posts_reddit) # combine the data from Claude (permalink, rating,comment) with the data from the reddit crawl (selftext, image url)

current_date = datetime.now().strftime('%Y-%m-%d') # name the file

output_dir = Path('../website/dailyData')
output_dir.mkdir(parents=True, exist_ok=True)
output_file = output_dir / f'{current_date}.json'
output_file.write_text(json.dumps(combined_data))

# Path(f'../website/dailyData/{current_date}.json').write_text(json.dumps(combined_data)) # save the file


'''
Saving data as a test

with open('claude_data_test_file.json', 'w') as file:
    json.dump(claude_data, file, indent=4)
'''