var PUT_test = require('./put.js');

module.exports =  function (request) {
		var postUrl = 'http://localhost:3000/api/objects';
		var Data = {
			firstname: 'Kevin',
			lastname: 'Spacey',
			dob: 'July 26 1959'
		}
		request.post({url: postUrl, form: Data}, function (err, res, body) {
			var POST_test_description = 'Testing POST: api/objects response...';
			console.log('\x1b[33m%s\x1b[0m:', POST_test_description);
			if (err) {
				throw err;
				var fail = 'POST: api/objects failed.';
				console.log("\x1b[31m", fail);
				return;
			}

			var apiResponse = JSON.parse(body);
			var validJSON = true;
			debugger
			for (var attr in Data) {
				if (Data['' + attr] == apiResponse['' + attr]) {
					continue;
				} else {
					validJSON = false;
					break;
				}
			}

			if (apiResponse.hasOwnProperty('uid') && validJSON) {
				var pass = 'POST api/objects passed.';
				console.log("\x1b[32m", pass); 
			} else {
				var fail = 'POST: api/objects failed.';
				console.log("\x1b[31m", fail);
			}

			PUT_test(request, apiResponse);
		} )
	};