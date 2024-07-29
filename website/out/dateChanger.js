import * as script from "./script.js";
// dateChange (right side of screen)
export const dateChangerInput = document.getElementById('redditDate');
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
export function callDefaultDate() {
    fetchMostRecentData().then(name => {
        dateChangerInput.value = name;
        script.main();
    });
}
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
        console.log(dataFiles[0]['file']);
        return dataFiles[0]['file'];
    }
    catch (error) {
        console.error('Error:', error);
        // document.getElementById('result').textContent = 'Error: ' + error.message;
    }
}
function onChangeDate(e) {
    script.main();
}
dateChangerInput.addEventListener('input', onChangeDate);
