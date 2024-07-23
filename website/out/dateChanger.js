import * as script from "./script.js";
// dateChange (right side of screen)
export const dateChangerInput = document.getElementById('redditDate');
function setDefaultDate() {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const defaultDate = yesterday.toISOString().split('T')[0];
    dateChangerInput.value = defaultDate;
}
setDefaultDate();
function onChangeDate(e) {
    script.main();
}
dateChangerInput.addEventListener('input', onChangeDate);
