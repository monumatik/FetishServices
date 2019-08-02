const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'patrykslu1@gmail.com',
    pass: 'patryk1901'
  }
});

function sendActivationLink(address, login, password, link){
	let mailOptions = {
	  from: 'patrykslu1@gmail.com',
	  to: address,
	  subject: 'Fetish - Aktywacja konta',
	  html: `<h3>Witamy w społeczności Fetish</h3><p>Twoje konto:</p><p>Login: ${login}</p><p>Hasło: ${password}</p><p>Aby aktywować konto kliknij w poniższy link (link aktywacyjny aktywny jest przez 24H):</p><p>${link}</p>`
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
	    console.log('Email sent: ' + info.response);
	  }
	});
}

module.exports = {
	sendActivationLink: sendActivationLink,
	accountResetLink: accountResetLink
}