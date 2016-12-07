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
        R.ap(CB.of(R.inc), CB.create(R.inc))(0, checkcb(done, 2));
    });
    it('should ap over a failed CB', done => {
        R.ap(CB.of(R.inc), CB.fail('err'))(0, checkErrcb(done, 'err'));
    });
});
