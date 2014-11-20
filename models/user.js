
var mongoose = require('mongoose');

var schema = mongoose.Schema({
	firstname: { type: String },
	lastname: { type: String },
	dob: { type: String },
	dod: { type: String }
});

module.exports = mongoose.model('User', schema);
