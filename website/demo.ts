import { get_headers_with_access_token } from './crawl';

import { get_prompt, basic_sample } from './sample';

console.log(get_headers_with_access_token());

/*
posts = get_posts()

print(f"{posts=}")


prompt = get_prompt(posts)

print(prompt)

print(basic_sample(prompt))


*/