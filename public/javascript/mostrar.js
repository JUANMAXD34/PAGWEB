const btn=document.getElementById("btn");
const cerrar=document.getElementById("cerrar");
const modal=document.getElementById("modal");
btn.addEventListener("click",()=>{
    modal.showModal();
})
cerrar.addEventListener("click",()=>{
    modal.close();
})

let today = new Date().toISOString().split("T")[0];
    document.getElementById("datePicker").setAttribute("max", today);