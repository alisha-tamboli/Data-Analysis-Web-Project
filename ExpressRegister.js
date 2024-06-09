const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
let PORT = 4400;


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

const sql = "SELECT * FROM `register`"
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

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/register.html'));
});

app.listen(PORT, (error) => {
	if(!error)
    console.log('Server is running on port '+ PORT);
	else
	console.log("error occured ", error)
  });


app.post('/save', (req, res) => {
	console.log("data", req.body);

	let firstname = req.body.fname;
	let lastname = req.body.lname;
	let email = req.body.email;
	let password = req.body.password;
	let confpassword = req.body.confpassword;
	let contact = req.body.mobile;
	let gender = req.body.gender;

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
	else if (confpassword == '') {
		res.send("password is required");
		return;
	}
	else if (contact == '') {
		res.send("contact is required");
		return;
	}
	else if (gender == '') {
		res.send("gender is required");
		return;
	}
	else if(firstname!= '' && lastname!= '' && email!= '' && password != '' && confpassword != ''&& contact != ''&& gender != '') {
		const sql2Insert = "INSERT INTO register(fname, lname, email, password, confpassword, contact, gender) VALUES (?,?,?,?,?,?,?)";
		connection.query(sql2Insert, [firstname, lastname, email, password, confpassword, contact, gender], (err, result) => {
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