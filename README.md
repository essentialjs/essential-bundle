# essential-bundles

Transform resources in your Web Component into a deliverable bundle. Use `names.json`, `bower.json` or `package.json` to define where your resources and assets are. Identify JS, CSS, images, fonts, views and templates.

With [Browserify][1] and [SocketStream][2] can access your bundle and serve it to the browser.

You can use modules of your own in combination with some added using [bower](https://bower.io). 

[![build status](https://secure.travis-ci.org/essentialjs/essential-bundle.png)](http://travis-ci.org/essentialjs/essential-bundle)

## Installation

Installation is via npm:

```
$ npm install essential-bundle
```

## How to use.

By default directories in your project are supported as modules. So you can add,

```
users
+ js/
+ images/
+ fonts/
+ css/
+ views/
+ templates/
+ users.js
+ names.json
```

Your `users.js` file would require the submodules inside `js/`.

``` users.js
var uuid = require('uuid');
exports.account = require('./js/account');
exports.profile = require('./js/profile');
```

Make sure you fill in `main` in `names.json` (or `bower.json`/`package.json`) to be `users.js`.

Add a where section to `names.json`.

``` names.json
{
	"name":"users",
	"main":"users.js",
	"where": {
		"js": "js/**/*.js",
		"css": "css/**/*.less",
		"views": "views/**/*.html",
		"templates": "templates/**/*.html",
		"assets": ["fonts","images"]
	}
}
```

In your application you can pull in the `users` code with `require("users")`. It will resolve to a module with a combination of js, views, templates.

## Gulp

The simplest way to use this in Gulp is with the browserify like call.

```
var gulpBundler = require('essential-bundle').gulp;
gulpBundler({
	outputName: 'body.js',
	entries: ['./client/code/site/body.js'], // must start with dot to be relative to cwd
	debug: true // source maps
	})
    .pipe(gulp.dest(destDir));
```

## Browserify

```
browserify({
  transforms: ['essential-bundle/browserify-transform']
});
```

```
var essentialTransform = require('essential-bundle').browserifyTransform({
	sources: ['app','common']
});
browserify({
  transforms: [essentialTransform]
});
```

## Grunt Browserify

TODO

## Socketstream

TODO

# Notes

This is based on great work from [debowerify][3] by [Eugene Ware][4]

[1]: http://browserify.org "Browserify"
[2]: http://socketstream.org "Socketstream"
[3]: http://github.com/eugeneware/debowerify "debowerify"
[4]: http://github.com/eugeneware "Eugene Ware"
