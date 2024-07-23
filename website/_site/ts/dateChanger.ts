import * as script from "./script.js";

// dateChange (right side of screen)
export const dateChangerInput : HTMLInputElement = document.getElementById('redditDate') as HTMLInputElement;
function setDefaultDate() {
  const today : Date = new Date();
  const yesterday : Date = new Date();
  yesterday.setDate(today.getDate() - 1);
  
  const defaultDate = yesterday.toISOString().split('T')[0];
  dateChangerInput.value = defaultDate;
}
setDefaultDate();
function onChangeDate(e){
    script.main();
}
dateChangerInput.addEventListener('input', onChangeDate);