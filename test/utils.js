'use strict';
const utils = require('../src/utils.js');
const assert = require('assert');

describe('utils', () => {
    describe('curry2', () => {
        const curry2 = utils.curry2;

        it('can call the function with one argument at a time', () => {
            assert.equal(3, curry2((x,y) => x + y)(1)(2));
        });

        it('can call the function with both arguments at the same time', () => {
            assert.equal(3, curry2((x,y) => x + y)(1, 2));
        });

        it('can pass the this parameter', () => {
            const thisObj = {
                x: 5,
                f: function(y, z) {
                    return this.x + y + z;
                }
            };
            assert.equal(8, curry2(thisObj.f, thisObj)(1, 2));
            assert.equal(9, curry2(thisObj.f, thisObj)(1)(3));
        });
    });
});
