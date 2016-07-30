/**
 * @overview A partial to provide a better foreach capability similar to PHP's foreach construct
 *           by differentiating whether the callback function expects a value or a pair of key=>value.
 *
 * @module js/partial/foreach
 * @type {function}
 *
 * @version 1.0.3
 *
 * @author Richard King <richrdkng@gmail.com> [GitHub]{@link https://github.com/richrdkng}
 * @license [MIT]{@link https://github.com/jsopenstd/js-partial-foreach/blob/master/license.md}
 */

/**
 * UMD - [returnExports.js pattern]{@link https://github.com/umdjs/umd/blob/master/templates/returnExports.js}
 * For more information and license, check the link below:
 * [UMD GitHub Repository]{@link https://github.com/umdjs/umd}
 */
(function(root, factory) {
    // AMD
    /* istanbul ignore next: ignore coverage test for UMD */
    if (typeof define === 'function' && define.amd) {
        define([], factory);

    // CommonJS
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();

    // Browser
    } else {
        root.js_partial_foreach = factory();
    }
}(this, function() {
    'use strict';

    // Constants

        /**
         * One detected callback argument in the callback function.
         *
         * @private
         * @const
         * @type {number}
         */
    var ONE_ARGUMENT = 1,

        /**
         * Two detected callback arguments in the callback function.
         *
         * @private
         * @const
         * @type {number}
         */
        TWO_ARGUMENTS = 2,

        /**
         * The RegExp pattern to detect whether the callback function has two arguments.
         *
         * @private
         * @const
         * @type {RegExp}
         */
        ARGUMENT_CHECK_PATTERN = /\(.*,.*\)/,

    // Config options

        /**
         * @typedef {Object}
         *
         * @static
         * @memberOf js/partial/foreach
         *
         * @property {boolean} [checkArguments=true] -
         *
         * Determines whether "foreach" should check the number of arguments in the callback function.
         * If it is enabled and:
         *   - when the callback function has one argument, "foreach" will
         *     pass one argument to the callback function, which will contain
         *     the actual **value** of the container object.
         *
         *   - when the callback function has two arguments, "foreach" will
         *     pass two arguments to the callback function, the first will be
         *     the actual **key**, the second will be the
         *     actual **value** of the container object.
         *
         * If it is disabled, always two arguments will be passed to the
         * callback function, the first will be the actual **key**,
         * the second will be the actual **value** of the container object.
         *
         * @property {boolean} [checkOwnProperty=true] -
         *
         * Determines whether "foreach" should check whether the container has
         * the current key as an own property via containerObject.hasOwnProperty(key).
         *
         * If it is enabled, only those key => value pairs will be passed to the callback function,
         * which are own properties of the container object.
         *
         * If it is disabled, every key => value of the container object will be passed to the callback function.
         *
         * @property {boolean} [castArrayIndex=true] -
         *
         * Determines whether "foreach" should cast the indices of the array-like container object
         * to integers (in {number}).
         *
         * If it is enabled, when and **only when** two arguments (key => value) will be passed to
         * the callback function, the first argument (key) will be cast to an integer (in {number}).
         *
         * If it is disabled, no change and/or cast will occur on the first (key) argument.
         */
        config = {
            checkArguments   : true,
            checkOwnProperty : true,
            castArrayIndex   : true
        },

        /**
         * Determines whether "foreach" should check the number of arguments in the callback function.
         *
         * If it is enabled and:
         *     - when the callback function has one argument, "foreach" will pass one argument to the
         *       callback function, which will contain the actual **value** of the container object.
         *     - when the callback function has two arguments, "foreach" will pass two arguments to the
         *       callback function, the first will be the actual **key**,
         *       the second will be the actual **value** of the container object.
         *
         * If it is disabled, always two arguments will be passed to the callback function,
         * the first will be the actual **key**, the second will be the actual **value** of the container object.
         *
         * @private
         * @type {boolean}
         * @default true
         */
        checkArguments = true,

        /**
         * Determines whether "foreach" should check whether the container has
         * the current key as an own property via containerObject.hasOwnProperty(key).
         *
         * If it is enabled, only those key => value pairs will be passed to the callback function,
         * which are own properties of the container object.
         *
         * If it is disabled, every key => value of the container object will be passed to the callback function.
         *
         * @private
         * @type {boolean}
         * @default true
         */
        checkOwnProperty = true,

        /**
         * Determines whether "foreach" should cast the indices of the array-like container object
         * to integers (in {number}).
         *
         * If it is enabled, when and **only when** two arguments (key => value) will be passed to
         * the callback function, the first argument (key) will be cast to an integer (in {number}).
         *
         * If it is disabled, no change and/or cast will occur on the first (key) argument.
         *
         * @private
         * @type {boolean}
         * @default true
         */
        castArrayIndex = true;

    /**
     * Processes the config options of the "foreach" partial.
     *
     * @private
     * @function processOptions
     * @memberOf js/partial/foreach
     *
     * @param {config}  [options]         The object, which contains the config options.
     * @param {boolean} [setGlobal=false] Whether the passed config options should change
     *                                    the global config options for "foreach".
     *
     * @returns {config} The valid, changeable config options with their actual, current value.
     */
    function processOptions(options, setGlobal) {
        var checkArgs = checkArguments,
            checkProp = checkOwnProperty,
            castIndex = castArrayIndex;

        if (options) {
            if (typeof options.checkArguments === 'boolean') {
                checkArgs = options.checkArguments;

                if (setGlobal) {
                    checkArguments = checkArgs;
                }
            }

            if (typeof options.checkOwnProperty === 'boolean') {
                checkProp = options.checkOwnProperty;

                if (setGlobal) {
                    checkOwnProperty = checkProp;
                }
            }

            if (typeof options.castArrayIndex === 'boolean') {
                castIndex = options.castArrayIndex;

                if (setGlobal) {
                    castArrayIndex = castIndex;
                }
            }
        }

        return {
            checkArguments   : checkArgs,
            checkOwnProperty : checkProp,
            castArrayIndex   : castIndex
        };
    }

    /**
     * Iterates through the given container object and passes the actual key or key=>value to the callback function.
     *
     * The "foreach" examines the callback function, whether it has one or two arguments and
     * depending of the number of arguments, a key or a pair of key=>value will be sent to the callback function.
     * The container object can be an array, object, string or any array-like object, which has .length property.
     *
     * @public
     * @function foreach
     *
     * @param {*}        object    The container object.
     * @param {function} callback  The callback function to receive key or key=>value arguments.
     * @param {config}   [options] The object, which contains the config options.
     *
     * @return {void}
     *
     * @example
     * // for arrays
     * var array = [1, 2, 3, 4, 5];
     *
     * foreach(
     *     array,
     *     function(value) {
     *         console.log(value); // 1 .. 5
     *     }
     * );
     *
     * foreach(
     *     array,
     *     function(key, value) {
     *         console.log(key + ':' + value); // 0:1 .. 4:5
     *     }
     * );
     *
     * @example
     * // for objects
     * var object = {
     *     a : 1,
     *     b : 2,
     *     c : 3,
     *     d : 4,
     *     e : 5
     * };
     *
     * foreach(
     *     object,
     *     function(value) {
     *         console.log(value); // 1 .. 5
     *     }
     * );
     *
     * foreach(
     *     object,
     *     function(key, value) {
     *         console.log(key + ':' + value); // a:1 .. e:5
     *     }
     * );
     *
     * @example
     * // ES6 arrow function
     * var array = [1, 2, 3, 4, 5];
     *
     * foreach(
     *     array,
     *     (value) => {
     *         console.log(value); // 1 .. 5
     *     }
     * );
     *
     * foreach(
     *     array,
     *     (key, value) => {
     *         console.log(key + ':' + value); // 0:1 .. 4:5
     *     }
     * );
     *
     * @example
     * // for strings
     * var string = 'abcdefgh';
     *
     * foreach(
     *     string,
     *     function(char) {
     *         console.log(char); // 'a' .. 'h'
     *     }
     * );
     */
    function foreach(object, callback, options) {
        var numArgs = TWO_ARGUMENTS,
            opts,
            checkArgs,
            checkProp,
            castIndex,
            isArray,
            key,
            returnValue;

        if (typeof callback !== 'function') {
            return;
        }

        opts      = processOptions(options);
        checkArgs = opts.checkArguments;
        checkProp = opts.checkOwnProperty;
        castIndex = opts.castArrayIndex;

        if (checkArgs) {
            if (ARGUMENT_CHECK_PATTERN.test(callback.toString())) {
                numArgs = TWO_ARGUMENTS;
            } else {
                numArgs = ONE_ARGUMENT;
            }
        }

        // if object is array or array-like
        if (object.length ||
            Object.prototype.toString.call(object) === '[object Array]') {

            isArray = true;
        }

        for (key in object) {
            if ( ! checkProp || object.hasOwnProperty(key)) {
                if (numArgs === ONE_ARGUMENT) {
                    returnValue = callback(object[key]);
                } else {

                    // if object is array-like, cast the key to an integer,
                    // since it is the index in the array-like for the current value
                    if (isArray && castIndex) {
                        key = +key;
                    }

                    returnValue = callback(key, object[key]);
                }

                if (returnValue === false) {
                    return;
                }
            }
        }
    }

    /**
     * Sets the global config options for "foreach" partial.
     *
     * @static
     * @function setOptions
     * @memberOf js/partial/foreach
     *
     * @param {config} [options] The object, which contains the config options.
     *
     * @return {void}
     *
     * @example
     * // after setOptions(...), the global config of "foreach" will be changed
     * foreach.setOptions({
     *     checkArguments   : true,
     *     checkOwnProperty : false,
     *     castArrayIndex   : false
     * });
     */
    foreach.setOptions = function(options) {
        processOptions(options, true);
    };

    /**
     * Returns the global config options for "foreach" partial.
     *
     * @static
     * @function getOptions
     * @memberOf js/partial/foreach
     *
     * @returns {config} The valid, changeable config options with their actual, current value.
     *
     * @example
     * var options = foreach.getOptions();
     * // options now will contain:
     * // options.checkArguments
     * // options.checkOwnProperty
     * // options.castArrayIndex
     */
    foreach.getOptions = function() {
        return processOptions();
    };

    /**
     * @exports js/partial/foreach
     */
    return foreach;
}));
