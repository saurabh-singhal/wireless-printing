var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

const port = process.env.PORT || 8082;

var request = require('request');

global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

var admin = require('firebase-admin');
var serviceAccount = require("./serviceAccountKey.json");
firebase.initializeApp(serviceAccount);

// Running Server Details.
var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at %s:%s Port", host, port)
});

app.get('/',function(req,res){
  var html='';
  html+="<html>";
  html+="<body>";
  html+="<form action='/signup'>";
  html+="<input type='submit' value='Sign Up'>";
  html+="</form>";
  html+="<form action='/signin'>";
  html+="<input type='submit' value='Sign In'>";
  html+="</form>";
  html+="</body>";
  html+="</html>";

  res.send(html);
});


app.get('/signup', function (req, res)
{
  var html='';
  html +="<body>";
  html += "<form action='/sign_up'  method='post' name='form1'>";
  html += "EMAIL:<input type='text' name='email'>";
  html += "PASSWORD:<input type='password' name='password'>";
  html += "<INPUT type='submit' value='submit'>";
  html += "<INPUT type='reset'  value='reset'>";
  html += "</form>";
  html += "</body>";
  res.send(html);
});

app.get('/signin', function (req, res)
{
  var html='';
  html +="<body>";
  html += "<form action='/sign_in'  method='post' name='form1'>";
  html += "EMAIL:<input type='text' name='email'>";
  html += "PASSWORD:<input type='password' name='password'>";
  html += "<INPUT type='submit' value='submit'>";
  html += "<INPUT type='reset'  value='reset'>";
  html += "</form>";
  html += "</body>";
  res.send(html);
});

app.post('/sign_up', urlencodedParser, function (req, res)
{
  var reply='';
  reply += "Your password is" + req.body.password;
  reply += "Your E-mail id is" + req.body.email;
  firebase.auth().createUserWithEmailAndPassword(req.body.email,req.body.password).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
});
  res.send(reply);

  admin.initializeApp(
    {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://major-project-bcca5.firebaseio.com"
    });

 });

 app.post('/sign_in', urlencodedParser, function (req, res)
 {
   var reply='';
   reply += "Your password is" + req.body.password;
   reply += "Your E-mail id is" + req.body.email;
   firebase.auth().signInWithEmailAndPassword(req.body.email,req.body.password).catch(function(error)
   {
   var errorCode = error.code;
   var errorMessage = error.message;
    if (errorCode === 'auth/wrong-password')
    {
      console.log('Wrong password.');
    }
   });

   //res.send(reply);
   firebase.auth().onAuthStateChanged(function(user)
   {
     if (user)
     {
       console.log('success');
       console.log(user.uid);

       request({
         uri:'http://majorprinting.000webhostapp.com/get_prior.php?a='+user.uid,
         json:true},function(error,response,body)
         {
           console.log(JSON.stringify(body.priority));
           var priority=body.priority;
           var uid=user.uid;
           var html='';
           html+="<html>";
           html+="<body>";
           html+="<form action='https://majorprinting.000webhostapp.com/upload1.php' method='post' enctype='multipart/form-data'>"
           html+="Select image to upload:<input type='file' name='fileToUpload' id='fileToUpload'>"
           html+="<input type='hidden' name='priority' value="+priority+">";
           html+="<input type='hidden' name='uid' value="+uid+">";
           html+="<input type='submit' value='Upload Image' name='submit'>";
           html+="</form>"
           html+="</body>";
           html+="</html>";
           res.send(html);
         });
     }
});

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     databaseURL: "https://major-project-bcca5.firebaseio.com"
   });

  });
