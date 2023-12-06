// authenticate.js

const jwt = require('jsonwebtoken');

function authenticate(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return { statusCode: 401, message: 'Authorization token missing' };
  }

  try {
    const decodedToken = jwt.verify(token, '1234');
    const userId = decodedToken.userId;

    return { statusCode: 200, userId }; // Include userId in the authentication result
  } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return { statusCode: 401, message: 'Token expired' };
      } else {
        return { statusCode: 401, message: 'Invalid or expired token' };
      }  
    }
}

module.exports = authenticate;
