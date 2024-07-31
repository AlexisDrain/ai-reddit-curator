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
const darkModeToggle = document.getElementById('darkModeToggle') as HTMLInputElement | null;
darkModeToggle.checked = true;
darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  body.classList.toggle('light-mode');
});