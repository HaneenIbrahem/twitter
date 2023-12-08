const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();
// Retrieve specific user tweets route
router.get("/user-tweets/:userId", async (req, res) => {
    try {
        // Authenticate the request if needed
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information if needed
        // const authenticatedUserID = authResult.userID;

        // Get the user ID from the route parameter
        const userId = req.params.userId;

        // Get query parameters for pagination
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Calculate the offset based on page number and page size
        const offset = (page - 1) * pageSize;

        // Fetch paginated tweets for the specific user
        const getUserTweetsQuery = 'SELECT * FROM tweets WHERE userID = ? LIMIT ? OFFSET ?';
        const getUserTweetsValues = [userId, pageSize, offset];
        const userTweets = await executeQuery(getUserTweetsQuery, getUserTweetsValues);

        return res.status(200).json(userTweets);
    } catch (error) {
        console.error('Error retrieving user tweets:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving user tweets', error });
    }
});

module.exports = router;
