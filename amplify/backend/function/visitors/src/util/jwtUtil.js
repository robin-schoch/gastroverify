const jwt = require('jsonwebtoken');
const secret = "notSAFEEEEE!!!" // where should it be??

module.exports.generateJWT = (phoneNumber, momentum) => {
    return jwt.sign({
        phone: phoneNumber,
        validation: momentum
    }, secret, {expiresIn: '3650d'})

}

module.exports.verifyJWT = (token) => {
    return new Promise(((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) reject(err)
            resolve(decoded)
        })
    }))
}
