const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const GLOBAL_MESSAGES = require('../../_global/global.messages');

exports.verifyToken = (req, res, next) => {
    // get token from the request
    let token = req.headers["authorization"].replace('Bearer','').trim(); 
    
    if(req.url == '/admin-signup'){
        if(!token){
            next();
        }
    }

    if (!token) {
        return res.status(403).send({
            status: GLOBAL_MESSAGES.ERROR_STATUS,
            message: GLOBAL_MESSAGES.NOT_AUTHORIZED_USER_ERROR_MESSAGE
        })
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                status: GLOBAL_MESSAGES.ERROR_STATUS,
                message: GLOBAL_MESSAGES.NOT_AUTHORIZED_USER_ERROR_MESSAGE
            })
        }
        req.userId = decoded.user_id;
        next();
    })
}