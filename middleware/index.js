var bodyParser = require('body-parser'),
	express = require('express'),
	path = require('path');

module.exports = function(app) {
	// parse the form content for us to use.
	app.use(bodyParser.urlencoded({
		extended: false
	}));
	app.use(express.static(path.join(__dirname, '../public')));
}