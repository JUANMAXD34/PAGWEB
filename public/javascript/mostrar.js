const btn=document.getElementById("btn");
const cerrar=document.getElementById("cerrar");
const modal=document.getElementById("modal");
btn.addEventListener("click",()=>{
    modal.showModal();
})
cerrar.addEventListener("click",()=>{
    modal.close();
})