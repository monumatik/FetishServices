var express = require('express')
var app = express()
var cors = require('cors')

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
	var Register = require('./register')
	Register = new Register(req.body.login, req.body.password, req.body.email, req.body.sex)
	const result = Register.createAccount(Database, (result, error)=>{
		res.send({
			data: result,
			error: error
		})
		res.end()
	})
	
})

app.get('/activate/:key', function (req, res) {
	let Activate = require('./activateAccount')
	Activate = new Activate(Database)
	Activate.activate(req.params.key)
		
		res.send({
			data: 'ciapong'
		})
})

app.listen(3001)
