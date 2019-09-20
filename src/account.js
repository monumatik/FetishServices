class Account {
	constructor(database){
		this.database = database	
	}

	createAccount(login, password, email, callback){
		let result;
		
			this.database.sequelize.models.Users.create({
				login: login.replace(' ',''),
				password: password.replace(' ',''),
				email: email.replace(' ','')
			})
			.then((data) => {
				callback(data, null)
			})
			.catch(this.database.Sequelize.UniqueConstraintError, (err)=>{
				switch(err.parent.constraint.toLowerCase()){
					case 'users_email_key':
						callback(null, Text.emailExists)
						break;
					case 'users_login_key':
						callback(null, Text.userExists)
						break;
					default:
						callback(null, Text.unexpectedError)
				}
			})
			.catch(this.database.Sequelize.ValidationError, (err)=>{
				let breakLoop = false
				for(let key in err.errors){
					if(err.errors[key].path === 'password'){
						switch(err.errors[key].validatorKey){
							case 'len':
								callback(null, Text.passwordRequirements)
								breakLoop = true
								break;
						}
					}else if(err.errors[key].path === 'login'){
						switch(err.errors[key].validatorKey.toLowerCase()){
							case 'len':
								callback(null, Text.loginRequirements)
								breakLoop = true
								break;
						}
					}else if(err.errors[key].path === 'email'){
						switch(err.errors[key].validatorKey.toLowerCase()){
							case 'isEmail':
								callback(null, Text.emailRequirements)
								breakLoop = true
								break;
						}
					}
					if(breakLoop)
						break;
				}
				if(!breakLoop)
					callback(null, Text.unexpectedError)
			})
	}

	activate(link){
		const sugar = require('./sugar')
		const table = `${this.database.sequelize.models.Users.getTableName()}`
		this.database.sequelize.query(`UPDATE ${table} SET active = true WHERE MD5(${sugar.hashConfig}) = '${link}' AND active = false RETURNING email, login, password;`)
	}

	checkResetKey(key, callback){
		const sugar = require('./sugar')
		const table = `${this.database.sequelize.models.Users.getTableName()}`
		this.database.sequelize.query(`SELECT email FROM ${table} WHERE MD5(${sugar.hashConfig}) = '${key}' AND active = true`)
		.then(([results, metadata])=> {
			((metadata.rowCount > 0) ? callback(true) : callback(false))
		})
	}

	resetLink(email, callback){
		const sugar = require('./sugar')
		const table = `${this.database.sequelize.models.Users.getTableName()}`
		this.database.sequelize.query(`SELECT MD5(${sugar.hashConfig}) as link FROM ${table} WHERE email = '${email}'`)
		.then(([results, metadata]) => {
			if(metadata.rowCount > 0){
				const _email = require('./email')
				_email.accountResetLink(email, results[0].link)
			}
			callback()
		})
	}

	setPassword(password, confirmPassword, key, callback){
		const text = require('./text')
		if(password === confirmPassword){
			const sugar = require('./sugar')
			this.database.sequelize.models.Users.update(
				{ password: password.replace(' ','') },
				{ where: { password: this.database.Sequelize.where(
					this.database.Sequelize.fn('MD5', 
						this.database.Sequelize.fn('concat', 
							this.database.Sequelize.col('id'), 
							this.database.Sequelize.col('login'),
							this.database.Sequelize.col('password'),
							sugar.activationLinkSugar
						)), { [this.database.Sequelize.Op.eq]: key }
					)} }
			)
			.then(data => callback(text.passwordChanged, null))
			.catch(this.database.Sequelize.ValidationError, (err)=>{
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

	login(loginOrEmail, password, callback){
		const text = require('./text')
		const sugar = require('./sugar')
		this.database.sequelize.models.Users.findOne({
			where: {
				[this.database.Sequelize.Op.or] : [{email: loginOrEmail}, {login: loginOrEmail}],
				password: `password`,
				active: true
			}
		})
		.then(data => {
			console.log(data)
			callback('', '')
		})
		.catch(err=>console.log(err))
	}

}

module.exports = Account