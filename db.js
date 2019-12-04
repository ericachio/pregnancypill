const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const URLSlugs = require('mongoose-url-slugs');

// SAMPLE
const Medications = new mongoose.Schema({
  name: String, 
  route: String,
  first: String,
  second: String,
  third: String
});

// LOAD MODELS
mongoose.model('Medications', Medications); 

// db.medications.insert({name : "Nitrofurantoin", route : "PO (mouth)", first : "Caution:Only when no other alternative exists", second : "Safe for use", third : "Safe until 37 weeks, then contraindicated"})
// db.medications.insert({name : "Ibuprofen", route : "PO (mouth)", first : "NOT SAFE", second : "NOT SAFE", third : "NOT SAFE"})
// db.medications.insert({name : "Acetaminophen", route : "PO (mouth)", first : "Safe for use", second : "Safe for use", third : "Safe for use"})
// db.medications.insert({name : "Trimethoprim-Sulfamethoxazole", route : "PO (mouth)", first : "NOT SAFE", second : "NOT SAFE", third : "NOT SAFE"})


//UNSURE IF NEED THIS 
// ---------------------------------------------------

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
  // dbconf = 'mongodb://127.0.0.1:27017/healthinfo';
  dbconf = 'mongodb://erica:721erica@ds251948.mlab.com:51948/healthinfo'
}

// mongoose.connect(dbconf, { useNewUrlParser: true });
// server decpreciated, must add useUnifiedToplogy

// mongoose.connect(dbconf, {useUnifiedTopology: true,  useNewUrlParser: true });

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(dbconf);

// mongoose.connect(dbconf, {useUnifiedTopology: true, useNewUrlParser: true,}).then(() => console.log('DB Connected!')).catch(err => {console.log(Error, err.message)});


// const options = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     autoIndex: false, // Don't build indexes
//     reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
//     reconnectInterval: 500, // Reconnect every 500ms
//     poolSize: 10, // Maintain up to 10 socket connections
//     // If not connected, return errors immediately rather than waiting for reconnect
//     bufferMaxEntries: 0,
//     connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
//     socketTimeoutMS: 45000, 
//     family: 4 // Use IPv4, skip trying IPv6
// };

// mongoose.connect(dbconf,options);
