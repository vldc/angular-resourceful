angular-resourceful
===================

[![Build Status](https://travis-ci.org/vldc/angular-resourceful.png?branch=master)](https://travis-ci.org/vldc/angular-resourceful)

Description
-----------
Angular Resourceful is a simple wrapper for the [$resource](http://docs.angularjs.org/api/ngResource.$resource). It adds some methods (PUT) which are not included standard $resourceful and allows working with arrays of primitives (fetch and update methods).

Installation
------------
All you need to do is to inject $resourceful and you're set to go. If you're already using $resource it's as easy as adding "ful" ;)

Standard Usage
--------------
Most of the time: identically as with original $resource:
```javascript
    $resourceful(url[, paramDefaults][, actions]);
```

E.g.
```javascript
    var User = $resourceful('/endpoint/action/:userId', {userId: '@userId'});
    var user = User.get({userId: 12345});
    // do some crazy stuff with data

    user.$put();
```

Additional methods
------------------
Although by default you don't need to set anything, you might probably want that when using fetch and update methods. They work by wrapping response (array of primitives) into an object. You may set a name of the wrapper key using .dataKey() method. You may also want to signal that it should be done only once by using .setOnce() method. There's also a convienience .run() method which simply calls for $resourceful -- it's there for the chaining lovers ;).

Example:
```javascript
    var Users = $resourceful
        .setOnce()
        .dataKey('users')
        .run('/group/:groupId');
    var users = Users.fetch({groupId: 12345});
    // do some crazy stuff with data

    users.$update();
```