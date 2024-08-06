import * as DateChanger from "./dateChanger.js";
const body = document.body;
const cardContainer = document.getElementById('cardContainer');
const noDataMessageText = document.getElementById('noDataMessage-text');
// Create and append card elements
function createCards(cardsToCreate, cards) {
    cardsToCreate.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        const cardUnlock = document.createElement('div');
        cardUnlock.classList.add('card-unlock');
        const cardLock = document.createElement('div');
        cardLock.classList.add('card-lock');
        /*
        expand card listener
        cardElement.addEventListener('click', () => {
            cardElement.classList.toggle('expanded');
        });
        */
        const redditUrlElement = document.createElement('a');
        redditUrlElement.classList.add('card-url');
        if (card.permalink) {
            redditUrlElement.href = "https://reddit.com" + card.permalink;
            const regex = /^(\/r\/[^\/]+)/;
            redditUrlElement.textContent = card.permalink.match(regex)[1] + " - 15 hr. ago - By u/someName";
        }
        /*
        const metaElement = document.createElement('h2');
        metaElement.classList.add('card-meta');
        metaElement.textContent = card.metaInfo + ". 15hr. ago";
        */
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
        // text post
        const selftextElement = document.createElement('p');
        selftextElement.classList.add('card-selftext');
        if (card.selftext) {
            selftextElement.textContent = card.selftext;
        }
        // image post
        const imgContainer = document.createElement('a');
        imgContainer.classList.add('card-imgContainer');
        const img = document.createElement('img');
        img.classList.add('card-image');
        if (card.url && !card.selftext) {
            if (card.url.includes("//v.redd.it")) { // video
            }
            else if (card.url.includes("gallery")) { // series of images
            }
            else if (card.url.includes("//i.redd.it")) { // images
                // img.src = resolveImageLink(card.url);
                img.src = card.url;
                imgContainer.href = "https://reddit.com" + card.permalink;
            }
            else { // other links like news
            }
            imgContainer.appendChild(img);
        }
        const claudeReasonElement = document.createElement('p');
        claudeReasonElement.classList.add('card-claudeReason');
        if (card.comment && card.comment !== "") {
            claudeReasonElement.textContent = "Claude AI: \"" + card.comment + "\"";
        }
        cardUnlock.appendChild(redditUrlElement);
        cardUnlock.appendChild(titleElement);
        cardUnlock.appendChild(ratingElement);
        cardUnlock.appendChild(claudeReasonElement);
        cardUnlock.appendChild(selftextElement);
        cardUnlock.appendChild(imgContainer);
        cardElement.appendChild(cardUnlock);
        cardElement.appendChild(cardLock);
        cards.appendChild(cardElement);
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
let weservAvailable = false;
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
function resolveImageLink(newLink) {
    let proxyUrl = newLink;
    if (weservAvailable) {
        proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(newLink)}`; // Proxy the image through images.weserv.nl so we don't raise cookie warning
    }
    return proxyUrl;
}
// start of page
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
    });
}
// init page
window.onload = DateChanger.callDefaultDate; // script.ts main() is called there. Done this way so that we get the date before the page loads
