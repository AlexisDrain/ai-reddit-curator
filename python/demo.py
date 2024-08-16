from datetime import datetime
from pathlib import Path
import json

from crawl import get_posts

from sampling import get_prompt, basic_sample

from score_extract import extract_tags, parse_enumerated_list, combine_claude_reddit_crawl



'''
Grabbing stuf from reddit
posts_reddit = get_posts(10, "2sentence2horror") # test
print(posts_reddit)
'''

posts_reddit = get_posts() # this is the first 10 posts from reddit

prompt = get_prompt(posts_reddit) # this converts the posts into the prompt

claude_sample = basic_sample(prompt) # this returns the message from Claude

claude_data = parse_enumerated_list(claude_sample) # get the scores from claude and save them into this variable

combined_data = combine_claude_reddit_crawl(claude_data, posts_reddit) # combine the data from Claude (permalink, rating,comment) with the data from the reddit crawl (selftext, image url)

current_date = datetime.now().strftime('%Y-%m-%d') # name the file

# write the file inside dailyData
output_dir = Path('../website/dailyData')
output_dir.mkdir(parents=True, exist_ok=True)
output_file = output_dir / f'{current_date}.json'
output_file.write_text(json.dumps(combined_data, indent=2))


import os
from pathlib import Path

def write_to_file(file_path, line_to_write):
    # Convert to absolute path
    abs_path = Path(file_path).resolve()
    
    # Ensure the directory exists
    os.makedirs(abs_path.parent, exist_ok=True)
    
    if file_path.exists() and file_path.stat().st_size > 0:
        with file_path.open('rb') as file:
            try:
                file.seek(-2, 2)  # Go to the second-last byte
                while file.read(1) != b'\n':  # Until EOL is found...
                    file.seek(-2, 1)  # ...jump back two bytes and read again
                last_line = file.readline().decode().strip()
                print(last_line)
                print(line_to_write)
                if line_to_write.find(last_line) != -1:
                    print(f"new line `{line_to_write}` already exists as the last line in the file.")
                    return False
            except OSError:
                # File is too small, has only one line, or other issue
                pass

    try:
        with open(abs_path, 'a') as file:
            file.write(content)
        print(f"Successfully wrote to {abs_path}")
    except PermissionError:
        print(f"Permission denied. Unable to write to {abs_path}")
        print("Please check file permissions or try running the script with elevated privileges.")
    except IOError as e:
        print(f"An error occurred while writing to the file: {e}")

current_date = datetime.now().strftime('%Y-%m-%d') # name the file
file_path = Path('../website/dailyData/datesIndex.jsonl')
content = f'\n{{"file": "{current_date}"}}'

write_to_file(file_path, content)



# Path(f'../website/dailyData/{current_date}.json').write_text(json.dumps(combined_data)) # save the file


'''
Saving data as a test

with open('claude_data_test_file.json', 'w') as file:
    json.dump(claude_data, file, indent=4)
'''