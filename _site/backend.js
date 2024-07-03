"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_prompt = get_prompt;
exports.basic_sample = basic_sample;
const sdk_1 = require("@anthropic-ai/sdk");
var claude_key = "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";
const anthropic = new sdk_1.default({
    apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});
let PROMPT_TEMPLATE = `Can you help me decide what reddit posts to look at?
I'm going to give a list of reddit posts, and I want you to rank them from best to worst.
The best posts are: mind blowing, hilarious, informative, educational, inspiring, or extremely cute.
The worst posts are: ragebait, political, or stupid.
Here are the posts:
<posts>
{POSTS}
</posts>

Write your ranking as an enumerated list, and include the url for each post along with an explanation for its rating.
`;
function get_prompt(posts) {
    var posts_str = "";
    posts.foreach((post, i) => {
        posts_str += `${i + 1}. ${post.data.title}\n${post.data.url}\n`;
    });
    return PROMPT_TEMPLATE.replace("{POSTS}", posts_str);
}
async function basic_sample(prompt) {
    const message = await anthropic.messages.create({
        max_tokens: 4096,
        messages: [
            { role: 'user',
                content: prompt
            }
        ],
        model: 'claude-3-haiku-20240307',
    });
    return message.content;
}
