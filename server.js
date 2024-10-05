const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

app.use(express.json());
app.use(cors());
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME 
});

db.connect((err) =>{
   if(err) return console.log("Error connecting to MYSQL");

   console.log("Connected to MYSQL as id:" , db.threadId)
})

app.set('view engine', 'ejs')
app.set('views' , __dirname + '/views')

// Question 1
app.get('/patients', (req, res) => {
   db.query('SELECT * FROM patients', (err, results) => {
     if (err) {
       console.error(err);
       res.status(500).send('Error retrieving patient data');
     } else {
       // Render the patients.ejs view with the patient data
       res.render('patients', { patients: results });
     }
   });
 });
 
 // Question 2
 app.get('/providers', (req, res) => {
   db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
     if (err) {
       console.error(err);
       res.status(500).send('Error retrieving provider data');
     } else {
       // Render the providers.ejs view with the provider data
       res.render('providers', { providers: results });
     }
   });
 });
 

// Question 3
app.get('/patients', (req, res) => {
  const firstName = req.query.first_name;
  if (!firstName) {
    return res.status(400).send('First name is required')
  }

  const patientQuery = 'SELECT * FROM patients WHERE first_name = ?';

  db.query(patientQuery, [firstName], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving patient data');
    } else {
      res.json(results);
    }
  })
})


// Question 4
app.get('/providers', (req, res) => {
  const specialty = req.query.specialty;

  if(!specialty) {
    return res.status(400).send('Specialty is required');
  }

  const providerQuery = 'SELECT * FROM  providers WHERE specialty = ?';

  db.query(providerQuery, [specialty], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving provider data');
    } else {
      res.json(results);
    }
  })
})



// listen to the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost: ${process.env.PORT}`);

  console.log('Sending message to browser...');
  app.get('/', (req,res) => {
   res.send('Server Started Successfully!')
  });
});