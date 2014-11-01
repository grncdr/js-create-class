'use strict';
var inherits = require('inherits');
var applyMixin = require('./apply-mixin');

module.exports = function createClass (definition) {
  var Constructor = definition.constructor || function AnonymousConstructor () {
    this.constructor.super_ && this.constructor.super_.apply(this, arguments);
  };

  if (definition.inherit) {
    inherits(Constructor, definition.inherit);
  }

  applyMixin(Constructor, definition);

  // Probably not going to need this but it could be handy for use with call/apply
  // Hopefully nobody wants more than 8 constructor arguments.
  if (!Constructor.new) {
    Constructor.new = function (a, b, c, d, e, f, g, h) {
      switch (arguments.length) {
      case 0:
        return new Constructor();
      case 1:
        return new Constructor(a);
      case 2:
        return new Constructor(a, b);
      case 3:
        return new Constructor(a, b, c);
      case 4:
        return new Constructor(a, b, c, d);
      case 5:
        return new Constructor(a, b, c, d, e);
      case 6:
        return new Constructor(a, b, c, d, e, f);
      case 7:
        return new Constructor(a, b, c, d, e, f, g);
      case 8:
        return new Constructor(a, b, c, d, e, f, g, h);
      }
    };
  }

  return Constructor;
};
