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
body.classList.toggle('dark-mode');

// options button toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  body.classList.toggle('light-mode');
});