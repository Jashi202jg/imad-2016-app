//content code


button.onclick = function(){
    
    //Create a request object
    var request = new XMLHttpRequest(); 
    
    //capture the response and store it in a variable
    request.onreadystatechange = function() {
        if (request.readystate === XMLHttpRequest.DONE){
            //Take some action
            if (request.status === 200){
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        }
    //Not done yet
    };
    var button = document.getElementById('counter');
    //Make the request
    request.open('GET', 'http://jashi202jg.imad.hasura-app.io/counter', true);
    request.send(null);
};