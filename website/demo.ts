import { get_headers_with_access_token, get_posts } from './crawl.js';

import { get_prompt, basic_sample } from './sample.js';

let posts = get_posts(); // todo, get type of object

/*
console.log(posts);
let prompt = get_prompt(posts); // todo, get type of object

console.log(prompt);

console.log(basic_sample(prompt));
*/