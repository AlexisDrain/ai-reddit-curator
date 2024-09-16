import { stringify } from "querystring";
import * as DateChanger from "./dateChanger.js";
import { categoryValue, loadOptions } from './options.js';
import { blocked_subreddits } from "./options.js";
const body = document.body;
const cardContainer = document.getElementById('cardContainer');
const noDataMessageText = document.getElementById('noDataMessage-text');


// test reddit post: http://localhost:8000/dailyData/2024-07-28.json
interface RedditPost {
  permalink?: string; // link to post, example: r/some_subreddit/asdfasdfasdf
  title?: string; // title of post
  author?: string // name of user who made the post
  link_flair_text?: string // flair for post
  rating?: Array<number> | string; // rating by claude
  claudeComment?: string; // comment by claude
  url?: string;  // this is an image in Reddit speak
  selftext?: string;  // this is a text post in Reddit speak
  // galleryFirst?: string; // this is the first image in a gallery of images
  thumbnail?: string; // for news posts
  // videoThumbnail?: string; // [Depricated because I can't play reddit videos] for video posts hosted on Reddit
  // dash_url?: string; // this is the video url .mp4
  // over_18?: boolean; // [removed because of anthropic refusal] nsfw posts
}


const elementImgMap = new WeakMap<HTMLElement, HTMLImageElement>();
// Create and append card elements
function createCards(cardsToCreate : RedditPost[], cards : HTMLElement | null) {

    for (let i = 0; i < cardsToCreate.length; i++) {

      let card = cardsToCreate[i];

      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      
      const subredditRegex = /^(\/r\/[^\/]+)/; // this regex gets the subreddit from the permalink
      cardElement.setAttribute('subreddit', card.permalink.match(subredditRegex)[1]);

      // denylist
      const subreddit = normalizeSubredditName(cardElement.getAttribute("subreddit") || "");
      const normalizedBlockedSubreddits = blocked_subreddits.map(normalizeSubredditName);
      if (normalizedBlockedSubreddits.includes(subreddit)) {
        continue;
      }
      

      
      if(card.url) {

        if(card.url.includes("//v.redd.it")) {
          // video
          cardElement.setAttribute('typeOfCard', "video");
        } else if (card.url.includes("gallery")) {
          // series of images
          cardElement.setAttribute('typeOfCard', "gallery");
        } else if (card.url.includes("//i.redd.it")) {
           // image
          cardElement.setAttribute('typeOfCard', "image");
        } else {
           // other links like news
          cardElement.setAttribute('typeOfCard', "misc");
        } 
      }

      

      /*
      if(cardElement.getAttribute("subreddit") in blocked_subreddits) {
        console.log("subreddit " + cardElement.getAttribute("subreddit") + " is blocked")
        return;
      }
      */
      const imgContainer = document.createElement('a');
      imgContainer.classList.add('card-imgContainer');
      const warningElement = document.createElement('p');
      warningElement.classList.add('card-warning');
      
      const flairElement = document.createElement('p');
      flairElement.classList.add('card-flair');

      if (card.link_flair_text) {
          let text = String(card.link_flair_text);
          card.link_flair_text = text.charAt(0).toUpperCase() + text.slice(1);
          flairElement.textContent = card.link_flair_text;
      }

      if (cardElement.getAttribute('typeOfCard') === "image") {
        // img.src = resolveImageLink(card.url);
        const img = document.createElement('img');
        img.classList.add('card-image');
        elementImgMap.set(cardElement, img);
        // img.src = card.url;
          cardElement.setAttribute('img-src', card.url);
        imgContainer.href = "https://reddit.com"+ card.permalink;
        imgContainer.appendChild(img);
      }
      if (cardElement.getAttribute('typeOfCard') === "gallery") {
        // warningElement.textContent = "🌱 This is a gallery of images. Click the image to see rest on Reddit!";

        const cardImageWrapper = document.createElement("div");
        cardImageWrapper.classList.add("card-image-wrapper");

        const img = document.createElement('img');
        img.classList.add('card-image');
        elementImgMap.set(cardElement, img);
        if (card.thumbnail != "" || card.thumbnail != null) {
          // img.src = card.thumbnail;
          cardElement.setAttribute('img-src', card.thumbnail);
        } else {
          // img.src = card.url;
          cardElement.setAttribute('img-src', card.url);
        }
        
        img.addEventListener('load', function() {
          cardImageWrapper.appendChild(createNextImageSVG());
        });
        cardImageWrapper.appendChild(img);
        
        imgContainer.href = "https://reddit.com"+ card.permalink;
        imgContainer.appendChild(cardImageWrapper);
      }
      if (cardElement.getAttribute('typeOfCard') === "video") {
        // warningElement.textContent = "📽️⚠️ This AI is unable to view the content of videos other than the title and thumbnail.";

        const cardVideoWrapper = document.createElement("div");
        cardVideoWrapper.classList.add("card-image-wrapper");

        const videoThumbnailImg = document.createElement('img');
        elementImgMap.set(cardElement, videoThumbnailImg);
        videoThumbnailImg.classList.add('card-video-thumbnail');
        if(card.thumbnail != "") {
          cardElement.setAttribute('img-src', card.thumbnail);
          //videoThumbnailImg.src = card.thumbnail;
        }
        
        /*
        [Deprecated Video because I cannot sync video+audio easily]

        const video = document.createElement('video');
        video.classList.add("hidden-video");
        video.src = card.fallback_url;
        video.addEventListener('click', () => {
          if(video.paused == true) {
            video.controls = true;
            video.play();
            video.muted = false;
          } else {
            video.pause();
            video.muted = true;
          }
        });
        imgContainer.appendChild(video);
        */
        videoThumbnailImg.addEventListener('load', function() {
          cardVideoWrapper.appendChild(createPlayButtonSVG());
        });
        cardVideoWrapper.appendChild(videoThumbnailImg);
        
        imgContainer.href = "https://reddit.com"+ card.permalink;
        imgContainer.appendChild(cardVideoWrapper);
      }
      if (cardElement.getAttribute('typeOfCard') === "misc") {
        // img.src = resolveImageLink(card.url);
        // warningElement.textContent = "📞 This post is a link to external site!" + card.url;
        
        // warningElement.textContent = "📞 This post is a link to external site!";
        let websiteLink = document.createElement('a');
        websiteLink.style.color = '#a00';
        websiteLink.textContent = "📞 External Site: " + card.url;
        websiteLink.href = card.url;
        warningElement.appendChild(websiteLink);

        const img = document.createElement('img');
        elementImgMap.set(cardElement, img);
        img.classList.add('card-image');
        imgContainer.href = "https://reddit.com"+ card.permalink;
        if(card.thumbnail != "") {
            // img.src = card.thumbnail;
            cardElement.setAttribute('img-src', card.thumbnail);
            imgContainer.appendChild(img);
        }
      }

      // text post.
      // some of the previous post types combine selftext with images.
      const selftextElement = document.createElement('p');
      selftextElement.classList.add('card-selftext');
      if(card.selftext) {
        // card.selftext = linkifyText(card.selftext);
        // selftextElement.innerHTML = card.selftext.replace(/\n/g, '<br>'); // add line breaks. this can be XSS vulnerability 
        addLineBreaks(selftextElement, card.selftext);
      }

      const claudeReasonElement = document.createElement('p');
      claudeReasonElement.classList.add('card-claudeReason');
      if (card.claudeComment && card.claudeComment !== "") {
          claudeReasonElement.textContent = "Claude AI: \"" + card.claudeComment + "\"";
      }
          
        // subreddet + user line
        const containerElement = document.createElement('span');

        // Create the first link element
        const redditUrlElement1 = document.createElement('a');
        redditUrlElement1.textContent = card.permalink.match(subredditRegex)[1]
        redditUrlElement1.href = "https://reddit.com/" + card.permalink.match(subredditRegex)[1];

        // Create the second link element
        const redditUrlElement2 = document.createElement('a');
        redditUrlElement2.href = "https://reddit.com/u/" + card.author;
        redditUrlElement2.textContent = "/u/" + card.author;

        const separatorText = document.createElement('span');
        separatorText.textContent = " — ";

        // Append both link elements to the container
        containerElement.appendChild(redditUrlElement1);
        containerElement.appendChild(separatorText);
        containerElement.appendChild(redditUrlElement2);



        const ratingElement = document.createElement('div');
        ratingElement.classList.add('card-rating');
        const ratingElementSmall = document.createElement('div');
        ratingElementSmall.classList.add('card-rating-small');

        if (card.rating) {
          // rating is an array of catagories
          if (Array.isArray(card.rating)) {
            const ratingArray: number[] = card.rating.map(Number);
            const attributes = ['total-score', 'educational', 'hilarious', 'cute', 'political'];
            attributes.forEach((attr, index) => {
              if (ratingArray[index] !== undefined) {
                cardElement.setAttribute(attr, ratingArray[index].toString());
              }
            });

            if (categoryValue == "total-score") {
              ratingElement.textContent = "AI Rating: " + ratingArray[0].toString() + "/10";
              ratingElementSmall.textContent = "";
            } else if (categoryValue == "educational") {
              ratingElement.textContent = "Educational: " + cardElement.getAttribute("educational") + "/10";
              ratingElementSmall.textContent = "AI Rating: " + ratingArray[0].toString() + "/10";
            } else if (categoryValue == "hilarious") {
              ratingElement.textContent = "Hilarious: " + cardElement.getAttribute("hilarious") + "/10";
              ratingElementSmall.textContent = "AI Rating: " + ratingArray[0].toString() + "/10";
            } else if (categoryValue == "cute") {
              ratingElement.textContent = "Cute: " + cardElement.getAttribute("cute") + "/10";
              ratingElementSmall.textContent = "AI Rating: " + ratingArray[0].toString() + "/10";
            } else if (categoryValue == "political") {
              ratingElement.textContent = "Political: " + cardElement.getAttribute("political") + "/10";
              ratingElementSmall.textContent = "AI Rating: " + ratingArray[0].toString() + "/10";
            }

          // rating is one number
          } else {
              ratingElement.textContent = "AI Rating: " + card.rating.toString() + "/10";
              cardElement.setAttribute('total-score', card.rating.toString());
          }
        } else {
          ratingElement.textContent = "AI Rating: unrated";
        }

        const titleElement = document.createElement('h2');
        const linkElement = document.createElement('a');
        titleElement.classList.add('card-title');
        linkElement.textContent = card.title;
        linkElement.href = "https://reddit.com"+ card.permalink;
        titleElement.appendChild(linkElement);


            
        cardElement.appendChild(containerElement);
        cardElement.appendChild(titleElement);
        cardElement.appendChild(ratingElement);
        cardElement.appendChild(ratingElementSmall);
        cardElement.appendChild(claudeReasonElement);
        cardElement.appendChild(flairElement);
        cardElement.appendChild(warningElement);
        cardElement.appendChild(selftextElement);
        cardElement.appendChild(imgContainer);
        
        
        cards.appendChild(cardElement);

        /* remnant from a feature that hides elements under a certain rating
        const cardUnlock = document.createElement('div');
        cardUnlock.classList.add('card-unlock');

        const cardLock = document.createElement('div');
        cardLock.classList.add('card-lock');

        expand card listener
        cardElement.addEventListener('click', () => {
            cardElement.classList.toggle('expanded');
        });
        // cardElement.appendChild(cardUnlock);
        // cardElement.appendChild(cardLock);
        */
    };

    
    noDataMessageText.innerHTML = "You've reached the end of this Reddit day! You may pick another date."
}

