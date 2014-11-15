// Testing all types of API response here.
var request = require('request');

var GET_test = require('./get.js');
var POST_test = require('./post.js');


GET_test(request, POST_test);
// POST_test(request);