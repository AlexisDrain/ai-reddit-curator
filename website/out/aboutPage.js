import { getPlatform } from "./script.js";
import { loadOptions } from "./options.js";
// init page: set dark mode
// const body = document.body;
// body.classList.toggle('dark-mode');
if (getPlatform() != "web") {
    document.getElementById("android-logo").innerHTML = "";
}
loadOptions();
