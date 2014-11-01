# create-class

A simple approach to creating classes, support mixins, static methods,
inheritance and property descriptors.

## API

### `module.exports = createClass(description) -> Constructor`

Create a constructor function where all properties of `description` will be
copied to the prototype of the constructor. For example:

```javascript
var assert = require('assert');

var Foot = createClass({
  numberOfToes: 5,
  tickle: function () {
    console.log('stop that!');
  }
});

var f = new Foot();

assert.equal(5, f.numberOfToes);

f.tickle(); //=> 'stop that!'
```

## Prototype Properties

Each property of the class definition that isn't [special name](#special-properties) or a descriptor will be (shallow) copied to the prototype of the returned constructor. Descriptors are detected by checking if the property value is an object with a truthy `isDescriptor` property. For example this is how one could define a getter:

```javascript
var Rect = createClass({
  constructor: function (width, height) {
    this.width = width;
    this.height = height;
  },

  area: {
    isDescriptor: true,
    get: function () { return this.width * this.height }
  }
});
```

The `constructor` property is special, and described further in the next section.

## Special Properties

There are 4 special property names: `constructor` defines the constructor function that will be modified & returned, `static` defines properties that should be copied to the constructor function instead of it's prototype, `include` extends the constructor or it's prototype with an array of mixins, and `inherit` defines a parent class/constructor that this one should inherit from. All other property names are copied to the constructor prototype as described in [prototype properties](#prototype-properties)

### `constructor`

The value of `constructor` should be a function that takes arguments and initializes `this`. Note that **the constructor will be mutated**, this isn't a problem for most classes where the constructor is written inline with the definition, but keep in mind that re-using the constructor function across multiple classes will have unexpected results.

### `static`

The value of `static` should be an object whose properties you want to be copied onto the constructor function for the class. An example might be having a shared instance of a particular class:

```javascript
var Pool = createClass({
  static: {
    defaultConfig: { host: 'localhost' }
    sharedInstance: null,
    getSharedInstance: function () {
      if (!this.sharedInstance) {
        this.sharedInstance = new this(this.defaultConfig);
      }
      return this.sharedInstance;
    },
  },

  constructor: function (config) {
    // 
  }
});

// elsewhere in your program:
var pool = Pool.getSharedInstance()
```

### `include`

The value of `include` should be an array of mixins that you will augment this class. Two types of mixins are accepted: objects or functions. Function mixins are called with the constructor function for the class as their sole argument. The mixin function is then free to augment & modify the constructor (or it's prototype) however it sees fit:

```javascript
var Foo = createClass({
  include: [
    function (Constructor) {
      Constructor.hello = 'world';
    }
  ]
});

assert.equal(Foo.hello, 'world');
```

The second type of mixin is an object, which will be treated exactly like a new class definition, except that the `constructor` property (if present) will be ignored.

### `inherit`

The value if `inherit` should be another class/constructor function that you would like to serve as the prototype of this one. The inheritance will be set up using [`inherits`](https://npm.im/inherits). The super/parent class will be accessible via the `super_` property of the constructor: 

```javascript
var Readable = require('streams').Readable;

var HelloStream = createClass({
  inherit: Readable,
  _read: function () {
    this.push('hello\n');
  }
});

var hellos = new HelloStream();
assert(hellos instanceof Readable);
```

## License

MIT
