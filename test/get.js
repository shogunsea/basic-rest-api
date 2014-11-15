
module.exports = function (request, callback) {
		request.get('http://localhost:3000/api/objects', function (err, res, body) {
		var getObjects = 'Testing GET: api/objects response...';
		console.log('\x1b[33m%s\x1b[0m:', getObjects);  
		if (err) {
			throw err;
			var fail = 'GET: api/objects failed.';
			console.log("\x1b[31m", fail);
			return;
		}

		var formatted = JSON.parse(body);
		if (Array.isArray(formatted)) {
			var pass = 'GET: api/objects passed.';
			console.log("\x1b[32m", pass); 

			var getObjectById = 'Testing GET: api/objects/:id response...';
			console.log('\x1b[33m%s\x1b[0m:', getObjectById);  
			var id = formatted[0].uid;

			request.get('http://localhost:3000/api/objects/' + id, function (err, res, responseOBJ) {
				if (err) {
					throw err;
					var fail = 'GET: api/objects/:id failed.';
					console.log("\x1b[31m", fail);
					return;
				}

				var apiResponse = JSON.parse(responseOBJ);

				if (apiResponse instanceof Object && apiResponse.hasOwnProperty('uid')) {
					var pass = 'GET: api/objects/:id passed.';
					console.log("\x1b[32m", pass); 
				} else {
					var fail = 'GET: api/objects/:id failed.';
					console.log("\x1b[31m", fail);
				}
				callback(request);
			})
		}
	});
};