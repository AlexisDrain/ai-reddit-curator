// using tutorial from https://www.youtube.com/watch?v=S-T9XoCMwt4

const body = document.body;

// options button toggle
const darkModeToggle = document.getElementById('darkModeToggle') as HTMLInputElement | null;

// load dark-mode setting
let themeDark: string | null;
try {
  themeDark = localStorage.getItem('theme-dark');
  
  if (themeDark === null) {
    console.log("Item 'theme-dark' not found in localStorage");
    
    // save the bool for the user
    themeDark = "true";
    localStorage.setItem("theme-dark", themeDark);

    // added to the body
    body.classList.toggle('dark-mode', true);
    body.classList.toggle('light-mode', false);

    darkModeToggle.checked = body.classList.contains('dark-mode'); // visual, for the check button
  } else {
    console.log("Retrieved 'theme-dark' from localStorage:", themeDark);

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
}

// click listener event
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

darkModeToggle.addEventListener('click', toggleDarkMode);

// Add touch event listeners for mobile
// darkModeToggle.addEventListener('touchstart', toggleDarkMode);