import * as DateChanger from "./dateChanger.js";
const body = document.body;
const cardContainer = document.getElementById('cardContainer');
const noDataMessageText = document.getElementById('noDataMessage-text');


// test reddit post: http://localhost:8000/dailyData/2024-07-28.json
interface RedditPost {
  permalink?: string; // link to post, example: r/some_subreddit/asdfasdfasdf
  title?: string; // title of post
  author?: string // name of user who made the post
  link_flair_text?: string // flair for post
  rating?: number; // rating by claude
  comment?: string; // comment by claude
  url?: string;  // this is an image in Reddit speak
  selftext?: string;  // this is a text post in Reddit speak
  galleryFirst?: string; // this is the first image in a gallery of images
  thumbnail?: string; // for video posts or news posts
  fallback_url?: string; // this is the video url .mp4
  over_18?: string; // nsfw posts
}


// Create and append card elements
function createCards(cardsToCreate : RedditPost[], cards : HTMLElement | null) {

    cardsToCreate.forEach(card => {


      
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      

      
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


      const imgContainer = document.createElement('a');
      imgContainer.classList.add('card-imgContainer');
      const warningElement = document.createElement('p');
      warningElement.classList.add('card-warning');
      
      if (cardElement.getAttribute('typeOfCard') === "image") {
        // img.src = resolveImageLink(card.url);
        const img = document.createElement('img');
        img.classList.add('card-image');
        img.src = card.url;
        imgContainer.href = "https://reddit.com"+ card.permalink;
        imgContainer.appendChild(img);
      }
      if (cardElement.getAttribute('typeOfCard') === "gallery") {
        warningElement.textContent = "🌱 This is a gallery of images. Click the image to see rest on Reddit!";

        const cardImageWrapper = document.createElement("div");
        cardImageWrapper.classList.add("card-image-wrapper");

        const img = document.createElement('img');
        img.classList.add('card-image');
        img.src = card.galleryFirst;
        
        img.addEventListener('load', function() {
          cardImageWrapper.appendChild(createNextImageSVG());
        });
        cardImageWrapper.appendChild(img);
        
        imgContainer.href = "https://reddit.com"+ card.permalink;
        imgContainer.appendChild(cardImageWrapper);
      }
      if (cardElement.getAttribute('typeOfCard') === "video") {
        warningElement.textContent = "⚠️ This AI is unable to view the content of videos other than the title and thumbnail.";

        const cardVideoWrapper = document.createElement("div");
        cardVideoWrapper.classList.add("card-image-wrapper");

        const videoThumbnailImg = document.createElement('img');
        videoThumbnailImg.classList.add('card-video-thumbnail');
        videoThumbnailImg.src = card.thumbnail;
        
        const video = document.createElement('video');
        video.classList.add("hidden-video");
        video.src = card.fallback_url;
        video.addEventListener('click', () => {
          video.play();
        });
        imgContainer.appendChild(video);

        videoThumbnailImg.addEventListener('load', function() {
          cardVideoWrapper.appendChild(createPlayButtonSVG());
        });
        cardVideoWrapper.appendChild(videoThumbnailImg);
        
        imgContainer.href = "https://reddit.com"+ card.permalink;
        imgContainer.appendChild(cardVideoWrapper);
      }
      if (cardElement.getAttribute('typeOfCard') === "misc") {
        // img.src = resolveImageLink(card.url);
        warningElement.textContent = "📞 This post is a link to external site!";

        const img = document.createElement('img');
        img.classList.add('card-image');
        img.src = card.thumbnail;
        imgContainer.href = "https://reddit.com"+ card.permalink;
        imgContainer.appendChild(img);
      }

      // text post.
      // some of the previous post types combine selftext with images.
      const selftextElement = document.createElement('p');
      selftextElement.classList.add('card-selftext');
      if(card.selftext) {
        card.selftext = linkifyText(card.selftext);
          selftextElement.innerHTML = card.selftext;

      }

      const claudeReasonElement = document.createElement('p');
      claudeReasonElement.classList.add('card-claudeReason');
      if (card.comment && card.comment !== "") {
          claudeReasonElement.textContent = "Claude AI: \"" + card.comment + "\"";
      }
          

        const redditUrlElement = document.createElement('a');
        redditUrlElement.classList.add('card-url');
        if (card.permalink) {
            redditUrlElement.href = "https://reddit.com"+ card.permalink;
            const regex = /^(\/r\/[^\/]+)/; // this regex gets the subreddit from the permalink
            redditUrlElement.textContent = card.permalink.match(regex)[1] + " - u/" + card.author;
        }


        const ratingElement = document.createElement('div');
        ratingElement.classList.add('card-rating');
        if (card.rating) {
          ratingElement.textContent = "AI Rating: " + card.rating.toString() + "/10";
          cardElement.setAttribute('rating', card.rating.toString());
        }

        const titleElement = document.createElement('h2');
        titleElement.classList.add('card-title');
        if (card.title) {
            titleElement.textContent = card.title;
        }


            
        cardElement.appendChild(redditUrlElement);
        cardElement.appendChild(titleElement);
        cardElement.appendChild(ratingElement);
        cardElement.appendChild(claudeReasonElement);
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
    });

    
    noDataMessageText.innerHTML = "You've reached the end of this Reddit day! You may pick another date."
}

