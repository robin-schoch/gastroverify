const cognitoPoolId = process.env.COGNITO_POOL_ID || 'eu-central-1_brxCRSgTn';
const location = process.env.COGNITO_POOL_ID || 'eu-central-1';
const cognitoIssuer = `https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_brxCRSgTn/.well-known/jwks.json`;
const axios = require('axios').default;
const jwkToPem = require('jwk-to-pem')
const jwt = require('jsonwebtoken');
if (!cognitoPoolId) {
    console.log("no cognito id")
} else {
    console.log(cognitoPoolId)
}
const pems = {}

const iss = "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_brxCRSgTn"
const aud = "7c0fj3mbd0529daf8gloevsmru"

const verifyJWT = (token, secret) => {
    return new Promise(((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) reject(err)
            resolve(decoded)
        })
    }))
}

const getPublicKeys = () => {
    console.log("request pems..")

    return axios.get(cognitoIssuer).then(data => {
        console.log(data.data)
        data.data.keys.forEach(key => {
            pems[key.kid] = jwkToPem(key)
        })
        console.log(pems)
    }).catch(data => {
        console.log(data.data)
        console.log("error receiving pems!!")
        keys = data
    })
}


const _verify = (token, token_use) => {
    return new Promise(((resolve, reject) => {
        const decoded = jwt.decode(token, {complete: true})
        myPEM = pems[decoded.header.kid]
        if (myPEM !== undefined) {
            verifyJWT(token, myPEM).then(success => {
                // console.log(success)
                if (success.aud === aud && success.iss === iss && token_use === success.token_use) {
                    resolve(success)
                } else {
                    reject({error: 'invalid'})
                }
            }).catch(error => {
                reject({error})
            })
        } else {
            reject({error: 'invalid'})
        }
    }))
}

const verifyXIDToken = (token, token_use = "id") => {
    if (Object.keys(pems).length === 0) {
        return getPublicKeys().then(keys => {
            return _verify(token, token_use)
        }).catch(error => console.log(error))
    } else {
        return _verify(token, token_use)
    }

}


module.exports = {
    verifyXIDToken,
    getPublicKeys
}

