var express = require('express');
var http = require('http');
var url = require('url');
var fs = require('fs');
var handlebars = require('handlebars');

// SERVER
var app = express();

// Get Index
app.get('/', function(request, response) {
    console.log('REQUEST : Index');
	
	ids = Object.keys(JSON.parse(fs.readFileSync('db/database.json'))['places']);

    var compiledBloc = handlebars.compile(fs.readFileSync("html/templates/bloc_index.hbs").toString());
	var htmlBloc = compiledBloc({
		'random': "place/" + ids[Math.floor(Math.random() * ids.length)]
	});

    var compiledMain = handlebars.compile(fs.readFileSync("html/templates/index.hbs").toString());
	var htmlMain = compiledMain({
		'main_bloc': htmlBloc
	});

	response.send(htmlMain);
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
		
		var compiledContent = handlebars.compile(fs.readFileSync("html/templates/bloc_place_menu.hbs").toString());

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
		
		var htmlContent = compiledContent({
			'name': place['name'],
			'menu_list': menuList
		});
    
		var compiledBloc = handlebars.compile(fs.readFileSync("html/templates/bloc_place.hbs").toString());
		var htmlBloc = compiledBloc({
			'name': place['name'],
			'id': request.params[0],
			'place_content_bloc': htmlContent
		});

		var compiledMain = handlebars.compile(fs.readFileSync("html/templates/index.hbs").toString());
		var htmlMain = compiledMain({
			'styles': ['place.css', 'place_menu.css'],
			'main_bloc': htmlBloc
		});
	
		response.send(htmlMain);
		return;
	}

	// Else, basic welcome
	var compiledContent = handlebars.compile(fs.readFileSync("html/templates/bloc_place_welcome.hbs").toString());
	var htmlContent = compiledContent({
		'name': place['name']
	});
    
	var compiledBloc = handlebars.compile(fs.readFileSync("html/templates/bloc_place.hbs").toString());
	var htmlBloc = compiledBloc({
		'name': place['name'],
		'id': request.params[0],
		'place_content_bloc': htmlContent
	});

    var compiledMain = handlebars.compile(fs.readFileSync("html/templates/index.hbs").toString());
	var htmlMain = compiledMain({
		'styles': ['place.css'],
		'main_bloc': htmlBloc
	});

	response.send(htmlMain);
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
console.log("Server on");