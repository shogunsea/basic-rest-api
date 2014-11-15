var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	// will load ./routes/index.js by default
	routes = require('./routes');

mongoose.connect('mongodb://localhost/rest-api', function(err) {
	if (err) {
		throw err;
	}

	routes(app);

	app.listen(3000, function(){
		console.log('Listening on port 3000...');
	})

	console.log('Connected to MongoDB.');
})

