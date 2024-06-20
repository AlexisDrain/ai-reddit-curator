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



@lru_cache
def get_headers_with_access_token():
    # taken from https://ssl.reddit.com/prefs/apps/
    secret = "c0aOfsj7xRn3JzuoJC2EPfeVlHiQAA"

    # Step 1: Get an access token
    auth = requests.auth.HTTPBasicAuth(client_id, secret)
    data = {'grant_type': 'client_credentials'}
    headers = {"User-Agent": "AIRedditCurator/1.0 by my_tummy_hurts"}
    res = requests.post('https://www.reddit.com/api/v1/access_token',
                        auth=auth, data=data, headers=headers)
    token = res.json()['access_token']
    headers = {**headers, **{'Authorization': f'Bearer {token}'}}
    return headers




def get_posts(limit=10):
    headers = get_headers_with_access_token()

    # Step 2: Get the first five posts on r/all
    url = 'https://oauth.reddit.com/r/all'
    params = {'limit': limit}
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        posts = response.json()['data']['children']
        return posts
        for post in posts:
            print(post['data']['title'])
    else:
        print(f"Request failed with status code: {response.status_code}")