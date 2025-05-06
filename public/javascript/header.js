var encabezado=document.getElementById('Header');
window.addEventListener('scroll',()=>{
    var scroll = window.scrollY
    if(scroll>200){
        encabezado.style.backgroundColor='#24262B'
    }else{
        encabezado.style.backgroundColor='transparent'
    }
})