// app.js
const express = require('express');
const app = express();
const mysql = require('mysql');
const authController = require('./controller/authController');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'BD_PFE',
  });
  



app.use(express.json());
app.use(authController);




// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



module.exports.db = db;
module.exports.app = app;
