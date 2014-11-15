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


# Notes

This is based on great work from [debowerify][3] by [Eugene Ware][4]

[1]: http://browserify.org
[2]: http://socketstream.org
[3]: http://github.com/eugeneware/debrowserfiy
[4]: http://github.com/eugeneware
