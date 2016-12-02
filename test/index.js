const CB = require('..').CB;
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

describe('of', () => {
    it('should return a CB function that ignores it\'s argument and pass the original value to the callback', done => {
        CB.of(123)(456, checkcb(done, 123));
    });
});

describe('fail', () => {
    it('should return a CB function that ignores it\'s argument and pass the original value to the callback\'s failure parameter', done => {
        CB.fail('failure')(123, checkErrcb(done, 'failure'));
    });
});

describe('map', () => {
    it('should map over a CB function that succeeds', done => {
        const succeedCB = CB.of('success');
        const mappedSucceed = CB.map(succeedCB, x => x + '!')
        mappedSucceed(123, checkcb(done, 'success!'));
    });
    it('should map over a CB function that fails', done => {
        const failCB = CB.fail('failure');
        const mappedFail = CB.map(failCB, x => x + '!')
        mappedFail(123, checkErrcb(done, 'failure'));
    });
});

describe('id', () => {
    it('should return the identity CB function', done => {
        CB.id(123, checkcb(done, 123));
    });
});

describe('create', () => {
    it('should create a CB function from a regular function', done => {
        const add1Async = CB.create(R.inc);
        add1Async(5, checkcb(done, 6));
    });
});

describe('compose', () => {
    it('should compose the callbacks', done => {
        CB.compose(CB.create(R.inc), CB.create(R.multiply(2)))(3, checkcb(done, 8));
    });
});
