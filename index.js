const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  allowedHeaders: '*'
}));

const connection = mysql.createConnection({
  host: 'mysql-wlo.cp7obf8hiand.ap-southeast-1.rds.amazonaws.com',
  user: 'admin',
  password: '6oKH6o73*QQU',
  database: 'information'
});


connection.connect();

app.post('/api/insertData', (req, res) => {
  const { firstname, lastname, email, password, address, phone } = req.body;

  const query = 'INSERT INTO user_info ( firstname, lastname, email, password , address, phone) VALUES (?, ?, ?, ? , ?, ?)';
  const values = [ firstname, lastname, email, password, address, phone];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ message: 'Error inserting data' });
    } else {
      const insertedData = {
        id: results.insertId, // Assuming 'id' is the auto-increment primary key
        firstname,
        lastname,
        email,
        address,
        phone
      };
      res.status(200).json({ message: 'Data inserted successfully', data: insertedData });
    }
  });
});

app.post('/api/login', (req, res) => {
  const { email , password } = req.body;

  const query = 'SELECT * FROM user_info WHERE email = ? AND password = ?';
  const values = [email, password];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ message: 'Error querying database' });
    } else {
      if (results.length > 0) {
        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ success: false });
      }
    }
  });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
