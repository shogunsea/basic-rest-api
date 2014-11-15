
var DELETE_test = require('./delete.js');

module.exports = function (request, record) {
	var putUrl = 'http://localhost:3000/api/objects/' + record.uid;
	var Data = {
		firstname: 'Jonny',
		lastname: 'Spacey',
		dob: 'July 26 1959'
	}

	var PUT_test_description = 'Testing PUT api/objects/:id response...';
	console.log('\x1b[33m%s\x1b[0m:', PUT_test_description);

	request.put({url: putUrl, form : Data}, function (err, res, body) {
		if (err) {
			throw err
			var fail = 'Testing PUT api/objects/:id failed';
			console.log("\x1b[31m", fail);
			return;
		}

		var apiResponse = JSON.parse(body);
		var validData = true;

		for (var att in Data) {
			if (apiResponse['' + att] === Data['' + att]) {
				continue;
			} else {
				validData = false;
				break;
			}
		}

		if (apiResponse.hasOwnProperty('uid') && validData) {
			var pass = 'PUT api/objects/:id passed.';
			console.log("\x1b[32m", pass); 
		} else {
			var fail = 'PUT: api/object/:id failed.';
			console.log("\x1b[31m", fail);
		}
		DELETE_test(request, apiResponse);
	})
}