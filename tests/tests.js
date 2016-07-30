var assert  = require('assert'),
    vars    = require('./variables'),
    foreach = require(vars.path);

module.exports = {
    'foreach' : {
        'default cases' : function() {
            assert(foreach() === undefined);
        },

        'general cases' : {
            'object' : function() {
                var object = {
                    a : '1',
                    b : '2',
                    c : '3',
                    d : '4'
                };
                var arrayResult  = [];

                foreach(
                    object,
                    function(value) {
                        arrayResult.push(value);
                    }
                );

                assert.deepStrictEqual(['1', '2', '3', '4'], arrayResult);

                var objectResult = {};

                foreach(
                    object,
                    function(key, value) {
                        objectResult[key] = value;
                    }
                );

                assert.deepStrictEqual(object, objectResult);
            },
            'array' : function() {
                var array  = [1, 2, 3, 4, 5, true, false, null, undefined, 'string'];
                var result = [];

                foreach(
                    array,
                    function(value) {
                        result.push(value);
                    }
                );

                assert.deepStrictEqual(array, result);

                var intKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                result = [];

                foreach(
                    array,
                    function(key, value) {
                        result.push(key);
                    }
                );

                assert.deepStrictEqual(intKeys, result);
            },
            'return false' : function() {
                var index = 0;

                foreach(
                    [1, 2, 3],
                    function(value) {
                        index++;
                        return false;
                    }
                );

                assert(index === 1);
            }
        },

        'extended cases' : {
            'string' : function() {
                var string = '12345';
                var result = '';

                foreach(
                    string,
                    function(value) {
                        result += value;
                    }
                );

                assert(string === result);
            },
            'checkArguments = false' : function() {
                var options = {
                    checkArguments : false
                };
                var object = {
                    a : '1',
                    b : '2',
                    c : '3',
                    d : '4'
                };
                var result = {};

                foreach(
                    object,
                    function(key, value) {
                        result[key] = value;
                    },
                    options
                );

                assert.deepStrictEqual(object, result);
            },
            'checkOwnProperty' : function() {
                var optionWith = {
                    checkOwnProperty : true
                };

                var optionWithout = {
                    checkOwnProperty : false
                };

                function Base() {}

                Base.prototype = {
                    constructor : Base,
                    baseFn : function() {},
                    baseProp : 1
                };

                function Child() {
                    this.childFn = function() {};
                    this.childProp = 2;
                }

                Child.prototype = Object.create(Base.prototype);
                Child.prototype.constructor = Child;

                var child = new Child();

                var resultWith = [];

                foreach(
                    child,
                    function(key, value) {
                        resultWith.push(key);
                    },
                    optionWith
                );

                assert(resultWith.length === 2);

                var resultWithout = [];

                foreach(
                    child,
                    function(key, value) {
                        resultWithout.push(key);
                    },
                    optionWithout
                );

                assert(resultWithout.length > 2);
            },
            'castArrayIndex = false' : function() {
                var options = {
                    castArrayIndex : false
                };
                var array = [1, 2, 3, 4, 5];
                var expected = ['0', '1', '2', '3', '4'];
                var result = [];

                foreach(
                    array,
                    function(key, value) {
                        result.push(key);
                    },
                    options
                );

                assert.deepStrictEqual(result, expected);
            },
            'ES6 arrow functions' : function() {
                var array = [1, 2, 3, 4, 5];
                var result = [];

                foreach(
                    array,
                    (value) => {
                        result.push(value);
                    }
                );

                assert.deepStrictEqual(result, array);

                var expected = {
                    0 : 1,
                    1 : 2,
                    2 : 3,
                    3 : 4,
                    4 : 5
                };
                var objectResult = {};

                foreach(
                    array,
                    (key, value) => {
                        objectResult[key] = value;
                    }
                );

                assert.deepStrictEqual(objectResult, expected);
            },
            'set global config options' : function() {
                foreach.setOptions({
                    checkArguments : true,
                    checkOwnProperty : true,
                    castArrayIndex : true
                });

                assert(foreach.getOptions().checkArguments === true);
                assert(foreach.getOptions().checkOwnProperty === true);
                assert(foreach.getOptions().castArrayIndex === true);

                // leave unchanged
                foreach.setOptions({});

                assert(foreach.getOptions().checkArguments === true);
                assert(foreach.getOptions().checkOwnProperty === true);
                assert(foreach.getOptions().castArrayIndex === true);

                foreach.setOptions({
                    checkArguments : false,
                    checkOwnProperty : false,
                    castArrayIndex : false
                });

                assert(foreach.getOptions().checkArguments === false);
                assert(foreach.getOptions().checkOwnProperty === false);
                assert(foreach.getOptions().castArrayIndex === false);

                foreach.setOptions({
                    checkArguments : true,
                    checkOwnProperty : true,
                    castArrayIndex : true
                });

                assert(foreach.getOptions().checkArguments === true);
                assert(foreach.getOptions().checkOwnProperty === true);
                assert(foreach.getOptions().castArrayIndex === true);
            }
        },

        'edge cases' : function() {
            assert(
                foreach(
                    [1, 2, 3],
                    null
                )

                === undefined
            );
        }
    }
};
