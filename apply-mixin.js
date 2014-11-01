'use strict';

module.exports = function applyMixin (Constructor, mixin) {
  var skipPropertyIteration = false;
  var type = typeof mixin;

  if (type === 'function') {
    mixin(Constructor);
    skipPropertyIteration = true;
  }
  else if (type !== 'object') {
    throw new TypeError(typeof mixin + 's are not mixins');
  }

  if (mixin.static) {
    for (var key in mixin.static) {
      setProperty(Constructor, key, mixin.static[key]);
    }
  }

  if (mixin.include) {
    mixin.include.forEach(function (mixin) { applyMixin(Constructor, mixin); });
  }

  if (skipPropertyIteration) {
    return;
  }

  for (var k in mixin) {
    switch (k) {
      // skip over special properties
      case 'constructor':
      case 'static':
      case 'include':
      case 'inherit':
        break;
      default:
        setProperty(Constructor.prototype, k, mixin[k]);
    }
  }
}

function setProperty (target, name, value) {
  if (typeof value === 'object' && value.isDescriptor) {
    Object.defineProperty(target, name, value);
  } else {
    target[name] = value;
  }
}
