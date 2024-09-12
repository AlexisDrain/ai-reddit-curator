from datetime import datetime
from pathlib import Path
import json
import os

from crawl import get_posts, get_posts_300

# from sampling import get_prompt, basic_sample
from sampling_images import analyze_reddit_posts

from score_extract import combine_postScores_claudeComments_reddit

from write_date_in_dailyData import write_date_in_index_file



# posts_reddit = get_posts(10, "crosspostNudes", allow_over_18=True) # this is the first 10 posts from r/all reddit
# posts_reddit = get_posts(10)

'''
posts_reddit = get_posts(300)
with open('reddit_posts_300.json', 'w') as file:
    # Write the JSON data to the file
    json.dump(posts_reddit, file, indent=2)
'''

'''
with open('reddit_posts_gallery.json', 'w') as file:
    # Write the JSON data to the file
    json.dump(posts_reddit, file, indent=2)
with open('reddit_posts_300.json', 'r') as file:
    # Load the JSON data from the file into a variable
    test_get_posts = json.load(file)
    print (len(test_get_posts))

# sampling_images.py
with open('reddit_posts_gallery.json', 'r') as file:
    # Load the JSON data from the file into a variable
    posts_reddit = json.load(file)
'''

    
posts_reddit = get_posts_300(10, "all")

# old, claudeComments
# post_scores, post_claudeComments, post_claudeComment_index = analyze_reddit_posts(posts_reddit, allow_claudeComments=True, debug_prompt=False)
# combined_data = combine_postScores_claudeComments_reddit(posts_reddit, post_scores, post_claudeComments, post_claudeComment_index) # combine the data from Claude (permalink, rating,comment) with the data from the reddit crawl (selftext, image url)

post_scores = analyze_reddit_posts(posts_reddit, allow_claudeComments=False, debug_prompt=False)

combined_data = combine_postScores_claudeComments_reddit(posts_reddit, post_scores, allow_claudeComments=False) # combine the data from Claude (permalink, rating,comment) with the data from the reddit crawl (selftext, image url)

### write the file inside dailyData


script_dir = Path(__file__).parent.absolute() # Get the directory of the current script
repo_root = script_dir.parent # Navigate up

# output_dir = Path('../website/dailyData')
output_dir = Path(repo_root) / 'website' / 'dailyData'
output_dir.mkdir(parents=True, exist_ok=True)

current_date = datetime.now().strftime('%Y-%m-%d') # name the file
# output_file = output_dir / f'{current_date}.json'
output_file = output_dir / 'dontsave.json' # uncomment previous line for testing the dumped json
output_file.write_text(json.dumps(combined_data, indent=2))

write_date_in_index_file(current_date, output_dir / 'datesIndex.jsonl')

print(f"daily_script.py ran successfully. New file {output_file} in {output_dir}")

'''
with open('reddit_posts_300.json', 'w') as file:
    # Write the JSON data to the file
    json.dump(posts_reddit, file, indent=2)

with open('reddit_posts_300.json', 'r') as file:
    # Load the JSON data from the file into a variable
    posts_reddit = json.load(file)
    print ("number of posts loaded: " + str(len(posts_reddit)))

'''
'''
with open('reddit_posts_gallery.json', 'r') as file:
    # Load the JSON data from the file into a variable
    posts_reddit = json.load(file)
    print ("number of posts loaded: " + str(len(posts_reddit)))

post_scores, post_claudeComments, post_claudeComment_index = analyze_reddit_posts(posts_reddit, debug_prompt=False)

# claude_sample = basic_sample(prompt) # this returns the message from Claude

# claude_data = parse_enumerated_list(final_analysis) # get the scores from claude and save them into this variable

combined_data = combine_postScores_claudeComments_reddit(posts_reddit, post_scores, post_claudeComments, post_claudeComment_index) # combine the data from Claude (permalink, rating,comment) with the data from the reddit crawl (selftext, image url)

### write the file inside dailyData


script_dir = Path(__file__).parent.absolute() # Get the directory of the current script
repo_root = script_dir.parent # Navigate up

# output_dir = Path('../website/dailyData')
output_dir = Path(repo_root) / 'website' / 'dailyData'
output_dir.mkdir(parents=True, exist_ok=True)

current_date = datetime.now().strftime('%Y-%m-%d') # name the file
# output_file = output_dir / f'{current_date}.json'
output_file = output_dir / 'dontsave.json' # uncomment previous line for testing the dumped json
output_file.write_text(json.dumps(combined_data, indent=2))

write_date_in_index_file(current_date, output_dir / 'datesIndex.jsonl')

print(f"Demo.py ran successfully. New file {output_file} in {output_dir}")

'''

'''
Saving data as a test

with open('claude_data_test_file.json', 'w') as file:
    json.dump(claude_data, file, indent=4)
'''