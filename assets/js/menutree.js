menuHeight = document.getElementsByClassName("index-menu")[0].offsetHeight;

containHeight = document.getElementsByClassName("joe_aside__item-contain")[0].offsetHeight;
titleHeight = document.getElementsByClassName("joe_aside__item-title")[0].offsetHeight;
aside = document.getElementsByClassName("menutree")[0];

function changeMenuHeight(){    
    aside.style.height = titleHeight + containHeight + "px";
}

if(menuHeight < 800){
    changeMenuHeight();
} else {
    aside.style.height = "800px";
}