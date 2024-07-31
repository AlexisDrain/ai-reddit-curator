import * as DateChanger from "./dateChanger.js";
const body = document.body;
const cardContainer = document.getElementById('cardContainer');
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
            img.src = card.url;
            imgContainer.href = "https://sh.reddit.com" + card.permalink;
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
        console.log(response);
        if (!response.ok) {
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
// start of page
export function main() {
    let jsonFileCurrent;
    loadData(DateChanger.dateChangerInput.value).then(jsonFile => {
        jsonFileCurrent = jsonFile;
    }).then(asdf => {
        cardContainerDestroyAll(cardContainer);
        createCards(jsonFileCurrent, cardContainer);
        sortCards(cardContainer);
    });
}
// init page
window.onload = DateChanger.callDefaultDate; // script.ts main() is called there. Done this way so that we get the date before the page loads
