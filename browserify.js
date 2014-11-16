var essentialTransform = require('./lib/essentialTransform');

/**
 * Default transform implementation for configuring as a string
 */
module.exports = essentialTransform();

/**
 * Allow customisation
 */
module.exports.custom = essentialTransform;
