const body = document.body;
const cardContainer = document.getElementById('cardContainer');

// Sample data for cards
const cards = [
    {
        permaLink: '/r/interestingasfuck/comments/1dbfr53/the_reporter_asked_him_about_his_personal_fortune/',
        metaInfo: "r/interestingasfuck",
        title: `I found this amazing thing`,
        content: `The reporter asked him about his personal fortune and this was his answer - One of Steve Irwin's last interviews before he died while Filming a documentary in 2006.`,
        claudeComment: "This post is mindblowing and hilarious, as it showcases Steve Irwin's iconic personality and his humble response to a question about his personal fortune.",
    },
    {
        metaInfo: "r/testReddit",
        title: `I found this amazing thing`,
        content: 'Nullam fringilla eros ut tempor luctus.'
    },
    {
        metaInfo: "r/testReddit",
        title: `I found this amazing thing`,
        content: 'Donec vitae risus ac magna vehicula auctor.'
    },
    {
        metaInfo: "r/testReddit",
        title: `I found this amazing thing`,
        content: 'Curabitur fermentum magna et mauris faucibus, vel tristique elit iaculis.'
    }
];

// Create and append card elements
function CreateCards(cardsToCreate) {
    cardsToCreate.forEach(card => {

        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.addEventListener('click', () => {
            cardElement.classList.toggle('expanded');
        });
    
        const redditUrlElement = document.createElement('a');
        if (card.permaLink) {
            redditUrlElement.classList.add('card-url');
            redditUrlElement.href = "https://sh.reddit.com"+ card.permaLink;
            redditUrlElement.textContent = card.metaInfo + " - 15 hr. ago - By u/someName";
        }

        /*
        const metaElement = document.createElement('h2');
        metaElement.classList.add('card-meta');
        metaElement.textContent = card.metaInfo + ". 15hr. ago";
        */
        const titleElement = document.createElement('h2');
        titleElement.classList.add('card-title');
        titleElement.textContent = card.title;

        const contentElement = document.createElement('p');
        contentElement.classList.add('card-content');
        contentElement.textContent = card.content;
    
        const claudeReasonElement = document.createElement('p');
        if (card.claudeComment) {
            claudeReasonElement.classList.add('card-claudeReason');
            claudeReasonElement.textContent = "Claude AI: \"" + card.claudeComment + "\"";
        }
    
            
            cardElement.appendChild(redditUrlElement);
            cardElement.appendChild(titleElement);
            cardElement.appendChild(contentElement);
            cardElement.appendChild(claudeReasonElement);
            
        cardContainer.appendChild(cardElement);
    });
}

// options
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  body.classList.toggle('light-mode');
});


// start of page
function main() {
    
    CreateCards(cards);

    body.classList.toggle('dark-mode');
  }

  window.onload = main;