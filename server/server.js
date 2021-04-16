const register = require('./register.js');
const login = require('./login.js');
const service1 = require('./service1.js');
const service2 = require('./service2.js');
const service3 = require('./service3.js');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const bparser_form = bodyParser.json()



app.get('/', function (req, res) {
   res.send('Hello TEST');
})

app.post('/login', bparser_form, async function (req, res) {
   console.log('Login');

   let username = req.body.username;
   let password = req.body.password;

   let result = await login(username, password);
 
   res.status(200).send(result);
})

app.post('/register', bparser_form , async function (req, res) {
   console.log('Register');

   let username = req.body.username;
   let password = req.body.password;

   let result = await register(username, password);
 
   res.status(200).send(result);
})

app.get('/service_1', async function (req, res) {
   console.log('Service_1');

   let result = await service1('Service_2', '');
 
   res.status(200).send(result);
})
app.get('/service_2', async function (req, res) {
   console.log('Service_2');

   let result = await service2('Service_2', '');
 
   res.status(200).send(result);
})
app.get('/service_3', async function (req, res) {
   console.log('Service_3');

   let result = await service3('Service_3', '');
 
   res.status(200).send(result);
})



var server = app.listen(8081, function () {
   var port = server.address().port
   
   console.log("Welcome to the server. Running in port %s", port)
})