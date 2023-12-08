const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

// Retrieve hidden tweets route
router.get("/hidden-tweets/:userId", async (req, res) => {
    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        const userId = authResult.userId;

        // Get the user ID from the route parameter
        const hiddenUserId = parseInt(req.params.userId);

        // Ensure the authenticated user matches the requested user
        if (userId !== hiddenUserId) {
            res.status(403).json({ message: 'Unauthorized access to retrieve hidden tweets' });
            return;
        }

        // Retrieve hidden tweets for the user
        const retrieveHiddenTweetsQuery = `
            SELECT tweets.*
            FROM tweets
            JOIN hidden_tweets ON tweets.ID = hidden_tweets.tweetId
            WHERE hidden_tweets.userId = ?;
        `;

        const hiddenTweets = await executeQuery(retrieveHiddenTweetsQuery, [userId]);

        // Return the hidden tweets as the API response
        res.status(200).json({ hiddenTweets });
    } catch (error) {
        console.error('Error retrieving hidden tweets:', error);
        res.status(500).json({ message: 'An error occurred while retrieving hidden tweets', error });
    }
});

module.exports = router;
