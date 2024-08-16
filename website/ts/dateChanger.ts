import * as script from "./script.js";

// dateChange (right side of screen)
export const dateChangerInput : HTMLInputElement = document.getElementById('redditDate') as HTMLInputElement;
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

const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};

export function callDefaultDate() {
  fetchMostRecentData().then(name => {
      dateChangerInput.value = name;
      script.main();
    }
  );
}

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
dateChangerInput.addEventListener('input', onChangeDate);