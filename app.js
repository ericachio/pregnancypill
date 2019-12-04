require('./db');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

var dateFormat = require('dateformat');

// ---------------------------------------------------

const $ = require('jquery');
var request = require("request");

// ---------------------------------------------------

const app = express();
const mongoose = require('mongoose');

// mongoose.Promise = global.Promise

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

const Medications = mongoose.model('Medications');

// ---------------------------------------------------

//autocalculate trimester from expected due date
// first trimestser is week 1 - 12 (1 - 84 days) 196 + 279 days
// second trimester is week 13 - 26 (85 - 182 days) 98 - 195 days 
// third trimester is week 27 - due date (week40) (183 days - 280) -97days backwards

let today = new Date();

app.get('/', (req, res) => {
	let p = [];
	let tempP = {};
	Medications.find({}, (err, resultOfQuery) => {
  		resultOfQuery.forEach((roq) => {
    		// console.log(roq.name);
			tempP = {
				name: roq.name
			};
			p.push(tempP);
			// console.log(p)

		});
		res.render('index', {medicate: p});
	});
});

app.post('/', (req, res) => {
	let inputDate = new Date(req.body.dueDate);
	let trimester = calculateTrimester(inputDate, today);
	let med = req.body.med;
	let p = [];
	let tempP = {};
	Medications.find({}, (err, resultOfQuery) => {
  		resultOfQuery.forEach((roq) => {
    		// console.log(roq.name);
			tempP = {
				name: roq.name
			};
			p.push(tempP);
			// console.log(p)

		});
		Medications.findOne({"name" : med} , (err, resultOfQuery) =>{
			if (resultOfQuery === null || undefined){
				let m = "empty";
				res.render('index',  {trimester: trimester, message: m});
			} else{ //need to change to correct trimester
				let tmessage = "You are in your ";
				let mmessage = "The medication you selected is ";
				let resultMessage = "The recommendation is ";
				
				if (trimester === "First Trimester"){
					res.render('index', {m1 : tmessage, m2: mmessage, m3: resultMessage, inputMed: med, trimester: trimester, warning: resultOfQuery.first, medicate: p});
				}else if(trimester === "Second Trimester"){
					res.render('index', {m1 : tmessage, m2: mmessage, m3: resultMessage, inputMed: med, trimester: trimester, warning: resultOfQuery.second, medicate: p});
				}else if(trimester === "Third Trimestser"){
					res.render('index', {m1 : tmessage, m2: mmessage, m3: resultMessage, inputMed: med, trimester: trimester, warning: resultOfQuery.third, medicate: p});
				}
				
			}
		
		});
	});
	
	// res.render('index', {trimester: trimester});
});


function calculateTrimester(inputDate, today){
	diffDays = Math.ceil((Math.abs(inputDate - today)) / (1000 * 60 * 60 * 24));
	if (diffDays >= 196){ //&& diffDays <= 279
		return "First Trimester" ;
	}else if (diffDays >= 98 && diffDays <= 195){
		return "Second Trimester" ;
	}else if (diffDays <= 97) {
		return "Third Trimestser";
	}
}

function stringYear(){
	let minYear = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
	return minYear;
}



app.listen(process.env.PORT || 3000);

