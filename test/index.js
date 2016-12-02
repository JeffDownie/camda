const CB = require('..').CB;
const assert = require('assert');

describe('of', done => {
    it('should return a CB function that ignores it\'s argument and pass the original value to the callback', done => {
        CB.of(123)(456, (err, data) => {
            assert.ok(err == null);
            assert.deepEqual(123, data);
            done();
        });
    });
});

describe('fail', done => {
    it('should return a CB function that ignores it\'s argument and pass the original value to the callback\'s failure parameter', done => {
        CB.fail('failure')(123, (err, data) => {
            assert.ok(data == null);
            assert.deepEqual('failure', err);
            done();
        });
    });
});

describe('map', done => {
    it('should map over a CB function that succeeds', done => {
        const succeedCB = CB.of('success');
        const mappedSucceed = CB.map(succeedCB, x => x + '!')
        mappedSucceed(123, (err, data) => {
            assert.ok(err == null);
            assert.deepEqual('success!', data);
            done();
        });
    });
    it('should map over a CB function that fails', done => {
        const failCB = CB.fail('failure');
        const mappedFail = CB.map(failCB, x => x + '!')
        mappedFail(123, (err, data) => {
            assert.ok(data == null);
            assert.deepEqual('failure', err);
            done();
        });
    });
});
