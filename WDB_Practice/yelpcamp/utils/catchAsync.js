module.exports =
    function wrapAsync(fn) {
        return function (req, res, next) {
            fn(req, res, next).catch(next); // do not need e => next(e) ???
        }
    }

    // function wrapAsync(fn) {
    //     return function (req, res, next) {
    //         fn(req, res, next).catch(e => next(e));
    //     }
    // }