
import os
from pathlib import Path
from datetime import datetime


current_date = datetime.now().strftime('%Y-%m-%d') # name the file
file_path = Path('../website/dailyData/datesIndex.jsonl')
content = f'\n{{"file": "{current_date}"}}'


def write_date_in_index_file():
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
                if content.find(last_line) != -1:
                    print(f"`{content}` new line already exists as the last line in the file.")
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