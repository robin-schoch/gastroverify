const jwt = require('jsonwebtoken');


const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "jwtUtil", src: true});

var AWS = require('aws-sdk'),
    region = "eu-central-1",
    secretName = "JWT_SECRET",
    decodedBinarySecret;

let secret
var client = new AWS.SecretsManager({
    region: region
});
let env = 'dev'

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
        log.info("loading secrets from secretmanager")
        let sec = await loadSecret()
        secret = sec
    }
    return secret
}

getSecret().then(elem => {
    log.info("loaded secret ready to verify users")
})

module.exports.generateJWT = async (phoneNumber, momentum) => {
    const sec = await getSecret()
    return jwt.sign({
        phone: phoneNumber,
        validation: momentum
    }, sec, {expiresIn: '3650d'})

}

module.exports.verifyJWT = async (token) => {
    const sec = await getSecret()
    return new Promise(((resolve, reject) => {
        jwt.verify(token, sec, (err, decoded) => {
            if (err) reject(err)
            resolve(decoded)
        })
    }))
}
