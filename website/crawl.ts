import { readFileSync } from 'fs';


let client_id : string = process.env['REDDIT_CLIENTID'];
let reddit_secret : string = process.env['REDDIT_SECRET'];

// if we don't have access to github, grab the env secrets locally.
if(client_id == undefined) {
  const file = readFileSync('./../../_misc/scriptSecret.txt', 'utf-8');
  const regex = /REDDIT_CLIENTID:\s*([\w-]+)/;
  const found = file.match(regex);
  client_id = found[1];
}
if(reddit_secret == undefined) {
  const file = readFileSync('./../../_misc/scriptSecret.txt', 'utf-8');
  const regex = /REDDIT_SECRET:\s*([\w-]+)/;
  const found = file.match(regex);
  reddit_secret = found[1];
}


export async function get_headers_with_access_token() {
    //const credentials = btoa(`${client_id}:${reddit_secret}`);

    const auth = Buffer.from(`${client_id}:${reddit_secret}`).toString('base64');
    const body = new URLSearchParams({
      'grant_type': 'client_credentials'
  });

    try {
      const response = await fetch("https://www.reddit.com/api/v1/access_token", {
        method: "POST", 
        body: body.toString(),
        headers: {
          'User-Agent': "AIRedditCurator/1.0 by my_tummy_hurts",
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      const data = await response.json();
      return data
    }
    catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
  };
  
export async function get_posts(limit : number = 10, subredditName : string = "all", sortByTop : boolean = false, fimeFilter : string = "all") {
  
  const headers:object = await get_headers_with_access_token();
  console.log(headers);
};