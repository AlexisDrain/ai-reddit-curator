// using tutorial from https://www.youtube.com/watch?v=S-T9XoCMwt4

const body = document.body;

let darkModeToggleHTML = null; // toggle dark mode
let denylistInputHTML = null; // denylist text input
let denylistChildrenHTML = null; // denylist list of blocked subreddits
let themeDark: string | null = "true";

document.addEventListener('DOMContentLoaded', () => {
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

  // load denylist children
  createDivWithButtonAndLabel("r/hello_world");
  createDivWithButtonAndLabel("r/politics");
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
    console.error("Error accessing localStorage:", error);
  };

});

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


function createDivWithButtonAndLabel(labelText: string) {
  // Create the main div element
  const div = document.createElement('div');
  div.classList.add("denylist-child");
  
    // Create the label element
    const label = document.createElement('label');
    label.textContent = labelText;

  // Create the button element
  const button = document.createElement('button');
  button.textContent = "X";
  button.classList.add("denylist-button");
  button.addEventListener("click", () => removeDenylistChild(div));

  // Append the button and label to the div
  div.appendChild(label);
  div.appendChild(button);

  denylistChildrenHTML.appendChild(div);
}

function removeDenylistChild(div: HTMLElement) {
  div.parentNode.removeChild(div);
}
// denylist press enter listener event
function submitDenyListType() {
  if(denylistInputHTML.value != "") {
    createDivWithButtonAndLabel(denylistInputHTML.value);
    denylistInputHTML.value = "";
  }
}

// Usage example
const newDiv = createDivWithButtonAndLabel('Click me', 'This is a label');

// Add touch event listeners for mobile
// darkModeToggle.addEventListener('touchstart', toggleDarkMode);