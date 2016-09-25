console.log('Loaded!');

//Changing the text
var element = document.getElementById('main-text');
element.innerHTML = 'Hi, This is my new server';

//Moving the image
var img = document.getElementById('madi');
img.onclick = function(){
    img.style.marginLeft = '100px';
};