import { get_headers_with_access_token, get_posts } from './crawl.js';

import { get_prompt, basic_sample } from './sample.js';

get_posts().then(posts => {
    console.log(posts);
    // Do something with the data
    }).catch(error => {
        console.error("Error in fetchData:", error);
});

/*
let prompt = get_prompt(posts); // todo, get type of object

console.log(prompt);

console.log(basic_sample(prompt));
*/