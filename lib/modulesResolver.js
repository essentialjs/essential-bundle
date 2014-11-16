var bower = require('bower');

function scan(next) {
  if (this.scanned) {
    next();
  } else {
    var modules = this;
    bower.commands.list({}, {offline: true})
      .on('end', function (map) {
        modules.setBowerMap(map);
        next();
      });
  }
}

function setBowerMap(map) {
  this.map = map;
  console.info('Loaded bower modules',map);
}

/**
 * @param {Object} module As provided by Bower
 * @returns {Object} A dictionary of the module dependencies
 */
function getModuleDependencies (module) {
  return ['dependencies', 'devDependencies'].reduce(function(dependencies, property) {
    for (var name in module[property]) dependencies[name] = module[property][name];
    return dependencies;
  }, {});
};


/**
 * @param {string} name
 * @param {Object} [parent] The parent module, as provided by Bower
 * @returns {Object|null} The module as provided by Bower or null if not found
 */
function getModule (name, parent) {
  parent = parent || this.map;
  var dependencies = getModuleDependencies(parent);
  for (var dependencyName in dependencies) {
    var module = dependencies[name] || getModule(name, dependencies[dependencyName]);
    if (module) return module;
  }
};


// resolve modules for config
module.exports = function(config) {
  config = config || { sources: ["."] };
  var useBower = config.bower===undefined? config.useBower : config.bower;

  return {
    "sources": config.sources || [],
    "useBower": useBower !== false,
    "config": config,
    "scan": scan,
    "setBowerMap": setBowerMap,
    "get": getModule
  };
};

