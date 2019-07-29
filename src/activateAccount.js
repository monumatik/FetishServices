class ActivateAccount {
	constructor(database){
		this.database = database
	}

	activate(link){
		const sugar = require('./sugar')
		this.database.sequelize.query(`UPDATE g.users SET active = true WHERE MD5(id||login||'${sugar.activationLinkSugar}') = '${link}' RETURNING email;`)
		.then(([results, metadata]) => {
			if(results.length === 1){
				const email = require('./email')
				email.accountActivated(results[0].email)
			}
			
		})
	}

}

module.exports = ActivateAccount