function sortCards(cards : HTMLElement | null) {
  const cardsArray = Array.from(cards.children) as HTMLElement[];

  cardsArray.sort((a, b) => {
    const ratingA = Number(a.getAttribute('rating')) || 0;
    const ratingB = Number(b.getAttribute('rating')) || 0;
    return ratingB - ratingA; // Sort in descending order
  });

  // Reappend the sorted elements
  cardsArray.forEach(card => cards.appendChild(card));
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
  svg.setAttribute("width", "100");
  svg.setAttribute("height", "100");
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
    // this should point to
    // https://alexisdrain.github.io/Claude-Reddit-Curator/dailyData/2024-07-24.json
    // it currently points to
    // https://alexisdrain.github.io/dailyData/2024-07-24.json
    const response = await fetch('./dailyData/' + date +'.json');
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

function linkifyText(text: string): string {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Replace URLs with anchor tags
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}


/*  delete this if there are no cookies generated  */
let weservAvailable : boolean = false;
function checkWeservAvailability(timeout = 5000) {
  return new Promise((resolve, reject) => {
      const testImage = new Image();
      const timer = setTimeout(() => {
          testImage.onerror = testImage.onload = null;
          resolve('Timeout while checking Images.weserv.nl');
          console.log("images.weserv.nl is unavailable. time out");
          weservAvailable = false;
      }, timeout);

      testImage.onerror = () => {
          clearTimeout(timer);
          resolve('images.weserv.nl is unavailable. Error loading test image from Images.weserv.nl');
          console.log("images.weserv.nl is unavailable. Error loading test image from Images.weserv.nl");
          weservAvailable = false;
      };

      testImage.onload = () => {
          clearTimeout(timer);
          resolve('Images.weserv.nl is available');
          weservAvailable = true;
          console.log("images.weserv.nl is available");
      };

      // Use a small, static image from weserv.nl for the test
      testImage.src = 'https://images.weserv.nl/favicon.ico';
  });
}

// Proxy the image through images.weserv.nl so we don't raise cookie warning
function resolveImageLink(newLink : string) {
  let proxyUrl = newLink;
  if(weservAvailable) {
    proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(newLink)}`; // Proxy the image through images.weserv.nl so we don't raise cookie warning
  }
  return proxyUrl;
}

// start of page
export function main() {

  let jsonFileCurrent : RedditPost[];

  //checkWeservAvailability(1000).then(() => // use the image proxy to avoid raising cookies
  loadData(DateChanger.dateChangerInput.value)
  .then(jsonFile => {
      jsonFileCurrent = jsonFile;
    }).then(asdf => {
      cardContainerDestroyAll(cardContainer);
      createCards(jsonFileCurrent, cardContainer);
      sortCards(cardContainer);
    });

  }


  // init page
 // window.onload = DateChanger.callDefaultDate
document.addEventListener('DOMContentLoaded', function() {
  DateChanger.callDefaultDate(); // script.ts main() is called there. Done this way so that we get the date before the page loads
});