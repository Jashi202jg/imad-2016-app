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
    heading: '<p><b><font color="black" size="5" face="Cursive">3 Interesting Facts On India That You Had No Idea About</font></b>',
    date: 'Dec 15 2k16',
    content: ` <p><b><font color=" #FA8072" size="4" face="Courier">1. A floating post office</font></b></p>
            <p>India has the largest postal network in the world with over 1, 55,015 post offices. A single post office on an average serves a population of 7,175 people. The floating post office in Dal Lake, Srinagar, was inaugurated in August 2011.</p><hr><br>
            
            <p><b><font color=" #FA8072" size="4" face="Courier">2. Water on the moon was discovered by India
            </font></b></p><p>In September 2009, India's ISRO Chandrayaan- 1 using its Moon Mineralogy Mapper detected water on the moon for the first time.</p><hr><br>
            
            <p><b><font color=" #FA8072" size="4" face="Courier">3. India's first President only took 50% of his salary
            </font></b></p><p>When Dr Rajendra Prasad was appointed the President of India, he only took 50% of his salary, claiming he did not require more than that. Towards the end of his 12-year tenure he only took 25% of his salary. The salary of the President was Rs 10,000 back then.</p><hr><br> `
},
'article-two' : {
    title: 'Article-two | Jashi202jg',
    heading: '<p><b><font color="black" size="5" face="Cursive">Amazing Facts</font></b>',
    date: 'Dec 16 2k16',
    content: `<font color="#2F4F4F" sie="2" face="Tw Cen MT"><p>1. It is impossible to lick your elbow<br>
2. A crocodile can't stick it's tongue out.<br>
3. A shrimp's heart is in it's head.<br>
4. People say "Bless you" when you sneeze because when you sneeze,your heart stops for a mili-second.<br>
5. In a study of 200,000 ostriches over a period of 80 years, no one reported a single case where an ostrich buried its head in the sand.<br></p></font><br><hr>`    
},
'article-three': {
    title: 'Article-three | Jashi202jg',
    heading: '<p><b><font color="black" size="5" face="Cursive">Thanks for IMAD TEAM</font></b>',
    date: 'Dec 17 2k16',
    content: `<p>Hi,every one.</p>
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
        <br>
        <style>
        body{background-image: url("http://www.walldevil.com/wallpapers/a87/pattern-texture-light-background-wallpaper-flower-image.jpg");} </style>
        <div>
        <ul>
        <div class="floatleft">    
        <li><a href="/"><b>Home</b></a></li>
        <li><a href="/ui/Articles.html">Article</a></li>
        <li><a href="#">Contact</a></li>
        </div>
        <div class="floatright">
        <li class="right"><a href="#"><b><i>sign up</i></b></a></li>
        <li class="right"><a href="#"><b><i>sign in</i></b></a></li>
        </div>
        </ul>
        </div><div>
        <img class="img-medium" src="/ui/madi.png" align="right" >
        </div>
        <div class="container">
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

app.get('/ui/Articles.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'Articles.html'));
});

app.get('/ui/madi.png', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
