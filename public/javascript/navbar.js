document.addEventListener("DOMContentLoaded", ()=>{
    const toggler=document.querySelector(".navbar-toggler");
    const menu = document.querySelector("#navbarColor02");

    toggler.addEventListener("click", ()=>{
        menu.classList.toggle("show");
    })
})