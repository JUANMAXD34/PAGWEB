document.addEventListener("DOMContentLoaded", ()=>{
    const toggler=document.querySelector(".navbar-toggler");
    const menu = document.querySelector("#navbarColor02");

    toggler.addEventListener("click", ()=>{
        menu.classList.toggle("show");
    })
})

const body = document.querySelector("body"),
    sidebar = body.querySelector("nav"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text"),
    spans = document.querySelectorAll(".progress span");

    toggle.addEventListener("click", ()=>{
        sidebar.classList.toggle("close");
    });

    searchBtn.addEventListener("click", ()=>{
        sidebar.classList.remove("close");
    });

    modeSwitch.addEventListener("click", ()=>{
        body.classList.toggle("dark");
        if(body.classList.contains("dark")){
            modeText.innerText = "Modo de luz";
        }else{
            modeText.innerText = "Modo oscuro";
        }
    });
    