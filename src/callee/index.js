'use strict';
const R = require('ramda');

//cb x :: (err, x) -> IO ()

//contraMapcb :: (y -> x) -> cb x -> cb y
const contraMapcb = R.curry((fnyx, cbx) => {
    return (err, y) => {
        if(err) return cbx(err);
        return cbx(null, fnyx(y));
    };
});

//dividecb :: (x -> (y, z)) -> cb y -> cb z -> cb x
//(y, z) in js is the pair [y, z]
const dividecb = R.curry((fnxyz, cby, cbz) => {
    return (err, x) => {
        if(err) {
            cby(err);
            return cbz(err);
        }
        const yz = fnxyz(x);
        cby(null, yz[0]);
        cbz(null, yz[1]);
    };
});

//conquercb, idcb :: cb x
const idcb = () => {};
const conquercb = idcb;

module.exports = {
    contraMap: contraMapcb,
    divide: dividecb,
    conquer: conquercb,
    id: idcb
};