function sortCards(cards : HTMLElement | null) {
  const cardsArray = Array.from(cards.children) as HTMLElement[];

  const sortingAttribute : string = categoryValue;

  cardsArray.sort((a, b) => {
    const primaryA = Number(a.getAttribute(sortingAttribute)) || 0;
    const primaryB = Number(b.getAttribute(sortingAttribute)) || 0;
    
    if (primaryA !== primaryB) {
      return primaryB - primaryA; // Sort primary attribute in descending order
    }
    
    // If primary attributes are equal, sort by secondary attribute
    const secondaryA = Number(a.getAttribute("total-score")) || 0;
    const secondaryB = Number(b.getAttribute("total-score")) || 0;
    return secondaryB - secondaryA; // Sort secondary attribute in descending order
  });
  
  // Reappend the sorted elements
  cardsArray.forEach(card => {
      cards.appendChild(card)
  });
}

function createPlayButtonSVG() : SVGSVGElement {
  // Create the SVG element
  const playButton = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  playButton.classList.add('card-video-playButton', "svg-always-light");
  playButton.setAttribute("width", "100");
  playButton.setAttribute("height", "100");
  playButton.setAttribute("viewBox", "0 0 24 24");
  playButton.setAttribute("fill", "black");
  playButton.setAttribute("stroke", "#000000");
  playButton.setAttribute("stroke-width", "1.5");
  playButton.setAttribute("stroke-linecap", "round");
  playButton.setAttribute("stroke-linejoin", "round");

  // Create the circle element
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "10");

  // Create the polygon element
  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polygon.setAttribute("points", "10 8 16 12 10 16 10 8");
  polygon.setAttribute("fill", "white");

  // Append circle and polygon to the SVG
  playButton.appendChild(circle);
  playButton.appendChild(polygon);

  return playButton;
}
function createNextImageSVG(): HTMLElement {
  // Create the SVG element
  const arrowContainer = document.createElement("div");
  arrowContainer.classList.add('button-arrowContainer', "svg-always-light");
  
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("svg-always-light");
  svg.setAttribute("width", "50");
  svg.setAttribute("height", "45");
  svg.setAttribute("viewBox", "-0.5 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "#fff");
  svg.setAttribute("stroke-width", "1.5");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  // Create the path element
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M9 18l6-6-6-6");

  // Append path to the SVG
  svg.appendChild(path);
  arrowContainer.appendChild(svg);
  return arrowContainer;
}

// debug: prototype to load a json
async function loadData(date : string) {
  try {
    
    let response;
    if (getPlatform() != "web") {
      //android
      response = await fetch("https://raw.githubusercontent.com/AlexisDrain/ai-reddit-curator/main/website/dailyData/" + date + ".json");
    } else { // web
      // Fetch the index file
      response = await fetch('./dailyData/' + date +'.json');
    }
    
    // const response = await fetch(`/get-data.json?filename=${date}.json`);
    // console.log(response);
    if (!response.ok) {
    noDataMessageText.innerHTML = "No data found on this day (" + DateChanger.dateChangerInput.value + ")."
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data : RedditPost[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to load data:", error);
    return null;
  }
}

function cardContainerDestroyAll(cards : HTMLElement | null) {
  cards.innerHTML = "";
}


// lazy loading https://claude.ai/chat/a3deb893-a035-4d45-bb76-a369a89d4905
function setupIntersectionObserver(cards : HTMLElement | null): void {
  const cardsArray = Array.from(cards.children) as HTMLElement[];

  const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '50px', // Start loading slightly before the image comes into view
      threshold: 0.1
  };
  
  let observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              loadImage(entry.target as HTMLElement);
              observer.unobserve(entry.target); // Stop observing once loaded
          }
      });
  }, options);

  cardsArray.forEach(placeholder => observer.observe(placeholder));
}

