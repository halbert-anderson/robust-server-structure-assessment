
//===middleware that gives anerror for an incorrect HTTP method being used as an endpoint
function methodNotAllowed(req, res, next){
next({
    status: 405,
    message: `${req.method} not allowed for ${req.originalUrl}`,
});

}

module.exports = methodNotAllowed;