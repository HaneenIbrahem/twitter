const express = require('express');
const bcrypt = require('bcrypt');
const executeQuery = require('../support/execute-query');


const app = express();

app.use(express.json());

// Validate email format using regex
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

app.post('/sign-up', async (req, res) => {
  const { username, email, password, confirmPassword} = req.body;

  try {

    // Validate the email format
    if (!isValidEmail(email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
      }
      
    // Compare the password and confirmPassword
    if (password !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match' });
      return;
    }

     // Check if the email already exists
     const emailExistsQuery = 'SELECT * FROM users WHERE email = ?';
     const emailExistsValues = [email];
     const emailExistsResult = await executeQuery(emailExistsQuery, emailExistsValues);
     if (emailExistsResult.length > 0) {
       res.status(400).json({ message: 'Email already exists' });
       return;
     }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedonfirmPassword = await bcrypt.hash(confirmPassword, 10);

    // Insert the user into the database
    const insertQuery = 'INSERT INTO users (username, email, password, confirm_password) VALUES (?, ?, ?, ?)';
    const insertValues = [username, email, hashedPassword, hashedonfirmPassword];
    await executeQuery(insertQuery, insertValues);

    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ message: 'Username already exists' });
    } else {
        console.error('Sign-up error:', error);
        res.status(500).json({ message: 'An error occurred during sign-up' });
    }
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});


