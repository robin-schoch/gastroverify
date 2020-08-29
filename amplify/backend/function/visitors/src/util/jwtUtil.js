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

const getSecret = async () => {
    if (!secret) {
        console.log("loading secret")
        let sec = await loadSecret()
        secret = sec
    }
    return secret
}

getSecret()

module.exports.generateJWT = async (phoneNumber, momentum) => {
    const sec = await getSecret()
    return jwt.sign({
        phone: phoneNumber,
        validation: momentum
    }, sec, {expiresIn: '3650d'})

}

module.exports.verifyJWT = async (token) => {
     const sec = await getSecret()
    console.log(sec)
    return new Promise(((resolve, reject) => {
        jwt.verify(token, sec , (err, decoded) => {
            if (err) reject(err)
            resolve(decoded)
        })
    }))
}
