
module.exports = function (request, record) {
	var deleteUrl = 'http://localhost:3000/api/objects/' + record.uid;
	var DELETE_test_description = 'Testing DELETE api/objects/:id response...';
	console.log('\x1b[33m%s\x1b[0m:', DELETE_test_description);

	request.del({url: deleteUrl}, function (err, res, body) {
		if (err) {
			throw err
			var fail = 'Testing DELETE api/objects/:id failed';
			console.log("\x1b[31m", fail);
			return;
		}

		if (body === '') {
			var pass = 'DELETE api/objects/:id passed.';
			console.log("\x1b[32m", pass); 
		} else {
			var fail = 'DELETE api/object/:id failed.';
			console.log("\x1b[31m", fail);
		}
		console.log("\x1b[0m", "All test finished.");
	})
}