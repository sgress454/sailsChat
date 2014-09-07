/**
 * Configure advanced options for the Express server inside of Sails.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */
module.exports.http = {


};





/**
 * HTTP Flat-File Cache
 * 
 * These settings are for Express' static middleware- the part that serves
 * flat-files like images, css, client-side templates, favicons, etc.
 *
 * In Sails, this affects the files in your app's `assets` directory.
 * By default, Sails uses your project's Gruntfile to compile/copy those 
 * assets to `.tmp/public`, where they're accessible to Express.
 *
 * The HTTP static cache is only active in a 'production' environment, 
 * since that's the only time Express will cache flat-files.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */
module.exports.cache = {

	// The number of seconds to cache files being served from disk
	// (only works in production mode)
	maxAge: 31557600000
};
