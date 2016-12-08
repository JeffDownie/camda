'use strict';
const CB = require('../..').CB;
const R = require('ramda');
const assert = require('assert');

const checkcb = (done, expectedData) => {
    return (err, data) => {
        assert.ok(err == null);
        assert.deepEqual(expectedData, data);
        done();
    };
};

const checkErrcb = (done, expectedErr) => {
    return (err, data) => {
        assert.ok(data == null);
        assert.deepEqual(expectedErr, err);
        done();
    };
};

describe('map', () => {
    it('should map over a successful CB', done => {
        R.map(R.inc, CB.id)(0, checkcb(done, 1));
    });
    it('should map over a failed CB', done => {
        R.map(R.inc, CB.fail('err'))(0, checkErrcb(done, 'err'));
    });
});

describe('ap', () => {
    it('should ap over a successful CB', done => {
        R.ap(CB.create(R.inc), CB.of(R.inc))(0, checkcb(done, 2));
    });
    it('should ap over a failed CB as the first argument', done => {
        R.ap(CB.fail('err'), CB.of(R.inc))(0, checkErrcb(done, 'err'));
    });
    it('should ap over a failed CB as the second argument', done => {
        R.ap(CB.create(R.inc), CB.fail('err'))(0, checkErrcb(done, 'err'));
    });
});
