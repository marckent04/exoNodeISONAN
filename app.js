const http = require('http')
const app = require('express')()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const server = http.createServer(app)
const port = 8090

const db = mysql.createConnection({
	'host' : 'localhost',
	'database' : 'exo',
	'user' : 'root',
	'password' : ''
})

db.connect((err) => {
	if(!err)
		console.log('vous etes bel et bien connectes a la base de donnees')
	else
		console.log(err.message)
})



app.use(bodyParser.urlencoded({ extended: false }))
.use(bodyParser.json())
.set('view engine', 'ejs')
.get('/', (req, res) => {
	res.render('index')
})
.post('/traitement', (req, res) => {
	infos = req.body
	let values = [req.body.nom, req.body.prenoms, req.body.email, req.body.mdp]
	db.query('INSERT INTO users (name, firstname, mail, mdp) values (?, ?, ?, ?)', values, (err, results, fields) => {
		if(!err) {
			let id = results.insertId
			db.query(`SELECT * FROM users WHERE id = ${id}`, (err, results) => {
				if (!err) {
					let infos = results[0]
					res.render('home', {infos})
				} else res.send(err.message)
			})		
			}
		else {
			console.log(err.message)
			res.send('erreur lors de l\'enregistrement des donnees')
		}
	})
})
server.listen(port, (err) => {
	if(!err)
		console.log('serveur operationnel')
	else 
		console.log(err.message)
})
