var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var config = {
  user: 'jashi202jg',
  database: 'jashi202jg',
  host: 'db.imad.hasura-app.io',
  port: '5432',
  password: 'db-jashi202jg-90497'
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());


function createTemplate (data){
var title = data.title;
var date = data.date;
var heading = data.heading;
var content = data.content;

var htmlTemplate = `<html>
  <head>
    <title>${title}</title>
    <link href="/ui/style.css" rel="stylesheet" />
  </head>
    <body>
        <style>
        body{background-image: url("http://www.walldevil.com/wallpapers/a87/pattern-texture-light-background-wallpaper-flower-image.jpg");} </style>
        <div>
        <ul>
        <div class="floatleft">    
        <li><a href="/"><b>Home</b></a></li>
        <li><a href="/Articles.html">Articles</a></li>
        <li><a href="#">Post</a></li>
        </div>
        <div class="floatright">
        <li class="right"><a href="/Login.html"><b><i>Login</i></b></a></li>
        </div>
        </ul>
        </div><div>
        <img class="img-medium" src="/ui/madi.png" align="right" >
        </div>
        <div class="container">
        <h4>${heading}</h4>
        <hr>
        <h5>${date.toDateString()}</h5><hr>
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

function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}


app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

app.post('/Register', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
});


app.post('/Login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
              //  req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
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

app.get('/Articles/:articleName',function(req,res){
    pool.query("SELECT * FROM article WHERE title=$1",[req.params.articleName],function(err,result){
       if(err)
        res.status(500).send(err.toString());
       else{
           if(result.rows.length === 0)
            res.status(404).send('Article not found');
           else{
               var articleData=result.rows[0];
            	res.send(createTemplate(articleData));
			 }
       }   
    });
});



app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/navbar.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'navbar.html'));
});

app.get('/ui/login.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/Articles.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'Articles.html'));
});

app.get('/Login.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'Login.html'));
});

app.get('/Register.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'Register.html'));
});

app.get('/ui/madi.png', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
