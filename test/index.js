'use strict';
const assert = require('assert');

describe('caller', () => {
    require('./caller');
});
describe('callee', () => {
    require('./callee');
});
describe('ramda integration', () => {
    require('./ramdaIntegration');
});
describe('module structure', () => {
    const mod = require('../');
    it('should have multiple names for the caller module', done => {
        assert.ok(mod.CB == mod.caller);
        done();
    });
    it('should have multiple names for the callee module', done => {
        assert.ok(mod.cb == mod.callee);
        done();
    });
});
