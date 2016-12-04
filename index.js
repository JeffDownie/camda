const R = require('ramda');

//cb x :: (err, x) -> IO ()
//CB x y :: x -> (cb y) -> IO ()

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

//conquercb :: (x -> ()) -> cb x
const conquercb = (fnx) => {
    return (err, x) => {
        if(err) return;
        fnx(x);
    };
};

//mapCB :: (y -> z) -> CB x y -> CB x z
const mapCB = R.curry((fnyz, CBxy) => {
    return R.curry((x, cbz) => {
        CBxy(x, (err, y) => {
            if(err) return cbz(err);
            return cbz(null, fnyz(y));
        });
    });
});

//ofCB :: x -> CB y x
const ofCB = (x) => {
    return R.curry((y, cbx) => {
        cbx(null, x);
    });
};

//failCB :: err -> CB y x
const failCB = (err) => {
    return R.curry((y, cbx) => {
        cbx(err);
    });
};

//apCB :: CB z (x -> y) -> CB z x -> CB z y
const apCB = R.curry((CBzfnxy, CBzx) => {
    return R.curry((z, cby) => {
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
    return R.curry((z, cby) => {
        CBzx(z, (err, x) => {
            if(err) return cby(err);
            fnxCBzy(x)(z, cby);
        });
    });
});

//composeCB :: CB x y -> CB y z -> CB x z
const composeCB = R.curry((CBxy, CByz) => {
    return R.curry((x, cbz) => {
        CBxy(x, (err, y) => {
            if(err) return cbz(err);
            CByz(y, cbz);
        });
    });
});

//idCB :: CB x x
const idCB = R.curry((x, cbx) => {
    cbx(null, x);
});

//createCB ::  (x -> y) -> CB x y
const createCB = (fnxy) => {
    return (x, cby) => {
        cby(null, fnxy(x));
    };
};

module.exports = {
    cb: {
        contraMap: contraMapcb,
        divide: dividecb,
        conquer: conquercb
    },
    CB: {
        map: mapCB,
        of: ofCB,
        fail: failCB,
        ap: apCB,
        chain: chainCB,
        compose: composeCB,
        id: idCB,
        create: createCB
    }
};
