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
        CB.map(x => x + '!', CB.of('success'))(123, checkcb(done, 'success!'));
    });
    it('should map over a CB function that fails', done => {
        CB.map(x => x + '!', CB.fail('failure'))(123, checkErrcb(done, 'failure'));
    });
    it('should work when called as an instance method', done => {
        CB.id.map(R.inc)(1, checkcb(done, 2));
    });
});

describe('id', () => {
    it('should return the identity CB function', done => {
        CB.id(123, checkcb(done, 123));
    });
});

describe('create', () => {
    it('should create a CB function from a regular function', done => {
        CB.create(R.inc)(5, checkcb(done, 6));
    });
});

describe('compose', () => {
    it('should compose the callbacks', done => {
        CB.compose(CB.create(R.inc), CB.create(R.multiply(2)))(3, checkcb(done, 8));
    });
    it('should pass through failures in the first CB', done => {
        CB.compose(CB.fail('err'), CB.id)(3, checkErrcb(done, 'err'));
    });
    it('should pass through failures in the second CB', done => {
        CB.compose(CB.id, CB.fail('err'))(3, checkErrcb(done, 'err'));
    });
    it('should work when called as an instance method', done => {
        CB.id.compose(CB.id())(3, checkcb(done, 3));
    });
});

describe('ap', () => {
    it('should apply the function returned by the CB to the second CB, to create the returned CB', done => {
        CB.ap(CB.create(R.add), CB.create(R.multiply(2)))(3, checkcb(done, 9));
    });
    it('should pass the error to the final CB if the function CB fails', done => {
        CB.ap(CB.fail('fail'), CB.of(1))(123, checkErrcb(done, 'fail'));
    });
    it('should pass the error to the final CB if the standard CB fails', done => {
        CB.ap(CB.create(R.add), CB.fail('fail'))(123, checkErrcb(done, 'fail'));
    });
    it('should work when called as an instance method', done => {
        CB.id.ap(CB.of(R.identity))(3, checkcb(done, 3));
    });
});

describe('chain', () => {
    it('should apply the given function to create a CB on the result from the second argument', done => {
        CB.chain(x => CB.create(y => y + x), CB.create(x => 2 * x))(3, checkcb(done, 9));
    });
    it('should pass though failures in first CB', done => {
        CB.chain(R.always(CB.fail('err')), CB.id)(2, checkErrcb(done, 'err'));
    });
    it('should pass though failures in second CB', done => {
        CB.chain(CB.id, CB.fail('err'))(2, checkErrcb(done, 'err'));
    });
    it('should work when called as an instance method', done => {
        CB.id.chain(x => CB.create(R.add(x)))(3, checkcb(done, 6));
    });
});

describe('CBify', () => {
    it('should add functions to a classic callback', done => {
        CB.CBify((x, cb) => cb(null, x)).map(y => y + 1)(2, checkcb(done, 3));
    });
    it('should pass through the that arg if specified', done => {
        const thisObj = {
            x: 5,
            f: function(y, cb) {
                cb(null, this.x + y);
            }
        };
        CB.CBify(thisObj.f, thisObj)(2, checkcb(done, 7));
    });
    it('should work when called as the root object', done => {
        CB((x, cb) => cb(null, x)).map(y => y + 1)(2, checkcb(done, 3));
    });
});

describe('parallel', () => {
    it('should run a CB in parallel against a list', done => {
        CB.parallel(CB.id)([1,2,3,4], checkcb(done, [1,2,3,4]));
    });
    it('should work when called as an instance method', done => {
        CB.create(R.inc).parallel()([1,2,3], checkcb(done, [2,3,4]));
    });
    it('should work on an empty array', done => {
        CB.id.parallel()([], checkcb(done, []));
    });
    it('should fail if any of the CBs fail', done => {
        CB.CBify((x, cb) => {if(x === 2) return cb('err'); cb(null, x);}).parallel()([0,1,2,3,4,5,6,7], checkErrcb(done, 'err'));
    });
    it('should fail if all of the CBs fail', done => {
        CB.fail('err').parallel()([1,2,3], checkErrcb(done, 'err'));
    });
});
