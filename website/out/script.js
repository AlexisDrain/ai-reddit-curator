import * as DateChanger from "./dateChanger.js";
const body = document.body;
const cardContainer = document.getElementById('cardContainer');
const noDataMessageText = document.getElementById('noDataMessage-text');
const elementImgMap = new WeakMap();
// Create and append card elements
function createCards(cardsToCreate, cards) {
    cardsToCreate.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        if (card.url) {
            if (card.url.includes("//v.redd.it")) {
                // video
                cardElement.setAttribute('typeOfCard', "video");
            }
            else if (card.url.includes("gallery")) {
                // series of images
                cardElement.setAttribute('typeOfCard', "gallery");
            }
            else if (card.url.includes("//i.redd.it")) {
                // image
                cardElement.setAttribute('typeOfCard', "image");
            }
            else {
                // other links like news
                cardElement.setAttribute('typeOfCard', "misc");
            }
        }
        const subredditRegex = /^(\/r\/[^\/]+)/; // this regex gets the subreddit from the permalink
        cardElement.setAttribute('subreddit', card.permalink.match(subredditRegex)[1]);
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
            imgContainer.href = "https://reddit.com" + card.permalink;
            imgContainer.appendChild(img);
        }
        if (cardElement.getAttribute('typeOfCard') === "gallery") {
            // warningElement.textContent = "🌱 This is a gallery of images. Click the image to see rest on Reddit!";
            const cardImageWrapper = document.createElement("div");
            cardImageWrapper.classList.add("card-image-wrapper");
            const img = document.createElement('img');
            img.classList.add('card-image');
            elementImgMap.set(cardElement, img);
            if (card.thumbnail != "") {
                img.src = card.thumbnail;
                cardElement.setAttribute('img-src', card.thumbnail);
            }
            else {
                img.src = card.url;
                cardElement.setAttribute('img-src', card.url);
            }
            img.addEventListener('load', function () {
                cardImageWrapper.appendChild(createNextImageSVG());
            });
            cardImageWrapper.appendChild(img);
            imgContainer.href = "https://reddit.com" + card.permalink;
            imgContainer.appendChild(cardImageWrapper);
        }
        if (cardElement.getAttribute('typeOfCard') === "video") {
            // warningElement.textContent = "📽️⚠️ This AI is unable to view the content of videos other than the title and thumbnail.";
            const cardVideoWrapper = document.createElement("div");
            cardVideoWrapper.classList.add("card-image-wrapper");
            const videoThumbnailImg = document.createElement('img');
            elementImgMap.set(cardElement, videoThumbnailImg);
            videoThumbnailImg.classList.add('card-video-thumbnail');
            if (card.thumbnail != "") {
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
            videoThumbnailImg.addEventListener('load', function () {
                cardVideoWrapper.appendChild(createPlayButtonSVG());
            });
            cardVideoWrapper.appendChild(videoThumbnailImg);
            imgContainer.href = "https://reddit.com" + card.permalink;
            imgContainer.appendChild(cardVideoWrapper);
        }
        if (cardElement.getAttribute('typeOfCard') === "misc") {
            // img.src = resolveImageLink(card.url);
            warningElement.textContent = "📞 This post is a link to external site!";
            const img = document.createElement('img');
            elementImgMap.set(cardElement, img);
            img.classList.add('card-image');
            imgContainer.href = "https://reddit.com" + card.permalink;
            if (card.thumbnail != "") {
                // img.src = card.thumbnail;
                cardElement.setAttribute('img-src', card.thumbnail);
                imgContainer.appendChild(img);
            }
        }
        // text post.
        // some of the previous post types combine selftext with images.
        const selftextElement = document.createElement('p');
        selftextElement.classList.add('card-selftext');
        if (card.selftext) {
            card.selftext = linkifyText(card.selftext);
            selftextElement.innerHTML = card.selftext.replace(/\n/g, '<br>'); // add line breaks
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
        redditUrlElement1.textContent = card.permalink.match(subredditRegex)[1];
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
        if (card.rating && card.rating.toString().length < 5) {
            ratingElement.textContent = "AI Rating: " + card.rating.toString() + "/10";
            cardElement.setAttribute('rating', card.rating.toString());
        }
        else {
            ratingElement.textContent = "AI Rating: unrated";
        }
        const titleElement = document.createElement('h2');
        const linkElement = document.createElement('a');
        titleElement.classList.add('card-title');
        linkElement.textContent = card.title;
        linkElement.href = "https://reddit.com" + card.permalink;
        titleElement.appendChild(linkElement);
        cardElement.appendChild(containerElement);
        cardElement.appendChild(titleElement);
        cardElement.appendChild(ratingElement);
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
    });
    noDataMessageText.innerHTML = "You've reached the end of this Reddit day! You may pick another date.";
}
function sortCards(cards) {
    const cardsArray = Array.from(cards.children);
    cardsArray.sort((a, b) => {
        const ratingA = Number(a.getAttribute('rating')) || 0;
        const ratingB = Number(b.getAttribute('rating')) || 0;
        return ratingB - ratingA; // Sort in descending order
    });
    // Reappend the sorted elements
    cardsArray.forEach(card => cards.appendChild(card));
}
function createPlayButtonSVG() {
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
function createNextImageSVG() {
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
async function loadData(date) {
    try {
        // this should point to
        // https://alexisdrain.github.io/Claude-Reddit-Curator/dailyData/2024-07-24.json
        // it currently points to
        // https://alexisdrain.github.io/dailyData/2024-07-24.json
        const response = await fetch('./dailyData/' + date + '.json');
        // const response = await fetch(`/get-data.json?filename=${date}.json`);
        // console.log(response);
        if (!response.ok) {
            noDataMessageText.innerHTML = "No data found on this day (" + DateChanger.dateChangerInput.value + ").";
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Failed to load data:", error);
        return null;
    }
}
function cardContainerDestroyAll(cards) {
    cards.innerHTML = "";
}
function linkifyText(text) {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    // Replace URLs with anchor tags
    return text.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
}
// lazy loading https://claude.ai/chat/a3deb893-a035-4d45-bb76-a369a89d4905
function setupIntersectionObserver(cards) {
    const cardsArray = Array.from(cards.children);
    const options = {
        root: null,
        rootMargin: '50px', // Start loading slightly before the image comes into view
        threshold: 0.1
    };
    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadImage(entry.target);
                observer.unobserve(entry.target); // Stop observing once loaded
            }
        });
    }, options);
    cardsArray.forEach(placeholder => observer.observe(placeholder));
}
function loadImage(card) {
    const src = card.getAttribute('img-src');
    if (!src) {
        if (debugMode) {
            console.error('No image source found');
        }
        return;
    }
    const retrievedImg = elementImgMap.get(card);
    retrievedImg.src = src;
    if (debugMode) {
        retrievedImg.onload = () => {
            console.log("image Loaded");
        };
        retrievedImg.onerror = () => {
            // console.error(`Failed to load image: ${src}`);
        };
    }
}
// start of page
const debugMode = false;
export function main() {
    let jsonFileCurrent;
    //checkWeservAvailability(1000).then(() => // use the image proxy to avoid raising cookies
    loadData(DateChanger.dateChangerInput.value)
        .then(jsonFile => {
        jsonFileCurrent = jsonFile;
    }).then(asdf => {
        cardContainerDestroyAll(cardContainer);
        createCards(jsonFileCurrent, cardContainer);
        sortCards(cardContainer);
        setupIntersectionObserver(cardContainer);
    });
}
// init page
// window.onload = DateChanger.callDefaultDate
document.addEventListener('DOMContentLoaded', function () {
    DateChanger.callDefaultDate(); // script.ts main() is called there. Done this way so that we get the date before the page loads
});
