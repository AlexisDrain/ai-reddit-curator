// debug: prototype to load a json
async function loadData() {
    const response = await fetch('/dailyData/2024-7-14.json');
    const data = await response.json();
    return data;
}
loadData().then(jsonFile => {
    console.log(jsonFile);
});
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
        imageUrl: 'https://i.redd.it/a6thp8fyeg5d1.jpeg',
        content: 'Nullam fringilla eros ut tempor luctus.'
    },
    {
        metaInfo: "r/testReddit",
        title: `I found this amazing thing`,
        content: 'Donec vitae risus ac magna vehicula auctor.',
        selftext: `This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.
        This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up. This is a super long text I made up.`,
    },
    {
        metaInfo: "r/testReddit",
        title: `I found this amazing thing`,
        content: 'Curabitur fermentum magna et mauris faucibus, vel tristique elit iaculis.'
    }
];
// dateChange (right side of screen)
const dateChanger = document.getElementById('redditDate');
function setDefaultDate() {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const defaultDate = yesterday.toISOString().split('T')[0];
    dateChanger.value = defaultDate;
}
setDefaultDate();
function onChangeDate(e) {
    console.log(e);
    alert(e.target.value);
}
dateChanger.addEventListener('input', onChangeDate);
// Create and append card elements
function CreateCards(cardsToCreate) {
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
        if (card.permaLink) {
            redditUrlElement.classList.add('card-url');
            redditUrlElement.href = "https://reddit.com" + card.permaLink;
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
        // text post
        const selftextElement = document.createElement('p');
        if (card.selftext) {
            selftextElement.classList.add('card-selftext');
            selftextElement.textContent = card.selftext;
        }
        // image post
        const imgContainer = document.createElement('a');
        if (card.imageUrl) {
            const img = document.createElement('img');
            img.classList.add('card-image');
            img.src = card.imageUrl;
            imgContainer.href = "https://sh.reddit.com" + card.permaLink;
            imgContainer.appendChild(img);
        }
        const claudeReasonElement = document.createElement('p');
        if (card.claudeComment) {
            claudeReasonElement.classList.add('card-claudeReason');
            claudeReasonElement.textContent = "Claude AI: \"" + card.claudeComment + "\"";
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
// options
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
});
/*
const { exec } = require('child_process');

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}


async function RunPythonTest() {
    let pyodide = await loadPyodide();

    // Running 'ls' command
    const lsOutput = await executeCommand('ls');
    console.log('Output of ls command:');
    console.log(lsOutput);


    
    // try {
    //     // Load dependencies
    //     await pyodide.loadPackage(['micropip']);  // Add your required packages here
    //     // You might need to install packages not available in Pyodide's default distribution
    //     await pyodide.runPythonAsync(`
    //         import micropip
    //         await micropip.install('tokenizers')
    //         from subprocess import call
    //         from pathlib import Path
    //         print('hi alexis')
    //         Path("my_file.txt").write_text(f"{call('pip freeze')}")
    //         Path("my_file2.txt").write_text(f"{call('which python')}")
    //         await micropip.install('anthropic')


    //     `);

    //     let response = await fetch('./testPythonOnWebsite2.py');
    //     //let pythonCode = document.getElementById('python-main').text;
    //     console.log(pythonCode);
    //     // Run the Python code to define the function(s)
    //     await pyodide.runPythonAsync(pythonCode);
        
    //     let result = await pyodide.runPythonAsync(pythonCode);
    //     document.getElementById("output").innerText = result;
    // } catch (error) {
    //     console.error("Error loading or running Python file:", error);
    //     document.getElementById("output").innerText = "Error: " + error.message;
    // }
}
*/
// start of page
function main() {
    CreateCards(cards);
    body.classList.toggle('dark-mode');
    // document.getElementById('textfield-subreddit').value = "";
}
window.onload = main;
export {};
