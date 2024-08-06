// using tutorial from https://www.youtube.com/watch?v=S-T9XoCMwt4
const body = document.body;
// options button toggle
const darkModeToggle = document.getElementById('darkModeToggle');
// load dark-mode setting
let themeDark = localStorage.getItem('theme-dark');
if (themeDark == "true") {
    body.classList.toggle('dark-mode', true);
    body.classList.toggle('light-mode', false);
}
else if (themeDark == "false") {
    body.classList.toggle('dark-mode', false);
    body.classList.toggle('light-mode', true);
}
darkModeToggle.checked = body.classList.contains('dark-mode');
// click listener event
const toggleDarkMode = (event) => {
    // event.preventDefault(); // Prevent default behavior // Alexis: this makes the toggle button stuck at dark-mode for some reason
    if (themeDark == "true") {
        themeDark = "false";
        body.classList.toggle('dark-mode', false);
        body.classList.toggle('light-mode', true);
    }
    else if (themeDark == "false") {
        themeDark = "true";
        body.classList.toggle('dark-mode', true);
        body.classList.toggle('light-mode', false);
    }
    localStorage.setItem("theme-dark", themeDark);
};
darkModeToggle.addEventListener('click', toggleDarkMode);
export {};
// Add touch event listeners for mobile
// darkModeToggle.addEventListener('touchstart', toggleDarkMode);
