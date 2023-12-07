const mysql = require('mysql');

// Create MySQL connection pool
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "twitter",
});

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    // If there is no error --> 
    console.log("Connection established!");
});

// Export the connection for use in other modules
module.exports = db;