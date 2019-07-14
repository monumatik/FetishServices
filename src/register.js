function verifyLogin(login){
	if(login.length > 0){
		return true
	}else{
		return false
	}
}

function verifyPassword(password){
	if(password.length > 6){
		return true
	}else{
		return false
	}
}

function verifyEmail(email){
	if(email.length > 0){
		return true
	}else{
		return false
	}	
}

class Register {
	constructor(login, password, email){
		this.login = login
		this.password = password
		this.email = email
	}
	
	createAccount(Database, response){
		let result;
		const Text = require('./text')

		
			Database.UserClass.create({
				login: this.login,
				password: this.password,
				email: this.email,
				sex: 'm'
			})
			.then(() => response(Text.accountCreated, null))
			.catch(Database.Sequelize.UniqueConstraintError, ()=>{
				response(null, Text.userExists)
			})
			.catch(Database.Sequelize.ValidationError, (err)=>{
				response(null, Text.userExists)
				console.log(err)
			})
		

	}
}

module.exports = Register;