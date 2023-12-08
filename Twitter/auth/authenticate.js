const jwt = require('jsonwebtoken');

function authenticate(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return { statusCode: 401, message: 'Authorization token missing' };
  }

  try {
    const decodedToken = jwt.verify(token, '1234');
    console.log('Decoded Token:', decodedToken);
    const userId = decodedToken.sub; 

    return { statusCode: 200, userId };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { statusCode: 401, message: 'Token expired' };
    } else {
      return { statusCode: 401, message: 'Invalid or expired token' };
    }
  }
}

module.exports = authenticate;
