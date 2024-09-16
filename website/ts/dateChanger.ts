import * as script from "./script.js";
import { scrollToTop } from "./options.js";

// dateChange (right side of screen)
export const dateChangerInput : HTMLInputElement = document.getElementById('redditDate') as HTMLInputElement;
const pageRightHTML : HTMLElement = document.getElementsByClassName('page-right')[0] as HTMLElement;
/*
export function callDefaultDate() {
  const today : Date = new Date();
  const yesterday : Date = new Date();
  yesterday.setDate(today.getDate() - 1);
  
  const defaultDate = yesterday.toISOString().split('T')[0];
  dateChangerInput.value = defaultDate;
  script.main();
}
*/

// we keep an index file that updates everyday because we cant use Path in a static website
async function fetchMostRecentData() {
  try {

      let indexResponse;
      if (script.getPlatform() != "web") {
        //android
        indexResponse = await fetch('https://raw.githubusercontent.com/AlexisDrain/ai-reddit-curator/main/website/dailyData/datesIndex.jsonl');
      } else { // web
        // Fetch the index file
        indexResponse = await fetch('./dailyData/datesIndex.jsonl');
      }
      if (!indexResponse.ok) {
          throw new Error('Failed to fetch dates index file');
      }
      const indexText = await indexResponse.text();

      // Parse the JSONL content
      const dataFiles = indexText.trim().split('\n')
          .map(line => JSON.parse(line));

      return dataFiles[dataFiles.length-1]['file'];
  } catch (error) {
      console.error('Error:', error);
      // document.getElementById('result').textContent = 'Error: ' + error.message;
  }
}

function onChangeDate(e){
    scrollToTop();
    script.main();
}
if(dateChangerInput) { // this is true in index.html, false in about.html
  dateChangerInput.addEventListener('input', onChangeDate);
}

// hide page-right when scrolling down in mobile
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // hack, when user is at the top, hide immediately.
  if (pageRightHTML.offsetHeight < 15) {
    pageRightHTML.classList.remove('hidden');
    return;
  }
  // hack, when user is close to the top and is scrolling down, hide immediately.
  if (pageRightHTML.offsetHeight < 400 && scrollTop > lastScrollTop) {
    pageRightHTML.classList.add('hidden');
  }


  if (Math.abs(scrollTop - lastScrollTop) <= 50) return;

  if (scrollTop > lastScrollTop && scrollTop > pageRightHTML.offsetHeight) {
    // Scrolling down
    pageRightHTML.classList.add('hidden');
  } else {
    // Scrolling up
    pageRightHTML.classList.remove('hidden');
  }

  lastScrollTop = scrollTop;
});

// this is the first funciton called by the website
export function callDefaultDate() {
  fetchMostRecentData().then(name => {
      if(dateChangerInput) { // this is true in index.html, false in about.html
        dateChangerInput.value = name;
        script.main();
      }
    }
  );
}
