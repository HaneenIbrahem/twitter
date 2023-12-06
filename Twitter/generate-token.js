const jwt = require('jsonwebtoken');

// Function to generate token
function generateToken(user, accessTokenSecret, refreshTokenSecret) {
  const accessTokenPayload = {
    sub: user.id,
    email: user.email,
    type: 'access'
  };
  const refreshTokenPayload = {
    sub: user.id,
    type: 'refresh'
  };
  // const secret = process.env.SECRET;
  const accessTokenOptions = {
    expiresIn: '30m',
  };
  const refreshTokenOptions = {
    expiresIn: '7d',
  };
  // generates the access and refresh token using the jwt.sign method
  const accessToken = jwt.sign(accessTokenPayload, accessTokenSecret, accessTokenOptions);
  const refreshToken = jwt.sign(refreshTokenPayload, refreshTokenSecret, refreshTokenOptions);
  return {
    accessToken,
    refreshToken,
  };
}

module.exports = generateToken;