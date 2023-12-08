const express = require('express');
const executeQuery = require('../support/execute-query');
const bcrypt = require('bcrypt');
const authenticate = require('./authenticate');

const router = express.Router();

// Change password route
router.put("/change-password", async (req, res) => {
    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        const userId = authResult.userId;

        // Extract the old and new passwords from the request body
        const { oldPassword, newPassword } = req.body;

        // Check if the old password matches the one in the database
        const checkPasswordQuery = 'SELECT password FROM users WHERE ID = ?';
        const checkPasswordValues = [userId];
        const result = await executeQuery(checkPasswordQuery, checkPasswordValues);

        if (result.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const storedPassword = result[0].password;
        const passwordMatch = await bcrypt.compare(oldPassword, storedPassword);

        if (!passwordMatch) {
            res.status(401).json({ message: 'Incorrect old password' });
            return;
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        const updatePasswordQuery = 'UPDATE users SET password = ? WHERE ID = ?';
        const updatePasswordValues = [hashedNewPassword, userId];
        await executeQuery(updatePasswordQuery, updatePasswordValues);

        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ message: 'An error occurred while changing the password', error });
    }
});

module.exports = router;
