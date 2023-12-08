const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

// Unhide tweet route
router.delete("/unhide-tweet/:tweetId", async (req, res) => {
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

        // Check if the tweet is hidden by the user
        const checkHiddenQuery = 'SELECT * FROM hidden_tweets WHERE userId = ? AND tweetId = ?';
        const checkHiddenResult = await executeQuery(checkHiddenQuery, [userId, tweetId]);

        if (checkHiddenResult.length === 0) {
            res.status(400).json({ message: 'Tweet is not hidden by the user' });
            return;
        }

        // Unhide the tweet for the user
        const unhideTweetQuery = 'DELETE FROM hidden_tweets WHERE userId = ? AND tweetId = ?';
        await executeQuery(unhideTweetQuery, [userId, tweetId]);

        // Return success message
        res.status(200).json({ message: 'Tweet unhidden successfully' });
    } catch (error) {
        console.error('Error unhiding tweet:', error);
        res.status(500).json({ message: 'An error occurred while unhiding the tweet', error });
    }
});

module.exports = router;
