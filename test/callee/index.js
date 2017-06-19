'use strict';
const cb = require('../..').cb;
const R = require('ramda');
const assert = require('assert');

describe('contraMap', () => {
    it('should map a function over a successful cb', done => {
        cb.contraMap(R.inc, (err, data) => {
            assert.ok(err == null);
            assert.deepEqual(data, 2);
            done();
        })(null, 1);
    });
    it('should map a function over a failed cb', done => {
        cb.contraMap(R.inc, (err, data) => {
            assert.ok(data == null);
            assert.deepEqual(err, 'err');
            done();
        })('err');
    });
});

describe('divide', () => {
    it('should pass the mapped argument to each passed cb function', done => {
        let cbCalls = 0;
        const doublecb = (err, data) => {
            assert.ok(err == null);
            assert.deepEqual(data, 2);
            cbCalls += 1;
            if(cbCalls === 2) done();
        };
        cb.divide(x => [x + 1, x + 1], doublecb, doublecb)(null, 1);
    });
    it('should pass an error to each passed cb function', done => {
        let cbCalls = 0;
        const errcb = (err, data) => {
            assert.deepEqual(err,'err');
            assert.ok(data == null);
            cbCalls += 1;
            if(cbCalls === 2) done();
        };
        cb.divide(x => [x + 1, x + 1], errcb, errcb)('err');
    });
});
