const jwt = require('jsonwebtoken');

var AWS = require('aws-sdk'),
    region = "eu-central-1",
    secretName = "JWT_SECRET",
    decodedBinarySecret;

let secret
var client = new AWS.SecretsManager({
    region: region
});
let env = 'dev'
console.log("env = == = + " + env)
if (process.env.ENV && process.env.ENV !== "NONE") {
    env = process.env.ENV;
}
const loadSecret = () => {
    return new Promise((resolve, reject) => {
        client.getSecretValue({SecretId: secretName}, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(resolve(JSON.parse(data.SecretString)[env]))
            }
        })
    })
}

const getSecret =   () => {
    if (!secret) {
        console.log("loading secret")
        loadSecret().then(sec => secret = sec)
    }
}

getSecret()

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
