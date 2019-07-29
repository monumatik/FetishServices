const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'patrykslu1@gmail.com',
    pass: 'patryk1901'
  }
});

function sendActivationLink(address, link){
	let mailOptions = {
	  from: 'patrykslu1@gmail.com',
	  to: address,
	  subject: 'Aktywuj konto szmato pierdolona nooooooooo !',
	  text: `${link}`
	};


	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
}

function accountActivated(address){
	let mailOptions = {
	  from: 'patrykslu1@gmail.com',
	  to: address,
	  subject: 'Konto aktywowane kurwa kurwiuuuuuuuuu!!!!!',
	  text: `Chcialibymymymy informnąć że możesz szukać ruchania na fetyszku nonono.`
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
	accountActivated: accountActivated
}