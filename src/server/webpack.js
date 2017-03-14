var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack              = require("webpack");
var webpackConfig        = require('../../webpack.config.dev');
var compiler             = webpack(webpackConfig);

module.exports = function(app){
	var webpackDevMiddlewareObj = webpackDevMiddleware(compiler, {
		stats:{
			colors:true,
			hash:false,
			version:false,
			timings:true,
			assets:false,
			chunks:false,
			modules:false,
			reasons:false,
			children:false,
			source:false,
			errors:true,
			errorDetails:false,
			warnings:false,
			publicPath:false
		},
		noInfo:false,
		lazy:true
	});
	
	app.use(webpackDevMiddlewareObj);
	webpackDevMiddlewareObj.waitUntilValid(function(){
		console.log('Package is in a valid state');
	});
};
