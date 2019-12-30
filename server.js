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
	
	ids = Object.keys(JSON.parse(fs.readFileSync('db/database.json'))['places']);

    var compiled = handlebars.compile(fs.readFileSync("html/templates/index.hbs").toString());
	var html = compiled({
		'navigation': fs.readFileSync("html/templates/navigation.hbs").toString(),
		'random': "place/" + ids[Math.floor(Math.random() * ids.length)]
	});
	response.send(html);
});

// Get Place
app.get(/\/place\/([a-zA-Z0-9_]*)(\/.*)?/, function(request, response) {
    console.log('REQUEST : Restaurant');
	
	let dbTab = JSON.parse(fs.readFileSync('db/database.json'));
	let dbPlaces = dbTab['places'];
	
	if (dbPlaces[request.params[0]] == undefined) {
		response.sendFile(__dirname + '/html/error.html');
		return;
	}
	var place = dbPlaces[request.params[0]];
	
	if (request.params[1] == '/menu') {
		
		var compiledMenu = handlebars.compile(fs.readFileSync("html/templates/menu.hbs").toString());

		var menuList = [];

		if (place['menu'] != undefined) {
			for (let el of place['menu']) {
				menuList.push({
					'name': el['name'],
					'price': el['price'],
					'info': el['info'] == undefined ? "" : el['info']
				});
			}
		}
		
		var html = compiledMenu({
			'name': place['name'],
			'menu_list': menuList
		});
	
		response.send(html);

		return;
	}
    
	var compiled = handlebars.compile(fs.readFileSync("html/templates/place.hbs").toString());
	
	var html = compiled({
		'name': place['name'],
		'id': request.params[0]
	});

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