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
      // Fetch the index file
      const indexResponse = await fetch('./dailyData/datesIndex.jsonl');
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
  
  if (Math.abs(scrollTop) <= 5) return;

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
