var assert = require('assert');
var createClass = require('./');

// test "framework"
var testContext = []
function test (name, t) {
  testContext.push(name);
  var message = '"' + testContext.join(' -> ') + '"';
  try {
    t()
    console.log('ok', message);
  }
  catch (err) {
    console.log('not ok', message);
    console.error(err.stack);
  }
  finally {
    testContext.pop();
  }
}

test('Simplest possible class', function () {
  var Base = createClass({})

  var b = new Base;

  assert(b instanceof Base, 'instanceof');
});

test('Mixins & Inheritance', function () {
  var FooableMixin = {
    foo: 'foo',

    getFoo: function () {
      return this.foo;
    }
  };

  var FooableThing = createClass({
    include: [ FooableMixin ],
  });

  var f = new FooableThing();

  // Copies properties
  test('Mixed-in properties', function () {
    assert.equal(f.foo, 'foo');
    f.foo = 'bar';
    assert.equal(f.getFoo(), 'bar');
    assert.equal(FooableThing.prototype.foo, 'foo');
  });

  test('Inheritance', function () {
    var BazFoo = createClass({
      inherit: FooableThing,

      constructor: function BazFoo (baz, foo) {
        this.baz = baz;
        if (foo) this.foo = foo;
      },

      foobaz: function () {
        return this.foo + this.baz;
      }
    });

    var bf = new BazFoo('lol');

    assert(bf instanceof FooableThing);
    assert.equal(bf.foobaz(), 'foolol');

    // Alternate constructor
    var bf = new BazFoo('toast', 'cheese');
    assert.equal(bf.foobaz(), 'cheesetoast');
  });
});



test('Static Properties', function () {
  var Why = createClass({
    static: {
      doThis: function (blah) {
        return new this(blah);
      }
    },

    constructor: function Why (blah) {
      this.blah = blah;
    }
  });

  var w = Why.doThis('I don\'t know');

  assert.equal(w.blah, 'I don\'t know');
});

test('Descriptors', function () {
  var Person = createClass({
    constructor: function Person (first, last) {
      this.firstName = first;
      this.lastName = last;
    },

    fullName: {
      isDescriptor: true,
      get: function () {
        return this.firstName + ' ' + this.lastName;
      }
    }
  });


  var p = new Person('Stephen', 'Sugden');
  assert.equal(p.fullName, 'Stephen Sugden');
});


test('Function mixins', function () {
  function CanDance (Constructor) {
    Constructor.prototype.canDance = true;
    Constructor.prototype.dance = function () {
      return 'This ' + this.constructor.name + ' can dance';
    }
  }

  var Cat = createClass({
    include: [ CanDance ],
    constructor: function Cat() {}
  });

  var cat = new Cat();
  assert(cat.canDance);
  assert.equal(cat.dance(), 'This Cat can dance');
});
