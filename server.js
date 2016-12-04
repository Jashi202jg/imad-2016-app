var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
  user: 'jashi202jg',
  database: 'jashi202jg',
  host: 'db.imad.hasura-app.io',
  port: '5432',
  password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

var articles = { 
'article-one' : {
    title: 'Article-one | Jashi202jg',
    heading: 'Article 1',
    date: 'Sep 25 2k16',
    content: ` <p><i>Hi,every one.This is my first web page</i></p>
            <p>This is another paragaph which tells how to code using HTML....blah..blah</p>
            <p><b>I'll bre able to create web pages like a pro</b></p>`
},
'article-two' : {
    title: 'Article-two | Jashi202jg',
    heading: 'Article 2',
    date: 'Sep 26 2k16',
    content: `<p><i>Hi,evereyone. This is my article two</i></p>
            <p>Article 2 content goes here</p>
            <p><b>Like</b></p>`    
},
'article-three': {
    title: 'Article-three | Jashi202jg',
    heading: 'Article 3',
    date: 'Sep 27 2k16',
    content: `<p><i>Hi,every one.</i></p>
            <p>This is my Article 3</p>
            <p><b>This is my last article</b></p>`        
}
};

function createTemplate (data){
var title = data.title;
var date = data.date;
var heading = data.heading;
var content = data.content;

var htmlTemplate = `<html>
  <head>
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link href="/ui/style.css" rel="stylesheet" />
  </head>
    <body>
        <div class="container">
        <div>
        <a href="/">Home</a>
        </div>
        <hr>
        <h4>${heading}</h4>
        <hr>
        <h5>${date}</h5>
        <div>
        ${content}
        </div>
        </div>
    </body>
</html>
`;
return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/test-db', function (req, res) {

 pool.query('SELECT * FROM test',function(err,result){
    if(err){
        res.status(500).send(err.toString());
    } else{
        res.send(JSON.stringify(result.rows));   
    }
 });
});

var counter=0;
app.get('/counter',function(req,res){
    counter = counter +1;
    res.send(counter.toString());
});

var names = [];
app.get('/submit-name', function(req,res){  //URL:/submit-name?name=xxxxxx
    //Get the name from the request
    var name = req.query.name;
    
    names.push(name);
    // JSON: javascript Object Notation
    res.send(JSON.stringify(names));
});

app.get('/:articleName', function (req,res){
    
//articleName == article-one
//articles[articleName] == {} content object for article one
 var articleName = req.params.articleName; 
 res.send(createTemplate(articles[articleName]));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


/*app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
*/
var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
