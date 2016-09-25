console.log('Loaded!');

//Changing the text
var element = document.getElementById('main-text');
element.innerHTML = 'Hi, This is my new server';

//Moving the image
var img = document.getElementById('madi');
var marginLeft=0;
function moveRight(){
    marginLeft = marginLeft+ 10;    
    img.style.marginLeft = marginLeft + 'px';
    
}
img.onclick = function(){
   var interval = setInterval(moveRight, 100); 
  
};