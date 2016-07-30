# js-partial-foreach

[![Recent Version][npm-badge]][npm-url]
[![Travis CI - Build Status][travis-badge]][travis-url]
[![Coveralls - Code Coverage Status][cov-badge]][cov-url]
[![David - Dependencies][dep-badge]][dep-url]
[![David - DevDependencies][dev-dep-badge]][dev-dep-url]
[![Gitter - Repository Chat][chat-badge]][chat-url]

## Synopsis

A [partial][partial-link] to provide a **better foreach capability** in [UMD][umd-link].
This foreach partial automagically detects whether the handler function expects **one or multiple arguments** 
similar to [PHP's foreach construct](http://php.net/manual/en/control-structures.foreach.php)
by **value** and **key => value** distinction.

Works with:
 - **compressed JavaScript code** too, 
 - also compatible with **ECMAScript 6 arrow functions**.

## Install

```
npm install js-partial-foreach
```

## Usage

First, initialize/include the partial, then use it.
The actual usage of the partial is the same across all environment.

## Usage - Initialize/Include

 - AMD (e.g.: RequireJS)
 
 ```javascript
    define(['js-partial-foreach'], function(foreach) {        
        // you can now use foreach
    });
 ```
 
 - CommonJS (e.g.: NodeJS)
 
 ```javascript
    var foreach = require('js-partial-foreach');
    
    // you can now use foreach
  ```
 
 - Browser
 
 ```javascript
    // load the source from "node_modules/js-partial-foreach/dist/js-partial-foreach.js" - for development
    // or from "node_modules/js-partial-foreach/dist/js-partial-foreach.min.js" - for production
 
    var foreach = js_partial_foreach; // it is available in the global namespace
    
    // you can now use foreach
  ```

## Usage - After Initialization

 - With arrays
 
 ```javascript
     var array = [1, 2, 3, 4, 5];
     
     foreach(
         array,
         function(value) {
             console.log(value); // 1 .. 5
         }
     );
     
     foreach(
         array,
         function(key, value) {
             console.log(key + ':' + value); // 0:1 .. 4:5
         }
     );
 ```
 
 - With object
 
 ```javascript
     // for objects
     var object = {
         a : 1,
         b : 2,
         c : 3,
         d : 4,
         e : 5
     };
     
     foreach(
         object,
         function(value) {
             console.log(value); // 1 .. 5
         }
     );
       
     foreach(
         object,
         function(key, value) {
             console.log(key + ':' + value); // a:1 .. e:5
         }
     );
 ```

 - With ES6 arrow functions
 
 ```javascript
    var array = [1, 2, 3, 4, 5];
    
    foreach(
        array,
        (value) => {
            console.log(value); // 1 .. 5
        }
    );
    
    foreach(
        array,
        (key, value) => {
            console.log(key + ':' + value); // 0:1 .. 4:5
        }
    );
 ```

 - With strings
 
 ```javascript
    var string = 'abcdefgh';
    
    foreach(
        string,
        function(char) {
            console.log(char); // 'a' .. 'h'
        }
    );
 ```

## Documentation

Check the source [here](https://github.com/jsopenstd/js-partial-foreach/blob/master/src/js-partial-foreach.js)
since it's very well documented.

## Issues

If you find any bugs and other issues, check the
[GSDC Guide - Issues](https://github.com/openstd/general-software-development-contribution-guide#issues)
section on how to submit issues in a standardized way on
[the project's issues page](https://github.com/jsopenstd/js-partial-foreach/issues).

In case you have any suggestions regarding the project (features, additional capabilities, etc.), check the
[GSDC Guide - Suggestions](https://github.com/openstd/general-software-development-contribution-guide#suggestions)
section on how to submit suggestions in an easy, standardized way on
[the project's issues page](https://github.com/jsopenstd/js-partial-foreach/issues).

## Contribution

In order to contribute to this project, check the
[GSDC Guide](https://github.com/openstd/general-software-development-contribution-guide)
for an easy, standardized way on how to contribute to projects.

## Support

If you **by any means** find this project useful,
[consider supporting the organization](https://github.com/jsopenstd/jsopenstd/blob/master/support.md).

There are multiple options to support the project and the developers.
Any means of support is beneficial and helpful.

## License

[MIT](license.md) @ Richard King

[npm-badge]:     https://img.shields.io/npm/v/js-partial-foreach.svg
[npm-url]:       https://www.npmjs.com/package/js-partial-foreach

[travis-badge]:  https://travis-ci.org/jsopenstd/js-partial-foreach.svg?branch=master
[travis-url]:    https://travis-ci.org/jsopenstd/js-partial-foreach

[cov-badge]:     https://coveralls.io/repos/github/jsopenstd/js-partial-foreach/badge.svg?branch=master
[cov-url]:       https://coveralls.io/github/jsopenstd/js-partial-foreach

[dep-badge]:     https://david-dm.org/jsopenstd/js-partial-foreach.svg
[dep-url]:       https://david-dm.org/jsopenstd/js-partial-foreach

[dev-dep-badge]: https://david-dm.org/jsopenstd/js-partial-foreach/dev-status.svg
[dev-dep-url]:   https://david-dm.org/jsopenstd/js-partial-foreach#info=devDependencies

[chat-badge]:    https://badges.gitter.im/jsopenstd/js-partial-foreach.svg
[chat-url]:      https://gitter.im/jsopenstd/js-partial-foreach?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge

[partial-link]:  https://github.com/jsopenstd/jsopenstd/blob/master/readme.md#partial 
[umd-link]:      https://github.com/jsopenstd/jsopenstd/blob/master/readme.md#umd 
