import { get_posts } from './[Old]crawl.js';
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
