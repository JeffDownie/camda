'use strict';
const utils = require('../utils.js');

//CB x y :: x -> (cb y) -> IO ()

//mapCB :: (y -> z) -> CB x y -> CB x z
const mapCB = utils.curry2((fnyz, CBxy) => {
    return CBify((x, cbz) => {
        CBxy(x, (err, y) => {
            if(err) return cbz(err);
            return cbz(null, fnyz(y));
        });
    });
});

//ofCB :: x -> CB y x
const ofCB = (x) => {
    return CBify((y, cbx) => {
        cbx(null, x);
    });
};

//failCB :: err -> CB y x
const failCB = (err) => {
    return CBify((y, cbx) => {
        cbx(err);
    });
};

//apCB :: CB z (x -> y) -> CB z x -> CB z y
const apCB = utils.curry2((CBzfnxy, CBzx) => {
    return CBify((z, cby) => {
        CBzx(z, (err, x) => {
            if(err) return cby(err);
            CBzfnxy(z, (err, fnxy) => {
                if(err) return cby(err);
                cby(null, fnxy(x));
            });
        });
    });
});

//chainCB :: (x -> CB z y) -> CB z x -> CB z y
const chainCB = utils.curry2((fnxCBzy, CBzx) => {
    return CBify((z, cby) => {
        CBzx(z, (err, x) => {
            if(err) return cby(err);
            fnxCBzy(x)(z, cby);
        });
    });
});

//composeCB :: CB x y -> CB y z -> CB x z
const composeCB = utils.curry2((CBxy, CByz) => {
    return CBify((x, cbz) => {
        CBxy(x, (err, y) => {
            if(err) return cbz(err);
            CByz(y, cbz);
        });
    });
});

//createCB ::  (x -> y) -> CB x y
const createCB = (fnxy) => {
    return CBify((x, cby) => {
        cby(null, fnxy(x));
    });
};

//parallelCB :: CB x y -> CB [x] [y]
const parallelCB = (CBxy) => {
    return CBify((xs, cbys) => {
        const length = xs.length;
        if(length === 0) return cbys(null, []);
        let ys = [];
        let finalErr = null;
        let called = 0;
        const cby = (err, y) => {
            if(err) {
                finalErr = err;
            } else if(!finalErr) {
                ys.push(y);
            }
            if(++called !== length) return;
            if(finalErr) return cbys(finalErr);
            cbys(null, ys);
        };
        for(let i = 0; i < length; i++) {
            CBxy(xs[i], cby);
        }
    });
};

//CBify :: classic-style CB x y -> CB x y
//Used for interoperability with fantasy-land, ramda, etc
//Optional that argument for passing the function context.
const CBify = (classicCB, that) => {
    const CB = utils.curry2(classicCB, that);
    CB.map = fn => mapCB(fn, CB);
    CB.ap = CBzx => apCB(CB, CBzx);
    CB.chain = fnCB => chainCB(fnCB, CB);
    CB.compose = composeCB(CB);
    CB.parallel = () => parallelCB(CB);
    CB['fantasy-land/map'] = CB.map;
    CB['fantasy-land/ap'] = CBxfnyz => apCB(CBxfnyz, CB);
    CB['fantasy-land/chain'] = CB.chain;
    CB['fantasy-land/compose'] = CB.compose;
    return CB;
};

//idCB :: CB x x
const idCB = CBify((x, cbx) => {
    cbx(null, x);
});

module.exports = CBify;
module.exports.map = mapCB;
module.exports.of = ofCB;
module.exports.fail = failCB;
module.exports.ap = apCB;
module.exports.chain = chainCB;
module.exports.compose = composeCB;
module.exports.id = idCB;
module.exports.create = createCB;
module.exports.parallel = parallelCB;
module.exports.CBify = CBify;
