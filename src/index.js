var express = require('express')
var app = express()
var cors = require('cors')
const path = require('path');

var Database = require('./app')
var Database = new Database()
Database.syncDatabase()

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json())

app.post('/register', function (req, res) {
	const email = require('./email')
	var Account = require('./account')
	const Text = require('./text')
	Account = new Account(Database)
	Account.createAccount(req.body.login, req.body.password, req.body.email, (data)=>{
		email.sendActivationLink(data)
		res.send({
			data: Text.accountCreated,
			error: error
		})
	})
})

app.post('/login', function(req, res) {
	const email = require('./email')
	var Account = require('./account')
	Account = new Account(Database)
	Account.login(req.body.login, req.body.password, (data, error)=>{
		res.send({
			data: data,
			result: error
		})
	})
})

app.get('/activate/:key', function (req, res) {
	let Account = require('./account')
	Account = new Account(Database)
	Account.activate(req.params.key)
	let html = require('./public/resetPassword')
	res.send(html);
})

app.post('/resetlink', function (req, res) {
	let Account = require('./account')
	Account = new Account(Database)
	Account.resetLink(req.body.email, ()=>res.end() )
})

app.get('/resetconfirmed/:key', function (req, res) {
	let Account = require('./account')
	Account = new Account(Database)
	Account.checkResetKey(req.params.key, (verify)=>{
		if(verify){
			let html = require('./public/resetPassword')
			html = html(req.params.key)
			res.send(html)
		}
		else{
			res.end()
		}
	})
})

app.post('/resetPassword/:key', function (req, res) { //dla formularza z nowym hasłem
	let Account = require('./account')
	Account = new Account(Database)
	Account.setPassword(req.body.password, req.body.confirmPassword, req.params.key, (data, error)=>{
		res.send({
			data: data,
			error: error
		})	
	})
})

app.listen(3001)
