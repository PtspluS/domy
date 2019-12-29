fs = require('fs');
path = require('path');

module.exports = {
	'navigation': fs.readFileSync(path.join( __dirname, "html/templates/navigation.hbs")).toString(),
};