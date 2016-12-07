'use strict';
const R = require('ramda');

//CB x y :: x -> (cb y) -> IO ()

//mapCB :: (y -> z) -> CB x y -> CB x z
const mapCB = R.curry((fnyz, CBxy) => {
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
const apCB = R.curry((CBzfnxy, CBzx) => {
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
const chainCB = R.curry((fnxCBzy, CBzx) => {
    return CBify((z, cby) => {
        CBzx(z, (err, x) => {
            if(err) return cby(err);
            fnxCBzy(x)(z, cby);
        });
    });
});

//composeCB :: CB x y -> CB y z -> CB x z
const composeCB = R.curry((CBxy, CByz) => {
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

//CBify :: classic-style CB x y -> CB x y
//Used for interoperability with fantasy-land, ramda, etc
const CBify = (classicCB) => {
    const CB = R.curryN(2, classicCB);
    CB.map = fn => mapCB(fn, CB);
    CB.ap = CBfn => apCB(CBfn, CB);
    CB.chain = fnCB => chainCB(fnCB, CB);
    CB.compose = composeCB(CB);
    CB['fantasy-land/map'] = CB.map;
    CB['fantasy-land/ap'] = CB.ap;
    CB['fantasy-land/chain'] = CB.chain;
    CB['fantasy-land/compose'] = CB.compose;
    return CB;
};

//idCB :: CB x x
const idCB = CBify((x, cbx) => {
    cbx(null, x);
});

module.exports = {
    map: mapCB,
    of: ofCB,
    fail: failCB,
    ap: apCB,
    chain: chainCB,
    compose: composeCB,
    id: idCB,
    create: createCB,
    CBify: CBify
};
