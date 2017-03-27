'use strict';
const R = require('ramda');

//Currys the given function whilst keeping the this argument as 'that'
const curry2 = (f, that) => {
    return R.curryN(2, (a,b) => {
        return f.apply(that, [a,b]);
    });
};

module.exports = {
    curry2: curry2
};
