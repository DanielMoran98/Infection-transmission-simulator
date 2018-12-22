var express = require("express");
var path = require('path');
var app     = express();



//Store all HTML files in view folder.
//app.use(express.static(__dirname + '/routes'));
//Store all JS and CSS in Scripts folder.
app.use(express.static(__dirname + ''));

//app.set('views', path.join(__dirname + '/views'))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


//app.use(express.static(__dirname + 'public'));


app.get('/',function(req, res){
  res.render('index.html')
  //It will find and locate index.html from View or Scripts
});


app.listen(3000);

console.log("\nRunning at Port 3000");
