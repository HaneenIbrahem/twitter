const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

// Hide tweet route
router.post("/hide-tweet/:tweetId", async (req, res) => {
    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        const userId = authResult.userId;

        // Get the tweet ID from the route parameter
        const tweetId = req.params.tweetId;

        // Check if the tweet is already hidden by the user
        const checkHiddenQuery = 'SELECT * FROM hidden_tweets WHERE userId = ? AND tweetId = ?';
        const checkHiddenResult = await executeQuery(checkHiddenQuery, [userId, tweetId]);

        if (checkHiddenResult.length > 0) {
            res.status(400).json({ message: 'Tweet already hidden by the user' });
            return;
        }

        // Hide the tweet for the user
        const hideTweetQuery = 'INSERT INTO hidden_tweets (userId, tweetId) VALUES (?, ?)';
        await executeQuery(hideTweetQuery, [userId, tweetId]);

        // Return success message
        res.status(200).json({ message: 'Tweet hidden successfully' });
    } catch (error) {
        console.error('Error hiding tweet:', error);
        res.status(500).json({ message: 'An error occurred while hiding the tweet', error });
    }
});

module.exports = router;
