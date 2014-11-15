
var mongoose = require('mongoose');
	// Schema = mongoose.Schema;

// var User = new Schema( {
// 	any: {}
// });

var schema = mongoose.Schema({
	firstname: { type: String },
	lastname: { type: String },
	dob: { type: String },
	dod: { type: String }
});

// var Any = new Schema({ any: {} });
// var Any = new Schema({ any: Schema.Types.Mixed });


module.exports = mongoose.model('User', schema);
// module.exports = mongoose.model('User', User);
