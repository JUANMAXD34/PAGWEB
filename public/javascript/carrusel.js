let list=document.querySelector('.slider .list');
let items=document.querySelectorAll('.slider .list .item');
let dots=document.querySelectorAll('.slider .dots li');
let prev=document.getElementById("prev");
let next=document.getElementById("next");

let active=0;
let lengthItems =items.length;

next.onclick = function(){
    if(active+1>lengthItems){
        active=0;
    }else{
        active=active+1;
    }
    reloadSlider();
}
prev.onclick=function(){
    if(active - 1<0){
        active=lengthItems;
    }else{
        active=active-1;
    }
    reloadSlider();
}
let refreshSlider = setInterval(()=>{next.click()},3000);
function reloadSlider(){
    let checkleft= items[active].offsetLeft;
    list.style.left= -checkleft + "px";

    let lastActiveDot=document.querySelector(".slider .dots li.active");
    lastActiveDot.classList.remove("active");
    dots[active].classList.add("active");
    clearImmediate(refreshSlider)
}
dots.forEach((Li,key)=>{
    Li.addEventListener('click',function(){
        active=key;
        reloadSlider();
    })
})