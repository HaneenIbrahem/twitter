const db = require('./connection');

// Helper function to execute the SQL query
function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
  });
};
module.exports = executeQuery;