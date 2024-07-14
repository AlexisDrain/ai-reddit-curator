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
      
      if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      };


      const data = await response.json();
      return data;
    }
    catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
  };
  
/*
  https://www.reddit.com/dev/api#GET_best
  subreddit name "all" as in r/all.
  sort options: hot/best (default), new, top, rising
  top and contravorsial have time_filter -t: (hour, day, week, month, year, all)
  time_filter "all" as in the top of all time
*/
export async function get_posts(limit : number = 10, subredditName : string = "all", sortBy : string = "best", timeFilter : string = "all") {
  
 await debugRequest(url, options);
 console.log("what is happen?");
  /*
  let url : string;
  let params;
  
  url = `https://oauth.reddit.com/r/${subredditName}/${sortBy}`;
  if (sortBy == "top" || sortBy == "contravorsial") {
    params = new URLSearchParams({
      'limit': limit.toString(),
      't': timeFilter
    });
  } else {
    params = new URLSearchParams({
      'limit': limit.toString()
    });
  }
  
  const headers = await get_headers_with_access_token();
  headers["Authorization"] = `Bearer ${headers.access_token}`
  headers['Content-Type'] = 'application/json';
  headers['Accept'] = 'application/json';
  
  console.log("token is valid?", checkTokenIsValid(headers.access_token));

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
      headers: headers
    });
    // debug
    console.log('--get_posts--');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers));
    // debug
    const posts = await response.json();
    console.log('Parsed JSON:', posts);
    return posts;
  }
  catch (error) {
      console.error('Request failed with status code:', error);
      throw error;
  }
*/
};


function checkTokenIsValid(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    const payload = JSON.parse(atob(parts[1]));
    
    if (payload.exp) {
      const expirationDate = new Date(payload.exp * 1000);
      console.log('Token is valid. Token expires:', expirationDate);
      if (expirationDate < new Date()) {
        console.warn('Token has expired!');
      }
    }
    
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
  }
}



async function debugRequest(url: string, options: RequestInit) {
  
  const headers = await get_headers_with_access_token();
  options["Authorization"] = `Bearer ${headers.access_token}`

  console.log('Request URL:', url);
  console.log('Request Method:', options.method);
  console.log('Request Headers:', options.headers);
  if (options.body) {
    console.log('Request Body:', options.body);
  }

  try {
    const response = await fetch(url, options);
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers));
    
    const text = await response.text();
    console.log('Response Body:', text);
    
    return response;
  } catch (error) {
    console.error('Fetch Error:', error);
  }
}

// Usage
const url = 'https://oauth.reddit.com/r/all';
const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

debugRequest(url, options);