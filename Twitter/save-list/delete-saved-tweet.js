const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

// Delete tweet from saved list route
router.delete("/delete-saved-tweet/:tweetId", async (req, res) => {
    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        const authenticatedUserId = authResult.userId;

        // Get the tweet ID from the route parameter
        const tweetId = req.params.tweetId;

        // Delete the tweet from the saved list in the database
        const deleteSavedTweetQuery = 'DELETE FROM saved_tweets WHERE userId = ? AND tweetId = ?';
        const deleteSavedTweetValues = [authenticatedUserId, tweetId];

        // Perform the database delete
        await executeQuery(deleteSavedTweetQuery, deleteSavedTweetValues);

        return res.status(200).json({ message: 'Tweet deleted from saved list successfully' });
    } catch (error) {
        console.error('Error deleting tweet from saved list:', error);
        return res.status(500).json({ message: 'An error occurred while deleting tweet from saved list', error });
    }
});

module.exports = router;
