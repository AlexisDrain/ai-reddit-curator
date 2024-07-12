import { readFileSync } from 'fs';


let client_id : string = process.env['REDDIT_CLIENTID'];
let reddit_secret : string = process.env['REDDIT_SECRET'];

if(client_id == undefined) {
  const file = readFileSync('./_misc/scriptSecret.txt', 'utf-8');
  const regex = /REDDIT_CLIENTID:\s*([\w-]+)/;
  const found = file.match(regex);
  //console.log (found);
  client_id = found[1];
  console.log(client_id);
}
if(reddit_secret == undefined) {
  const file = readFileSync('./_misc/scriptSecret.txt', 'utf-8');
  const regex = /REDDIT_SECRET:\s*([\w-]+)/;
  const found = file.match(regex);
  
  reddit_secret = found[1];
  console.log(reddit_secret);
}


export async function get_headers_with_access_token() {
    const credentials = btoa(`${client_id}:${reddit_secret}`);

    try {
      const response = await fetch("https://www.reddit.com/api/v1/access_token", {
        headers: {
          'Authorization': `Basic ${credentials}`
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
  
  console.log("Get_posts");
  const headers = await get_headers_with_access_token();
  console.log(headers);
  console.log(typeof(headers));
};