const fetch = require('node-fetch');
const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',      
  user: 'root',   
  password: '',  
  database: 'perimattic'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');

  // Fetch JSON data from the API
  fetch('https://api.publicapis.org/entries')
    .then(response => response.json())
    .then(data => {
      // Assuming the JSON response has an array of entries stored in 'data.entries'
      const entries = data.entries;

      // Insert each entry into the MySQL database
      entries.forEach(entry => {
        const { API,Description,Auth,HTTPS,Cors,Link,Category } = entry;

        const insertQuery = 'INSERT INTO api_data (api,description,auth,https,cors,link,category) VALUES (?,?,?,?,?,?,?)';
        const values = [API,Description,Auth,HTTPS,Cors,Link,Category];

        connection.query(insertQuery, values, (err, result) => {
          if (err) {
            console.error('Error inserting data:', err);
            return;
          }
          console.log('Data inserted successfully');
        });
      });
    })
    .catch(error => {
      console.error('Error fetching JSON data:', error);
    })
    .finally(() => {
      // Close the database connection
      connection.end((err) => {
        if (err) {
          console.error('Error closing connection:', err);
          return;
        }
        console.log('Connection closed');
      });
    });
});