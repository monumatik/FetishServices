var express = require('express')
var app = express()
var cors = require('cors')
const path = require('path');

var Database = require('./app')
var Database = new Database()
Database.syncDatabase()
var Account = require('./account')
Account = new Account(Database)


var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json())


app.post('/register', function (req, res) {
	Account.createAccount({
		login: req.body.login, 
		password: req.body.password, 
		email: req.body.email
	},
	(_object)=>{
		res.send({
			data: _object.data, 
			error: _object.error
		})
	})
})

app.post('/login', function(req, res) {
	if('login' in req.body && 'password' in req.body){
		Account.login({
			login: req.body.login, 
			password: req.body.password
		},
		(_object)=>{
			res.send({
				data: _object.data,
				error: _object.error
			})
		})
	}else{
		res.status(400)
		res.end();
	}
	
})

app.get('/activate/:key', function (req, res) {
	Account.activate(req.params.key)
	let html = require('./public/activationLink')
	res.send(html);
})

app.post('/resetlink', function (req, res) {
	let Account = require('./account')
	Account = new Account(Database)
	Account.resetLink(req.body.email, ()=>res.end() )
})

app.get('/resetconfirmed/:key', function (req, res) {
	if('key' in req.params){
		Account.checkResetKey(req.params.key, (verify)=>{
			if(verify){
				let html = require('./public/resetPassword')
				html = html(req.params.key)
				res.send(html)
			}
			else{
				res.status=401
				res.end()
			}
		})
	}else{
		res.status=400
		res.end()
	}
})

app.post('/resetPassword/:key', function (req, res) {
	if('password' in req.body && 'confirmPassword' in req.body && 'key' in req.params){
		Account.setPassword(req.body.password, req.body.confirmPassword, req.params.key, (data, error)=>{
			res.send({
				data: data,
				error: error
			})	
		})
	}else{
		res.status = 400
		res.end();
	}
	
})

app.post('/getFetish', function (req, res) {
	if('token' in req.body){
		Account.getFetish({
			token: req.body.token
		},
		(_object)=>{
			res.send({
				data: _object.data,
				error: _object.error
			})
		})
	}else{
		res.status = 400
		res.end();
	}
})

app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'))
app.listen(3001, '0.0.0.0')
