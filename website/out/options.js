/*
export interface OptionsConfig {
    theme: 'light' | "dark";
};

export const defaultOptions : OptionsConfig {
    theme = "dark"
};
*/
const body = document.body;
// init page: set dark mode
// body.classList.toggle('dark-mode'); // this is now done in index.html
// options button toggle
// using tutorial from https://www.youtube.com/watch?v=S-T9XoCMwt4
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.checked = body.classList.contains('dark-mode');
const toggleDarkMode = (event) => {
    // event.preventDefault(); // Prevent default behavior // Alexis: this makes the toggle button stuck at dark-mode for some reason
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
};
darkModeToggle.addEventListener('click', toggleDarkMode);
export {};
// Add touch event listeners for mobile
// darkModeToggle.addEventListener('touchstart', toggleDarkMode);
