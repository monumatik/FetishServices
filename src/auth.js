const jwt = require('jsonwebtoken');
const secret = 'NieróbScenDamianRatajczak';

class Authorization {
	static getToken(_obj){
		var token = jwt.sign(_obj.payload, secret);
		return token
	}

	static validateToken(_obj){
		var payload = null
		var _error = null
		try{
			payload = jwt.verify(_obj.token, secret)
		}catch(err){
			_error = err
		}	
		return { payload: payload, error: _error }
	}
}

module.exports = Authorization;