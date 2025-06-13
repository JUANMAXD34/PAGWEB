const texto = document.querySelector(".texto");
const cuerpo = document.querySelector(".texto");

document.addEventListener("DOMContentLoaded", () => {
    document.body.style.backgroundColor = "opacity(0.3)"
    texto.style.opacity = "0.5";
    texto.style.transition = "all 1s ease-in-out";
    texto.style.transform = "translateY(-130px)";
});

window.addEventListener("scroll", () => {
    var scroll = window.scrollY;
    if (scroll > 0) {
        texto.style.opacity = "1";
        texto.style.transition = "all 1s ease-in-out";
        texto.style.transform = "translateY(-10px)";
        texto.style.filter = "blur(0px)";
    } else {
        texto.style.opacity = "0.5";
        texto.style.transition = "all 1s ease-in-out";
        texto.style.transform = "translateY(-130px)";
    }
});