const hmacSha256 = require('crypto-js/hmac-sha256');
const base64url = require('base64url');

const header = {
    typ: 'JWT',
    alg: 'HS256'
};
 
const payload = {
    id: 123,
};
 
const secret = 'NieróbScenDamianRatajczak';
 
const jwtToken = base64UrlEncode(header) + '.' + base64UrlEncode(payload);
const signature = base64url.encode(hmacSha256(jwtToken, secret).toString());
const jwtSignedToken = jwtToken + '.' + signature;
 
function base64UrlEncode(item) {
    return base64url.encode(JSON.stringify(item));
};