var database;
const text = require('./text')
const sugar = require('./sugar')
const auth = require('./auth')
const email = require('./email')


class Account {
	constructor(db){
		database = db
	}

	createAccount(user, callback){
		let result;
			database.sequelize.models.Users.create({
				login: user.login.replace(' ',''),
				password: user.password.replace(' ',''),
				email: user.email.replace(' ','')
			})
			.then((data) => {
				data.dataValues !== null ? email.sendActivationLink({	
					id: data.dataValues.id,
					login: data.dataValues.login,
					password: data.dataValues.password,
					email: data.dataValues.email,
				}) : {};
				callback({
					data: text.accountCreated,
					error: null,
					account: {
						id: data.dataValues.id,
						login: data.dataValues.login,
						password: data.dataValues.password,
						email: data.dataValues.email,
					}
				})
			})
			.catch(database.Sequelize.UniqueConstraintError, (err)=>{
				switch(err.parent.constraint.toLowerCase()){
					case 'users_email_key':
						callback({data: null, error: text.emailExists})
						break;
					case 'users_login_key':
						callback({data: null, error: text.userExists})
						break;
					default:
						callback({data: null, error: text.unexpectedError})
				}
			})
			.catch(database.Sequelize.ValidationError, (err)=>{
				let breakLoop = false
				for(let key in err.errors){
					if(err.errors[key].path === 'password'){
						switch(err.errors[key].validatorKey){
							case 'len':
								callback({
									data: null,
									error: text.passwordRequirements
								})
								breakLoop = true
								break;
						}
					}else if(err.errors[key].path === 'login'){
						switch(err.errors[key].validatorKey.toLowerCase()){
							case 'len':
								callback({
									data: null,
									error: text.loginRequirements
								})
								breakLoop = true
								break;
						}
					}else if(err.errors[key].path === 'email'){
						switch(err.errors[key].validatorKey.toLowerCase()){
							case 'isemail':
								callback({
									data: null,
									error: text.emailRequirements
								})
								breakLoop = true
								break;
						}
					}
					if(breakLoop)
						break;
				}
				if(!breakLoop)
					callback({
						data: null, 
						error: text.unexpectedError
					})
			})
	}

	activate(link){
		const table = `${database.sequelize.models.Users.getTableName()}`
		database.sequelize.query(`UPDATE ${table} SET active = true WHERE MD5(${sugar.hashConfig}) = '${link}' AND active = false RETURNING email, login, password;`)
	}

	checkResetKey(key, callback){
		const table = `${database.sequelize.models.Users.getTableName()}`
		database.sequelize.query(`SELECT email FROM ${table} WHERE MD5(${sugar.hashConfig}) = '${key}' AND active = true`)
		.then(([results, metadata])=> {
			((metadata.rowCount > 0) ? callback(true) : callback(false))
		})
	}

	resetLink(email, callback){
		const table = `${database.sequelize.models.Users.getTableName()}`
		database.sequelize.query(`SELECT MD5(${sugar.hashConfig}) as link FROM ${table} WHERE email = '${email}'`)
		.then(([results, metadata]) => {
			if(metadata.rowCount > 0){
				const _email = require('./email')
				_email.accountResetLink(email, results[0].link)
			}
			callback()
		})
	}

	setPassword(password, confirmPassword, key, callback){
		if(password === confirmPassword){
			database.sequelize.models.Users.update(
				{ password: password.replace(' ','') },
				{ where: { password: database.Sequelize.where(
					database.Sequelize.fn('MD5', 
						database.Sequelize.fn('concat', 
							database.Sequelize.col('id'), 
							database.Sequelize.col('login'),
							database.Sequelize.col('password'),
							sugar.activationLinkSugar
						)), { [database.Sequelize.Op.eq]: key }
					)} }
			)
			.then(data => callback(text.passwordChanged, null))
			.catch(database.Sequelize.ValidationError, (err)=>{
				callback(null, text.passwordRequirements)
			})
			.catch(err => {
				console.log(err)
				callback(null, text.unexpectedError)
			})
		}else{
			callback(null, text.passwordsDifferent)
		}
	}

	login(_object, callback){
		const md5 = require('MD5');
		database.sequelize.models.Users.findOne({
			where: {
				[database.Sequelize.Op.or] : [{email: _object.login}, {login: _object.login}],
				password: md5(`${_object.password}${sugar.activationLinkSugar}`),
				active: true
			}
		})
		.then(data => {
			const token = auth.getToken({
				payload:{
						id: data.dataValues.id
						}	
			})
			callback({
				data: token,
				error: null
			})
		})
		.catch(err=>{
			callback({
				data: null,
				error: text.wrongCredentials
			})
		})
	}

	getFetish(_object, callback){
		const Auth = auth.validateToken(_object)
		if(Auth.payload !== null){
			database.sequelize.models.Shows.findOne({
				where: {
					UserId: Auth.payload.id
				}
			})
			.then(data => {
				Promise.all([
					database.sequelize.models.Images.findAll({
						where: {
							UserId: data.dataValues.UserIdToShow
						}
					}),
					database.sequelize.models.Users.findOne({
						where: {
							id: data.dataValues.UserIdToShow
						}
					})
				])
				.then(data=>{
					let images=[]
					console.log(data[0])
					data[0].forEach(value=>images.push(value.url))
					callback({
						data: {
							login: data[1].dataValues.login,
							images: images
						},
						error: null
					})
				})
			})
			
		}else{
			res.status(400)
			res.end()
		}
		
	}

}

module.exports = Account