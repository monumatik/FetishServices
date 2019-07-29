class Register {
	constructor(login, password, email, sex){
		this.login = login
		this.password = password
		this.email = email
		this.sex = sex
	}
	
	createAccount(Database, response){
		let result;
		const Text = require('./text')

			Database.UserClass.create({
				login: this.login,
				password: this.password,
				email: this.email,
				sex: this.sex
			})
			.then((data) => {
				response(Text.accountCreated, null)
				const email = require('./email')
				var md5 = require('md5');
				const sugar = require('./sugar')
				const _md5 = md5(data.dataValues.id+data.dataValues.login+sugar.activationLinkSugar)
				const link = `http://localhost:3001/activate/${_md5}`
				email.sendActivationLink(data.dataValues.email, link)
			})
			.catch(Database.Sequelize.UniqueConstraintError, (err)=>{
				switch(err.parent.constraint){
					case 'users_email_key':
						response(null, Text.emailExists)
						break;
					case 'users_login_key':
						response(null, Text.userExists)
						break;
					default:
						response(null, Text.unexpectedError)
				}
			})
			.catch(Database.Sequelize.ValidationError, (err)=>{
				let breakLoop = false
				for(let key in err.errors){
					if(err.errors[key].path === 'password'){
						switch(err.errors[key].validatorKey){
							case 'len':
								response(null, Text.passwordRequirements)
								breakLoop = true
								break;
						}
					}else if(err.errors[key].path === 'login'){
						switch(err.errors[key].validatorKey){
							case 'len':
								response(null, Text.loginRequirements)
								breakLoop = true
								break;
						}
					}else if(err.errors[key].path === 'email'){
						switch(err.errors[key].validatorKey){
							case 'isEmail':
								response(null, Text.emailRequirements)
								breakLoop = true
								break;
						}
					}else if(err.errors[key].path === 'sex'){
						switch(err.errors[key].validatorKey){
							case 'isIn':
								response(null, Text.sexRequirements)
								breakLoop = true
								break;
						}
					}
					if(breakLoop)
						break;
				}
				if(!breakLoop)
					response(null, Text.unexpectedError)
			})
	}
}

module.exports = Register;