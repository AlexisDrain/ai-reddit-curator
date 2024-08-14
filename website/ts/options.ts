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
  } else {
    console.log("Retrieved 'theme-dark' from localStorage:", themeDark);

    if(themeDark == "true") {
      body.classList.toggle('dark-mode', true);
      body.classList.toggle('light-mode', false);
    } else if(themeDark == "false") {
      body.classList.toggle('dark-mode', false);
      body.classList.toggle('light-mode', true);
    }
    darkModeToggle.checked = body.classList.contains('dark-mode');
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

  localStorage.setItem("theme-dark", themeDark);
};

darkModeToggle.addEventListener('click', toggleDarkMode);

// Add touch event listeners for mobile
// darkModeToggle.addEventListener('touchstart', toggleDarkMode);