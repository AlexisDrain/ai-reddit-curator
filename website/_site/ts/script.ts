import * as DateChanger from "./dateChanger.js";
const body = document.body;

interface RedditPost {
  permalink: string;
  title?: string;
  content?: string;
  rating: number;
  comment: string;
  imageUrl?: string;  // Optional
  selftext?: string;  // Optional
}

const cardContainer = document.getElementById('cardContainer');

// Create and append card elements
function CreateCards(cardsToCreate : RedditPost[]) {
    cardsToCreate.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const cardUnlock = document.createElement('div');
        cardUnlock.classList.add('card-unlock');

        const cardLock = document.createElement('div');
        cardLock.classList.add('card-unlock');

        /*
        expand card listener
        cardElement.addEventListener('click', () => {
            cardElement.classList.toggle('expanded');
        });
        */
        const redditUrlElement = document.createElement('a');
        if (card.permalink) {
            redditUrlElement.classList.add('card-url');
            redditUrlElement.href = "https://reddit.com"+ card.permalink;
            const regex = /^(\/r\/[^\/]+)/;
            redditUrlElement.textContent = card.permalink.match(regex)[1] + " - 15 hr. ago - By u/someName";
        }

        /*
        const metaElement = document.createElement('h2');
        metaElement.classList.add('card-meta');
        metaElement.textContent = card.metaInfo + ". 15hr. ago";
        */
        const titleElement = document.createElement('h2');
        titleElement.classList.add('card-title');
        if (card.title) {
            titleElement.textContent = card.title;
        }

        const contentElement = document.createElement('p');
        contentElement.classList.add('card-content');
        if (card.content) {
            contentElement.textContent = card.content;
        }
        // text post
        const selftextElement = document.createElement('p');
        if(card.selftext) {
            selftextElement.classList.add('card-selftext');
            selftextElement.textContent = card.selftext;
        }

        // image post
        const imgContainer = document.createElement('a');
        if(card.imageUrl) {
            const img = document.createElement('img');
            img.classList.add('card-image');
            img.src = card.imageUrl;
            imgContainer.href = "https://sh.reddit.com"+ card.permalink;
            imgContainer.appendChild(img);

        }

        const claudeReasonElement = document.createElement('p');
        if (card.comment) {
            claudeReasonElement.classList.add('card-claudeReason');
            claudeReasonElement.textContent = "Claude AI: \"" + card.comment + "\"";
        }
            
            
        cardUnlock.appendChild(redditUrlElement);
        cardUnlock.appendChild(titleElement);
        cardUnlock.appendChild(contentElement);
        cardUnlock.appendChild(selftextElement);
        cardUnlock.appendChild(imgContainer);
        cardElement.appendChild(cardUnlock);
        cardElement.appendChild(cardLock);
        cardElement.appendChild(claudeReasonElement);
            
        cardContainer.appendChild(cardElement);
    });
}

// debug: prototype to load a json
async function loadData(date : string) {
  try {
    const response = await fetch('/dailyData/' + date +'.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data : RedditPost[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to load data:", error);
    return null;
  }
}

function cardContainerDestroyAll() {
  cardContainer.innerHTML = "";
}

// start of page
export function main() {

  let jsonFileCurrent : RedditPost[];
  loadData(DateChanger.dateChangerInput.value).then(jsonFile => {
      jsonFileCurrent = jsonFile;
    }).then(asdf => {
      cardContainerDestroyAll();
      CreateCards(jsonFileCurrent);
    });

  }


  // init page
  window.onload = DateChanger.callDefaultDate // script main is called there