var express = require('express');
var http = require('http');
var url = require('url');
var fs = require('fs');
var handlebars = require('handlebars');

var contexts = require('./contexts.js');

// SERVER
var app = express();

// Get Index
app.get('/', function(request, response) {
    console.log('REQUEST : Index');
    
    var compiled = handlebars.compile(fs.readFileSync("html/templates/index.hbs").toString());
	var html = compiled(contexts);
	response.send(html);
});

// Get Scripts
app.get(/\/scripts\/([a-z0-9_]*\.js)/, function(request, response) {
	response.set('Content-Type', 'text/javascript');
	response.send(fs.readFileSync('scripts/' + request.params[0]));
});

// Get Styles
app.get(/\/styles\/([a-z0-9_]*\.css)/, function(request, response) {
	response.set('Content-Type', 'text/css');
	response.send(fs.readFileSync('styles/' + request.params[0]));
});

// 404
app.get(/(.*)/, function(request, response){
	response.sendFile(__dirname + '/html/error.html');
});

var httpServer = http.createServer(app);

httpServer.listen(8080);