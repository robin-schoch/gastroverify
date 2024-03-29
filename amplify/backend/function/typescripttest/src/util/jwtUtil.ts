const cognitoPoolId = process.env.COGNITO_POOL_ID || 'eu-central-1_brxCRSgTn';
const location = process.env.COGNITO_POOL_ID || 'eu-central-1';


const axios = require('axios').default;

const jwkToPem = require('jwk-to-pem')
const jwt = require('jsonwebtoken');

const {createLogger} = require('bunyan');
const log = createLogger({name: "partner-express", src: true});


const pems = {}
let cognitoIssuer = `https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_brxCRSgTn/.well-known/jwks.json`;
let iss = "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_brxCRSgTn"
let aud = "7c0fj3mbd0529daf8gloevsmru"
if (process.env.ENV && process.env.ENV !== "NONE") {
    if(process.env.ENV === "prod"){
        cognitoIssuer  = `https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_fAK4Gm0UP/.well-known/jwks.json`;
        iss = "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_fAK4Gm0UP"
        aud = "fa5a1mo0teojkosc5hb9bk08k"
    } else if(process.env.ENV === "dev"){
        cognitoIssuer = `https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_brxCRSgTn/.well-known/jwks.json`;
        iss = "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_brxCRSgTn"
        aud = "7c0fj3mbd0529daf8gloevsmru"
    }
}

const verifyJWT = (token, secret): Promise<any> => {
    return new Promise(((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) reject(err)
            resolve(decoded)
        })
    }))
}

export const getPublicKeys = () => {

    log.info("reqeust pems...")

    return axios.get(cognitoIssuer).then(data => {
        data.data.keys.forEach(key => {
            pems[key.kid] = jwkToPem(key)
        })
        log.info("found pems")
    }).catch(data => {
        log.fatal("no pems found ")
    })
}


const _verify = (token, token_use) => {
    return new Promise(((resolve, reject) => {
        const decoded = jwt.decode(token, {complete: true})
        let myPEM = pems[decoded.header.kid]
        if (myPEM !== undefined) {
            verifyJWT(token, myPEM).then(success => {
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

export const verifyXIDToken = (token, token_use = "id") => {
    if (Object.keys(pems).length === 0) {
        return getPublicKeys().then(keys => {
            return _verify(token, token_use)
        }).catch(error => log.error(error))
    } else {
        return _verify(token, token_use)
    }

}