function loadImage(card: HTMLElement): void {
  const src = card.getAttribute('img-src');
  if (!src) {
    if(debugMode) {
      console.error('No image source found');
    }
    return;
  }
  const retrievedImg = elementImgMap.get(card);
  retrievedImg.src = src;

  if(debugMode) {
    retrievedImg.onload = () => {
        console.log("image Loaded");
    };
    retrievedImg.onerror = () => {
        // console.error(`Failed to load image: ${src}`);
    };
  }
}

export function getPlatform() {
  // Check if running in Capacitor
  if (window.Capacitor) {
    return "capacitor"
    // return window.Capacitor.getPlatform();
  }
  /*
  // Check if running on Android
  if (/android/i.test(navigator.userAgent)) {
    return 'android';
  }
  
  // Check if running on iOS
  if (/ipad|iphone|ipod/i.test(navigator.userAgent)) {
    return 'ios';
  }
  */
  // Default to web
  return 'web';
}

function normalizeSubredditName(name: string): string {
  // Remove leading '/' if present, ensure 'r/' prefix, and convert to lowercase
  return name.replace(/^\/?(r\/)?/i, 'r/').toLowerCase();
}

function linkifyText(text: string): string {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Replace URLs with anchor tags
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

function addLineBreaks(element: HTMLElement, text: string) {
  // Split the text by newline characters
  const lines = text.split('\n');

  // Process each line
  lines.forEach((line, index) => {
    // Linkify the text
    const linkifiedLine = linkifyText(line);

    // Create a temporary container for the linkified HTML
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = linkifiedLine;

    // Append each child of the temporary container
    while (tempContainer.firstChild) {
      element.appendChild(tempContainer.firstChild);
    }

    // If it's not the last line, add a line break
    if (index < lines.length - 1) {
      element.appendChild(document.createElement('br'));
    }
  });
}
// start of page

const debugMode : Boolean = false;
export function main() {
  if(getPlatform() == "web") { // when running in capacitor, don't show logo. only on web
    document.getElementById("android-logo").style.display = "inline";
  }

  let jsonFileCurrent : RedditPost[];

  //checkWeservAvailability(1000).then(() => // use the image proxy to avoid raising cookies
  loadData(DateChanger.dateChangerInput.value)
    .then(jsonFile => {
      return new Promise<void>((resolve) => {
        loadOptions(); // load denylist
        jsonFileCurrent = jsonFile;
        setTimeout(() => resolve(), 0); // Use setTimeout to ensure all DOM updates from loadOptions() are processed
      });
    }).then(asdf => {
      cardContainerDestroyAll(cardContainer);
      createCards(jsonFileCurrent, cardContainer);
      sortCards(cardContainer);
      setupIntersectionObserver(cardContainer)
    });

  }


  // init page
 // window.onload = DateChanger.callDefaultDate
document.addEventListener('DOMContentLoaded', function() {
  DateChanger.callDefaultDate(); // script.ts main() is called there. Done this way so that we get the date before the page loads
});
