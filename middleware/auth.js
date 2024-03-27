const jwt = require('jsonwebtoken')
const verifyAuth =(req, res,next) => {
    const bearer = req.headers('authorization')
    console.log(bearer);
    next()
}

module.exports = {verifyAuth}