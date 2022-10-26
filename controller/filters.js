'use strict';

/* Filters */

angular.module('myApp.filters', []).
    filter('interpolate', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }])

    .filter('nunLimitTo', function () {

        return function (array, offset, limit) {
            if (!(array instanceof Array)) return array;
            offset = offset * 1
            limit = limit * 1;
            var out = [],
                i, n;

            // check that array is iterable
            if (!array || !(array instanceof Array))
                return out;

            i = offset;
            n = offset + limit;
            if (n > array.length) {
                n = array.length;
            }

            for (; i < n; i++) {
                out.push(array[i]);
            }

            return out;
        }
    })

    .filter('reverse', function () {
        return function (items) {
            if (items) {
                return items.slice().reverse();
            }
        };
    })

;
