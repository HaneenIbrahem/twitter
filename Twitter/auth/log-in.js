const express = require('express');
const bcrypt = require('bcrypt');
const generateToken = require('../support/generate-token');
const executeQuery = require('../support/execute-query');

const app = express();
app.use(express.json());

const accessTokenSecret = '1234';
const refreshTokenSecret = '1234';
const refreshTokens = [];

app.post('/log-in', async (req, res) => {
    const {email, password} = req.body;

    try{
        const getUserQuery = 'SELECT * FROM users WHERE email = ?';
        const getUserValues = [email];
        const user = await executeQuery(getUserQuery, getUserValues);

        // If user not found, return error
    if (!user || user.length === 0) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
      }
      // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    // If password is invalid, return error
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    // Password is valid, login successful
    const tokens = generateToken(user[0], accessTokenSecret, refreshTokenSecret);

    // Store the refresh token in memory or database
    refreshTokens.push(tokens.refreshToken);

    res.status(200).json(tokens);


    }catch(error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login' });
      }
});
  
  // Start the server
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });