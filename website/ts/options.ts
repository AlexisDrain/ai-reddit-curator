import * as script from "./script.js";

// using tutorial from https://www.youtube.com/watch?v=S-T9XoCMwt4

const body = document.body;

let darkModeToggleHTML = null; // toggle dark mode
let denylistInputHTML = null; // denylist text input
let denylistChildrenHTML = null; // visual denylist list of blocked subreddits
let catagorySelectHTML = null;
let themeDark: string | null = "true";
export let categoryValue = null;
export let blocked_subreddits: string[] | null; // denylist list of blocked subreddits

export function loadOptions() {
  catagorySelectHTML = document.getElementById("rating-dropdown") as HTMLSelectElement
  if (catagorySelectHTML) {
    categoryValue = catagorySelectHTML.value;
    catagorySelectHTML.addEventListener("change", () => {
      scrollToTop();
      script.main();
    });
  }

  darkModeToggleHTML = document.getElementById('darkModeToggle') as HTMLInputElement | null;
  darkModeToggleHTML.addEventListener('click', toggleDarkMode);

  // deny list table
  denylistChildrenHTML = document.getElementById('denylist-children') as HTMLInputElement | null;
  // deny list "add" button
  const denylistInputButton = document.getElementById('denylist-input-button') as HTMLInputElement;
  if(denylistInputButton) {
      denylistInputButton.addEventListener('click', submitDenyListType);
  }
  // for pressing enter when you are typing in the denylist field
  denylistInputHTML = document.getElementById('denylist-input') as HTMLInputElement;
  if (denylistInputHTML) {
    denylistInputHTML.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent form submission if within a form
          submitDenyListType();
      }
  });
  }

  // load dark-mode setting
  try {
    themeDark = localStorage.getItem('theme-dark');
    
    if (themeDark === null) {
      console.log("Item 'theme-dark' not found in localStorage. Set to true (dark)");
      
      // save the bool for the user
      themeDark = "true";
      localStorage.setItem("theme-dark", themeDark);

      // added to the body
      body.classList.toggle('dark-mode', true);
      body.classList.toggle('light-mode', false);

      darkModeToggleHTML.checked = body.classList.contains('dark-mode'); // visual, for the check button
    } else {
      console.log("Retrieved 'theme-dark' from localStorage. var value: ", themeDark);

      // added to the body
      if(themeDark == "true") {
        body.classList.toggle('dark-mode', true);
        body.classList.toggle('light-mode', false);
      } else if(themeDark == "false") {
        body.classList.toggle('dark-mode', false);
        body.classList.toggle('light-mode', true);
      }
      darkModeToggleHTML.checked = body.classList.contains('dark-mode'); // visual, for the check button
    }
  } catch (error) {
    console.error("Error accessing theme-dark localStorage:", error);
  };


  // load blocked subreddits setting
  // if there's no denylist on page, do not proceed
  if(denylistChildrenHTML == null) {
    return;
  }
  try {
    if (localStorage.getItem('blocked-subreddits') == null) {
      console.log("Item 'blocked_subreddits' not found in localStorage. Initilizing blocked_subreddits");
      blocked_subreddits = [];
      denylistContainerDestroyAll(denylistChildrenHTML);
      addNewBlockedSubreddit("r/politics");
    } else {
      denylistContainerDestroyAll(denylistChildrenHTML);
      blocked_subreddits = JSON.parse(localStorage.getItem('blocked-subreddits'));
      console.log("Retrieved 'blocked-subreddits' from localStorage. var value: ", blocked_subreddits);
      blocked_subreddits.forEach (element => {
      displayBlockedSubreddit(element);
      });
    }
  }
  catch (error) {
    console.error("Error accessing blocked-subreddits localStorage:", error);
  };
}

// toggle dark mode, click listener event
const toggleDarkMode = (event: Event) => {
  // event.preventDefault(); // Prevent default behavior // Alexis: this makes the toggle button stuck at dark-mode for some reason
  console.log("toggle dark mode");
  if(themeDark == "true") {
    themeDark = "false";
    body.classList.toggle('dark-mode', false);
    body.classList.toggle('light-mode', true);
  } else {
    themeDark = "true";
    body.classList.toggle('dark-mode', true);
    body.classList.toggle('light-mode', false);
  }

  darkModeToggleHTML.checked = body.classList.contains('dark-mode'); // visual, for the check button
  localStorage.setItem("theme-dark", themeDark);
};


function addNewBlockedSubreddit(labelText: string) {
  // check duplicate
  let isDuplicate : Boolean = false;
  blocked_subreddits.forEach((subreddit) => {
    if (normalizeSubredditName(subreddit) === normalizeSubredditName(labelText)) {
      isDuplicate = true; // if we return here, it only stops the forEach() function. not the addNewBlockedSubbreddit()
    }
  });
  if (isDuplicate) { return; }

  // save this new label
  blocked_subreddits.push(labelText);
  localStorage.setItem("blocked-subreddits", JSON.stringify(blocked_subreddits));

  displayBlockedSubreddit(labelText);
}
function displayBlockedSubreddit(labelText: string) {
  
  // Create the main div element
  const div = document.createElement('div');
  div.classList.add("denylist-child");
  div.setAttribute("subreddit", labelText);
  
  // Create the label element
  const label = document.createElement('label');
  label.textContent = labelText;

  // Create the button element
  const trashButton = createTrashIconButton({
    width: 20,
    height: 20,
    color: '#ff0000',
    onClick: () => removeDenylistChild(div, labelText)
  });

  // Append the button and label to the div
  div.appendChild(label);
  div.appendChild(trashButton);

  denylistChildrenHTML.appendChild(div);
}

function removeDenylistChild(div: HTMLElement, subreddit: string) {
  blocked_subreddits = blocked_subreddits.filter(item => item !== subreddit); // remove subreddit from array
  localStorage.setItem("blocked-subreddits", JSON.stringify(blocked_subreddits));
  div.parentNode.removeChild(div);
  
  script.main(); // restart page with new denylist settings
}
// denylist press enter listener event
function submitDenyListType() {
  if(denylistInputHTML.value != "") {
    const regex = new RegExp('r\\/(.+)');
    let subreddit = denylistInputHTML.value;
    if(subreddit.match(regex)) {
      subreddit = subreddit.match(regex)[0];
    }
    if(subreddit.startsWith("r/") == false) {
      subreddit = "r/" + subreddit
    }
    addNewBlockedSubreddit(subreddit);
    denylistInputHTML.value = "";
  }

  
  script.main(); // restart page with new denylist settings
}

// Add touch event listeners for mobile
// darkModeToggle.addEventListener('touchstart', toggleDarkMode);

function createTrashIcon({
  width = 24,
  height = 24,
  color = '#000000',
  strokeWidth = 1.5
} = {}) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.style.stroke = color; // Use style property instead of attribute
  svg.setAttribute('stroke-width', strokeWidth.toString());
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', '3 6 5 6 21 6');
  svg.appendChild(polyline);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2');
  svg.appendChild(path);

  const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line1.setAttribute('x1', '10');
  line1.setAttribute('y1', '11');
  line1.setAttribute('x2', '10');
  line1.setAttribute('y2', '17');
  svg.appendChild(line1);

  const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line2.setAttribute('x1', '14');
  line2.setAttribute('y1', '11');
  line2.setAttribute('x2', '14');
  line2.setAttribute('y2', '17');
  svg.appendChild(line2);

  return svg;
}

function createTrashIconButton({
  width = 24,
  height = 24,
  color = '#000000',
  strokeWidth = 1.5,
  buttonText = '',
  onClick = () => {}
} = {}) {
  const button = document.createElement('button');
  button.style.display = 'inline-flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  // button.style.padding = '8px';
  button.style.border = '#fff';
  button.style.marginLeft = "auto";
  
  // button.style.borderRadius = '4px';
  button.style.background = 'none';
  button.style.cursor = 'pointer';

  const icon = createTrashIcon({ width, height, color, strokeWidth });
  icon.style.stroke = "#000";
  button.appendChild(icon);

  if (buttonText) {
    const span = document.createElement('span');
    span.textContent = buttonText;
    span.style.marginLeft = '8px';
    button.appendChild(span);
  }

  button.addEventListener('click', onClick);

  // Add hover effect
  button.addEventListener('mouseover', () => {
    icon.style.stroke = "#f00";
  });

  button.addEventListener('mouseout', () => {
    icon.style.stroke = "#000";
  });

  return button;
}


export const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};


function normalizeSubredditName(name: string): string {
  // Remove leading '/' if present, ensure 'r/' prefix, and convert to lowercase
  return name.replace(/^\/?(r\/)?/i, 'r/').toLowerCase();
}


function denylistContainerDestroyAll(ele : HTMLElement | null) {
  ele.innerHTML = "";
}