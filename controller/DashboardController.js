import {getCookie} from "../utils/utils.js";

document.addEventListener("DOMContentLoaded", () => {
    let userLoggedIn = getCookie("greenShadowUser");

    document.getElementsByClassName("user-email").innerHTML = userLoggedIn;
})

