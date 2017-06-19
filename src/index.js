'use strict';
const callee = require('./callee');
const caller = require('./caller');

module.exports = {
    callee: callee,
    cb: callee,
    caller: caller,
    CB: caller
};
