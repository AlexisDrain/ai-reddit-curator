import requests
import secrets
from functools import lru_cache

# Replace the placeholders with your actual values
client_id = "6Hef4rlP_2-rMq5Qfeox5w"
# response_type = "code"
# random_string = secrets.token_urlsafe(16)
# redirect_uri = "https://github.com/AlexisDrain/Claude-Reddit-Curator"
# duration = "permanent"
# scope_string = "read"

# url = f"https://www.reddit.com/api/v1/authorize?client_id={client_id}&response_type={response_type}&state={random_string}&redirect_uri={redirect_uri}&duration={duration}&scope={scope_string}"

# response = requests.get(url)

# if response.status_code == 200:
#     print("Request successful!")
#     print(response.text)
# else:
#     print(f"Request failed with status code: {response.status_code}")


@lru_cache(1)
def get_headers_with_access_token():
    # taken from https://ssl.reddit.com/prefs/apps/
    secret = "c0aOfsj7xRn3JzuoJC2EPfeVlHiQAA"

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

def get_posts_300(limit=300, subredditName="all", sortByTop=False, time_filter="all", allow_over_18=False, allow_crosspost=False):
    
    headers = get_headers_with_access_token()

    if sortByTop:
        url = f"https://oauth.reddit.com/r/{subredditName}/top"
        params = {
            "limit": limit,
            "t": time_filter,
            "sort": "top",
        }
    else:
        url = f"https://oauth.reddit.com/r/{subredditName}"
        params = {"limit": limit}
    
    all_posts = []
    after = None
    
    while len(all_posts) < limit:
        params = {
            "limit": min(100, limit - len(all_posts)),
            "after": after
        }
        
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code != 200:
            print(f"Error: Status code {response.status_code}")
            break
        
        data = response.json()
        posts = data['data']['children']
        if not posts:
            break
        
        all_posts.extend(posts)
        after = data['data']['after']
        
        if not after:
            break
    
    # remove some of the posts
    for i in range(len(all_posts) - 1, -1, -1):
        post = all_posts[i]

        if allow_over_18 == False:
            # safe_posts = [post for post in posts if not post['data']['over_18']]
            if post['data']['over_18']:
                print(f"Removing post {i + 1} (over 18)")
                all_posts.pop(i)
        if allow_crosspost == False:
            if post['data'].get('crosspost_parent_list'):
                print(f"Removing post {i + 1} (crosspost)")
                all_posts.pop(i)
        if len(post['data']["selftext"]) > 1000:
            print(f"selftext is too long. truncating post {i + 1}")
            post['data']["selftext"] = post['data']["selftext"][:997] + "..."

    return all_posts

def get_posts(limit=10, subredditName="all", sortByTop=False, time_filter="all", allow_over_18=False, allow_crosspost=False):
    """https://www.reddit.com/dev/api#GET_best
    subreddit name "all" as in r/all.
    sort options: hot/best (default), new, top, contravorsial, rising
    top and contravorsial have time_filter -t: (hour, day, week, month, year, all)
    time_filter "all" as in the top of all time
    """
    headers = get_headers_with_access_token()

    if sortByTop:
        url = f"https://oauth.reddit.com/r/{subredditName}/top"
        params = {
            "limit": limit,
            "t": time_filter,
            "sort": "top",
        }
    else:
        url = f"https://oauth.reddit.com/r/{subredditName}"
        params = {"limit": limit}

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        posts = response.json()["data"]["children"]

        for i in range(len(posts) - 1, -1, -1):
            post = posts[i]
            
            if allow_over_18 == False:
                # safe_posts = [post for post in posts if not post['data']['over_18']]
                if post['data']['over_18']:
                    print(f"Removing post {i + 1} (over 18)")
                    posts.pop(i)

            if allow_crosspost == False:
                if post['data'].get('crosspost_parent_list'):
                    print(f"Removing post {i + 1} (crosspost)")
                    posts.pop(i)
        
        return posts
    
        # return posts
    else:
        print(f"Request failed with status code: {response.status_code}")
