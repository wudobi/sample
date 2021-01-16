const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 8001
const access_token = "secret"

app.use(express.static('public'))
app.use(bodyParser.json())

/**
 * 인증 미들웨어
 */
function ensureAuthentication() {
	return (req, res, next) => {
		console.log(req.headers)
		console.log(req.headers.authorization)

		if(!req.headers.authorization) { // authorization 값이 없으면 401
			res.status(401)
			throw Error('No Authorization header')
		}
		
		if(req.headers.authorization !== 'Bearer '+access_token) { // authorization 값이 secret이 아니면 401
			res.status(401)
			throw Error('No Authorization header')
		}

		next()
	}
}

app.get('/api', ensureAuthentication(), (req, res) => {
	res.json({
		message: 'success'
	})
})

app.get('/login', (req, res) => {
	res.json({
		access_token: access_token
	})
})

app.use((err, req, res, next) => {
	// console.log(err)
	res.json({error: err.message})
})

app.listen(port, () => console.log(`authentication example server is running on ${port}`))