var through = require('through');
var path = require('path');
var falafel = require('falafel');

/**
 * Returns Essential Bundle Matcher function for a particular configuration
 * @param config (optional) object describing sources and whether bower should be supported.
 */
function essentialTransform(config) {
  var modules = require('./modulesResolver')(config);

  return function essentialBundleMatcher(file) {
    if (!/\.(js|c?jsx|(lit)?coffee(\.md)?|ls|ts)$/.test(file)) return through();

    var data = '';
    var tr = through(write, end);
    return tr;

    function write (buf) { data += buf; }
    function end () {
      modules.scan(next);

      function next() {
        var output;
        try { output = parse(); }
        catch (err) {
          tr.emit('error', new Error(
            err.toString().replace('Error: ', '') + ' (' + file + ')')
          );
        }

        finish(output);
      }
    }

    function finish (output) {
      tr.queue(String(output));
      tr.queue(null);
    }

    function parse () {
      var output = falafel(data, function (node) {
        if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'require') {
          var pth = node.arguments[0].value;
          if(!pth) return;

          var moduleName = getModuleName(pth);
          var moduleSubPath = getModuleSubPath(pth);

          var module = modules.get(moduleName);
          if (!module) return;

          if (module.missing) {
            throw new Error('could not resolve dependency ' + moduleName + 
              ' : bower returns the module as known but not found (did you forget to run bower install ?)');
          }
          
          var pkgMeta = module.pkgMeta;
          var requiredFilePath = moduleSubPath;

          if (!requiredFilePath){
            if (pkgMeta && pkgMeta.main) {
              requiredFilePath = Array.isArray(pkgMeta.main) ? pkgMeta.main.filter(function (file) { return /\.js$/.test(file); })[0] : pkgMeta.main;
            } else {
              // if 'main' wasn't specified by this component, let's try
              // guessing that the main file is moduleName.js
              requiredFilePath = moduleName + '.js';
            }
          }


          var fullModulePath = path.resolve(path.join(module.canonicalDir, requiredFilePath));
          var relativeRequiredFilePath = './' + path.relative(path.dirname(file), fullModulePath);
          node.arguments[0].update(JSON.stringify(relativeRequiredFilePath));
        }
      });

      function getModuleName(path){
        return path.split('/')[0]
      }

      function getModuleSubPath(path){
        var idx = path.indexOf('/')
        if (idx === -1) return null
        return path.substring(idx)
      }

      return output;
    }
  };
}

module.exports = essentialTransform;
