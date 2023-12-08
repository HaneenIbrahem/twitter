const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

// Add tweet to saved list route
router.post("/add-to-saved/:userId", async (req, res) => {
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
        const savedUserId = parseInt(req.params.userId);

        // Ensure the authenticated user matches the requested user
        if (userId !== savedUserId) {
            res.status(403).json({ message: 'Unauthorized access to add tweet to saved list' });
            return;
        }

        // Extract the tweet ID from the request body
        const { tweetId } = req.body;

        // Check if the tweet is already saved
        const checkQuery = 'SELECT * FROM saved_tweets WHERE userId = ? AND tweetId = ?';
        const checkValues = [userId, tweetId];
        const existingSavedTweet = await executeQuery(checkQuery, checkValues);

        if (existingSavedTweet.length > 0) {
            res.status(400).json({ message: 'Tweet is already saved' });
            return;
        }

        // Insert the record into the saved_tweets table
        const insertQuery = 'INSERT INTO saved_tweets (userId, tweetId) VALUES (?, ?)';
        const insertValues = [userId, tweetId];
        await executeQuery(insertQuery, insertValues);

        res.status(200).json({ message: 'Tweet added to saved list successfully' });
    } catch (error) {
        console.error('Error adding tweet to saved list:', error);
        res.status(500).json({ message: 'An error occurred while adding tweet to saved list', error });
    }
});

module.exports = router;
