const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('./authenticate');

const app = express();
app.use(express.json());

// Retrieve user info route
app.get("/user-info/:userId", async (req, res) => {
    try {
        // Authenticate the request if needed
        // const authResult = authenticate(req);
        // if (authResult.statusCode !== 200) {
        //     res.status(authResult.statusCode).json({ message: 'Authentication failed' });
        //     return;
        // }

        // Access the authenticated user's information if needed
        // const authenticatedUserID = authResult.userID;

        // Get the user ID from the route parameter
        const userId = req.params.userId;

        // Fetch user information
        const getUserInfoQuery = 'SELECT * FROM users WHERE ID = ?';
        const getUserInfoValues = [userId];
        const userInfo = await executeQuery(getUserInfoQuery, getUserInfoValues);

        if (!userInfo || userInfo.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optionally, you can exclude sensitive information before sending the response
        const sanitizedUserInfo = {
            ID: userInfo[0].ID,
            username: userInfo[0].username,
            email: userInfo[0].email
        };

        return res.status(200).json(sanitizedUserInfo);
    } catch (error) {
        console.error('Error retrieving user info:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving user info', error });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
