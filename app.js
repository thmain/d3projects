/**
 * Module dependencies.
 */

//Global variables : Since they are not declared using the var keyword
var express = require('express'),
	ROOT_DIR = __dirname,
	http = require('http'),
	path = require('path'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	app = express();

// all environments
app.set('port', process.env.port || 3000);
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(ROOT_DIR + '/public'));


//This allows you to require files relative to the root http://goo.gl/5RkiMR
requireFromRoot = (function(root) {
    return function(resource) {
        return require(root+"/"+resource);
    }
})(ROOT_DIR);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});