// using tutorial from https://www.youtube.com/watch?v=S-T9XoCMwt4

const body = document.body;

let darkModeToggle = null; // toggle dark mode
let denylistInput = null; // denylist text input
document.addEventListener('DOMContentLoaded', () => {
  darkModeToggle = document.getElementById('darkModeToggle') as HTMLInputElement | null;
  darkModeToggle.addEventListener('click', toggleDarkMode);
  denylistInput = document.getElementById('denylist-input') as HTMLInputElement;
  if (denylistInput) {
    denylistInput.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent form submission if within a form
          submitDenyListType(denylistInput.value);
      }
  });
  }
})

// load dark-mode setting
let themeDark: string | null;
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

    darkModeToggle.checked = body.classList.contains('dark-mode'); // visual, for the check button
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
    darkModeToggle.checked = body.classList.contains('dark-mode'); // visual, for the check button
  }
} catch (error) {
  console.error("Error accessing localStorage:", error);
};


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

  darkModeToggle.checked = body.classList.contains('dark-mode'); // visual, for the check button
  localStorage.setItem("theme-dark", themeDark);
};

// denylist press enter listener event
function submitDenyListType(value: string) {
  alert(value);
}

// Add touch event listeners for mobile
// darkModeToggle.addEventListener('touchstart', toggleDarkMode);