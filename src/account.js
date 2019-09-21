class Account {
	constructor(database, text){
		this.database = database
		this.text = text
	}

	createAccount(user, callback){
		let result;
			this.database.sequelize.models.Users.create({
				login: user.login.replace(' ',''),
				password: user.password.replace(' ',''),
				email: user.email.replace(' ','')
			})
			.then((data) => {
				console.log(data)
				callback({
					data: this.text.accountCreated,
					error: null,
					account: {
						id: data.dataValues.id,
						login: data.dataValues.login,
						password: data.dataValues.password,
						email: data.dataValues.email,
					}
				})
			})
			.catch(this.database.Sequelize.UniqueConstraintError, (err)=>{
				switch(err.parent.constraint.toLowerCase()){
					case 'users_email_key':
						callback(null, this.text.emailExists)
						break;
					case 'users_login_key':
						callback(null, this.text.userExists)
						break;
					default:
						callback(null, this.text.unexpectedError)
				}
			})
			.catch(this.database.Sequelize.ValidationError, (err)=>{
				let breakLoop = false
				for(let key in err.errors){
					if(err.errors[key].path === 'password'){
						switch(err.errors[key].validatorKey){
							case 'len':
								callback({
									data: null,
									error: this.text.passwordRequirements
								})
								breakLoop = true
								break;
						}
					}else if(err.errors[key].path === 'login'){
						switch(err.errors[key].validatorKey.toLowerCase()){
							case 'len':
								callback({
									data: null,
									error: this.text.loginRequirements
								})
								breakLoop = true
								break;
						}
					}else if(err.errors[key].path === 'email'){
						switch(err.errors[key].validatorKey.toLowerCase()){
							case 'isemail':
								callback({
									data: null,
									error: this.text.emailRequirements
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
						error: this.text.unexpectedError
					})
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
		.catch(err=>{
			console.log(err)
			callback({
				data: null,
				error: ""
			})
		})
		
	}

}

module.exports = Account