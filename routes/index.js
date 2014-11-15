// will load ../middleware/index.js by default
var middleWare = require('../middleware'),
	User = require('../models/user'),
	// for parsing BSON typed mongodb document object id.
	ObjectID = require('mongodb').ObjectID;

module.exports = function(app) {
	// pass through middleware first: parse form params
	middleWare(app);
	// redirect to POST request page as index
	app.get('/', function (req, res) {
		return res.redirect('/post');
	})

	function handler(req, res) {
	    var POST = {};
	    if (req.method == 'POST') {
	    	console.log('inside handler');
	    	debugger
	        req.on('data', function(data) {
	            data = data.toString();
	            data = data.split('&');
	            for (var i = 0; i < data.length; i++) {
	                var _data = data[i].split("=");
	                POST[_data[0]] = _data[1];
	            }
	            // console.log(POST);
	            
	        });

	    }
	    return POST;
	};

	function parse (req) {
		var util  = require('util');
		var formidable = require('formidable');
		var res = {};
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			debugger
			res = {fields: fields, files: files};
		})

		debugger

		return res;

	};

	app.get('/post', function (req, res) {
		console.log(new Date().toISOString() + ' Got request from ' + req.connection.remoteAddress);
		return res.render('post.jade');
	});

	app.post('/api/objects', function (req, res, next) {
		// var aa = handler(req,res);
		// var bb = parse(req);
		debugger
		var intValidation = JSON.stringify(req.body) === '{}';
		// will be parsed as: string as key, empty string as its
		var keys = Object.keys(req.body);
		var stringValidation = keys.length === 1 && req.body[keys[0]] === '';
		// will be parsed as: 'undefined' as key, array elemnt as its values.
		var arrayValidation = req.body.hasOwnProperty('undefined');
		if (intValidation || stringValidation || arrayValidation) {
			var invalid = {
				"verb": "POST",
   				"url": "api/objects/",
   				"message": "Not a JSON object"
			};
			return res.status(400).send(invalid);
		}
		// create the object
		var firstname = req.param('firstname');
		var lastname = req.param('lastname');
		var dob = req.param('dob');
		var user = { firstname: firstname, lastname: lastname, dob: dob };

	 	User.create(user, function (err, newUser) {
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
              return invalid();
            } 
            return next(err);
          }
          // user created successfully
          console.log('created user: %s', firstname + ' ' + lastname);
          // pack mongoDB response data into api response.
          var ObjectID = require('mongodb').ObjectID,
          	  userObj = newUser._doc,
          	  apiRes = {};

          apiRes.uid = ObjectID(userObj._id.id).toString();
          apiRes.firstname = userObj.firstname;
          apiRes.lastname = userObj.lastname;
          apiRes.dob = userObj.dob;

          return res.status(200).send(apiRes);
          return res.redirect('/');
        })
    });

	app.get('/get', function (req, res) {
		User.find().lean().exec(function (err, records) {
			if (err) {
				var invalid = {
					"verb": "GET",
   					"url": "api/objects/" + id,
   					"message": "Invalid id."
				};
				return res.status(400).send(invalid);
			}

			var apiResponse = parseMongoDoc(records);
			return res.render('get.jade', {records: apiResponse});
		})
	});

	app.get('/api/objects', function (req, res, next) {
		User.find().exec(function (err, records) {
			if (err) {
				return next(err);
			}
			var apiResponse = parseMongoDoc(records);
			return res.status(200).send(apiResponse);
		})
	});

	app.get('/api/objects/:id', function (req, res, next) {
		var id = req.param('id');
		User.findById(id, function (err, user) {
			debugger
			if (err) {
				var invalid = {
					"verb": "GET",
   					"url": "api/objects/" + id,
   					"message": "Invalid id."
				};
				return res.status(400).send(invalid);
			}
			var apiResponse = parseMongoDoc(user);
			return res.status(200).send(apiResponse);
		});
	});

	app.get('/put', function (req, res) {
		User.find().lean().exec(function (err, records) {
			if (err) {
				return next(err);
			}

			var apiResponse = parseMongoDoc(records);
			return res.render('put.jade', {records: apiResponse});
		})
	});

	app.get('/put/:id', function (req, res, next) {
		var id = req.param('id');
		User.findById(id, function (err, user) {
			if (err) {
				return next(err);
			}
			var apiResponse = parseMongoDoc(user);
			return res.render('put.jade', {edit: true, record: apiResponse});
			// return res.status(200).send(apiResponse);
		});
	})

	app.put('/api/objects/:id', function (req, res, next) {
		var id = req.param('id');
		var update = { $set: req.body };
		delete update.uid;

		// updateSchema(req.body);

		var options = { upsert: true };
		User.findByIdAndUpdate(id, update, options, function (err, user) {
			if (err) {
				return next(err);
			}
			// Build response
			var apiResponse = {};
			apiResponse.uid = id;
			for (var att in update.$set){
				apiResponse['' + att] = update.$set['' + att];
			}
			console.log('updated:' + apiResponse.firstname);

			return res.status(200).send(apiResponse);
		});
	});

	app.get('/delete', function (req, res) {
		User.find().lean().exec(function (err, records) {
			if (err) {
				return next(err);
			}

			var apiResponse = parseMongoDoc(records);
			return res.render('delete.jade', {records: apiResponse});
		})
	});

	app.delete('/api/objects/:id', function (req, res, next) {
		var id = req.param('id');
		var options = {};

		User.findByIdAndRemove(id, options, function (err, sig) {
			if (err) {
				return next(err);
			}
			
			return res.status(200).send();
		});
	});


	// function updateSchema (doc) {
	// 	var currentSchema = User.schema.paths;
	// 	var newAtt = {};
	// 	for (var att in doc) {
	// 		if (!currentSchema.hasOwnProperty(att)) {
	// 			newAtt['' + att] = 'String';
	// 		}
	// 	}
	// 	debugger
	// 	User.add(newAtt);
	// }

	

	function parseMongoDoc(doc) {
		if (Array.isArray(doc)) {
			// array of doc
			var formattedResponse = doc.map(function (item) {
				return parseSingleDoc(item);
			});
			return formattedResponse;
		} else {
			// // single object
   			return parseSingleDoc(doc);
		}
	};

	function parseSingleDoc(doc) {
		debugger
		var apiRes = {};
		apiRes.uid = ObjectID(doc._id.id).toString();
		// apiRes.uid = doc.id;
        apiRes.firstname = doc.firstname;
        apiRes.lastname = doc.lastname;
        apiRes.dob = doc.dob;
        apiRes.dod = doc.dod;
        return apiRes;
	};
}