const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
let PORT = 3000;


// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

const mysql = require("mysql"); 

const connection= mysql.createConnection({ 
	host: 'localhost', 
	user: 'root', 
	password: "", 
	database: 'demo'
	}); 

connection.connect();

const sql = "SELECT* FROM login"
connection.query(sql, (err, rows) => {
	if(!err) {
		console.log("error reading records : " , err)
		console.log(rows)
	}
})

app.get("/", function (req, res) {
	res.status(200);
	res.send("Welcome to root url server!");
});

app.listen(PORT, (error) => {
	if(!error)
    console.log('Server is running on port '+ PORT);
	else
	console.log("error occured ", error)
  });

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/login.html'));
});

  
app.post('/save', (req, res) => {
	console.log("data", req.body);

	let firstname = req.body.fname;
	let lastname = req.body.lname;
	let email = req.body.email;
	let password = req.body.password;

	if(firstname == '') {
		res.send("firstname is required");
		return;
	}
	else if(lastname == ''){
		res.send("lastname is required");
		return;
	}
	else if (email == '') {
		res.send("email is required");
		return;
	}
	else if (password == '') {
		res.send("password is required");
		return;
	}
	else if(firstname!= '' && lastname!= '' && email!= ''&& password != '') {
		const sqlInsert = "INSERT INTO login(fname, lname, email, password) VALUES (?,?,?,?)";
		connection.query(sqlInsert, [firstname, lastname, email, password], (err, result) => {
			if(err) {
				console.error("error creating record", err);
				return
			}
			//const sql = "SELECT * FROM users ORDER BY id DESC";
			connection.query(sql, (err, rows) => {
				if(err) {
					console.error("error reading records", err);
					return
				}
				res.json(rows);
			})
		})
	}
	else {
		res.send("All fields are required!");
	}
});