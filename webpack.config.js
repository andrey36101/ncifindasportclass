'use strict';
var webpack           = require('webpack');
var autoprefixer      = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path              = require('path');

//Getting which environment user initiated the command
var ENVIRONMENT = process.env.NODE_ENV;
var isTestMode= ENVIRONMENT==='test';

module.exports = function makeWebpackConfig(){
	/**
	 * Config
	 * Reference: http://webpack.github.io/docs/configuration.html
	 * This is the object where all configuration gets set
	 */
	var config = {};

	/**
	 * Entry
	 * Reference: http://webpack.github.io/docs/configuration.html#entry
	 * Should be an empty object if it's generating a test build
	 * Karma will set this when it's a test build
	 */
	config.entry = isTestMode ? {} : {
		webapp:['./src/app/main.js']
	};

	/**
	 * Output
	 * Reference: http://webpack.github.io/docs/configuration.html#output
	 * Should be an empty object if it's generating a test build
	 * Karma will handle setting it up for you when it's a test build
	 */
	config.output = isTestMode ? {} : {
		// Absolute output directory
		path:__dirname + '/build',
		// Output path from the view of the page
		// Uses webpack-dev-server in development
		publicPath:'/',
		// Filename for entry points
		// Only adds hash in build mode
		filename: '[name].bundle.js',//isBuildMode ? '[name].[hash].js' : '[name].bundle.js',
		// Filename for non-entry points
		// Only adds hash in build mode
		chunkFilename:'[name].bundle.js'
	};

	/**
	 * Devtool
	 * Reference: http://webpack.github.io/docs/configuration.html#devtool
	 * Type of sourcemap to use per build type
	 */
	if(isTestMode){
		config.devtool = 'inline-source-map';
	} else if(ENVIRONMENT !== 'production'){
		config.devtool = 'source-map';
	}
	
	/**
	 * Loaders
	 * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
	 * List: http://webpack.github.io/docs/list-of-loaders.html
	 * This handles most of the magic responsible for converting modules
	 */

	// Initialize module
	config.module = {
		preLoaders:[],
		loaders:[
			{
				test:/\.js$/,
				loaders:['ng-annotate','babel?compact=false','required?import[]=angular'],
				exclude:/node_modules/
			},  {
				test:/\.less$/,
				loader:ExtractTextPlugin.extract('style','css-loader!less-loader')
			},{
				// CSS LOADER
				test:/\.css$/,
				loader:ExtractTextPlugin.extract('style','css-loader')
			}, {
				// ASSET LOADER
				// Reference: https://github.com/webpack/file-loader
				// Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
				// Rename the file using the asset hash
				// Pass along the updated reference to your code
				// You can add here any file extension you want to get copied to your output
				// test:/\.(png|jpg|jpeg|gif|svg|woff2|ttf|eot)$/,
				test:/\.(png|jpg|jpeg|gif|tif|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
				loader:'file'
			}, {
				// HTML LOADER
				// Reference: https://github.com/webpack/raw-loader
				// Allow loading html through js
				test:/\.html$/,
				loader:'raw'
			}, {
				test:/\.json$/,
				loader:'json'
			}]
	};

	// ISPARTA LOADER
	// Reference: https://github.com/ColCh/isparta-instrumenter-loader
	// Instrument JS files with Isparta for subsequent code coverage reporting
	// Skips node_modules and files that end with .test.js
	if(isTestMode){
		config.module.preLoaders.push({
			test:/\.js$/,
			exclude:[
				/node_modules/,
				/\.spec\.js$/
			],
			loader:'isparta-instrumenter'
		});
	}

	/**
	 * Plugins
	 * Reference: http://webpack.github.io/docs/configuration.html#plugins
	 * List: http://webpack.github.io/docs/list-of-plugins.html
	 */
	config.plugins = [];

	/*
	 Plugin to load the extracted CSS/Less text in to seperate file
	 */
	config.plugins.push(new ExtractTextPlugin('[name].css'));

	config.plugins.push(new webpack.ProvidePlugin({
		$:'jquery',
		jQuery:'jquery',
		'window.jQuery':'jquery'
	}));

	// Skip rendering index.html in test mode
	if(!isTestMode){
		// Reference: https://github.com/ampedandwired/html-webpack-plugin
		// Render index.html
		config.plugins.push(
			new HtmlWebpackPlugin({
				template:'./src/public/index.html',
				filename:'./index.html',
				inject:false
			}),
			// Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
			// Only emit files when there are no errors
			new webpack.NoErrorsPlugin(),
			// Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
			// Dedupe modules in the output
			new webpack.optimize.DedupePlugin(),
			// Copy assets from the public folder
			// Reference: https://github.com/kevlened/copy-webpack-plugin
			new CopyWebpackPlugin([{
				from:__dirname + '/src/public'
			}])
		);
	}

	if(ENVIRONMENT==='production'){
		config.plugins.push(
			// Reference: http://webls
			// pack.github.io/docs/list-of-plugins.html#uglifyjsplugin
			// Minify all javascript, switch loaders to minimizing mode
			new webpack.optimize.UglifyJsPlugin()
		);
	}
	return config;
}();