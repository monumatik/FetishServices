const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'patrykslu1@gmail.com',
    pass: 'Monumatik2019'
  }
});

function sendActivationLink(data){
	const md5 = require('md5');
	const sugar = require('./sugar')
	console.log(data)
	const _md5 = md5(data.id+data.login+data.password+sugar.activationLinkSugar)
	const link = `http://localhost:3001/activate/${_md5}`
	let mailOptions = {
	  from: 'patrykslu1@gmail.com',
	  to: data.email,
	  subject: 'Fetish - Aktywacja konta',
	  html: `<h3>Witamy w społeczności Fetish</h3><p>Twoje konto:</p><p>Login: ${data.login}</p><p>Hasło: ${data.password}</p><p>Aby aktywować konto kliknij w poniższy link (link aktywacyjny aktywny jest przez 24H):</p><p>${link}</p>`
	};


	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
}

function accountResetLink(address, link){
	let mailOptions = {
	  from: 'patrykslu1@gmail.com',
	  to: address,
	  subject: 'Fetish - zmiana hasła',
	  html: `http://localhost:3001/resetconfirmed/${link}`
	};


	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent:' + info.response);
	  }
	});
}

module.exports = {
	sendActivationLink: sendActivationLink,
	accountResetLink: accountResetLink
}