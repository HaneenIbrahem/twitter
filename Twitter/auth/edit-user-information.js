const express = require('express');
const executeQuery = require('../support/execute-query');
const bcrypt = require('bcrypt');
const authenticate = require('./authenticate');

const app = express();
app.use(express.json());

// Edit user info route
app.put("/edit-user/:userId", async (req, res) => {
    try {
        // Authenticate the request
        const authResult = authenticate(req);
        console.log('authResult:', authResult);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        // const authenticatedUserID = authResult.userId;

        // Get the user ID from the route parameter
        const userId = req.params.userId;

        // console.log("authenticatedUserID " + authenticatedUserID)
        // console.log("userId " + userId)

        // Ensure the authenticated user matches the requested user
        // if (authenticatedUserID !== userId) {
        //     res.status(403).json({ message: 'Unauthorized access to edit user information' });
        //     return;
        // }

        // Extract the fields to be updated from the request body
        const { username, email, newPassword } = req.body;

        // Check if the user wants to update the password
        let updatePasswordQuery = '';
        let updatePasswordValues = [];
        if (newPassword) {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the password in the database
            updatePasswordQuery = 'UPDATE users SET password = ? WHERE ID = ?';
            updatePasswordValues = [hashedPassword, userId];
        }

        // Update other fields in the database
        const updateUserInfoQuery = 'UPDATE users SET username = ?, email = ? WHERE ID = ?';
        const updateUserInfoValues = [username, email, userId];

        // Perform the database updates
        await executeQuery(updatePasswordQuery, updatePasswordValues);
        await executeQuery(updateUserInfoQuery, updateUserInfoValues);

        return res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
        console.error('Error editing user info:', error);
        return res.status(500).json({ message: 'An error occurred while editing user info', error });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
