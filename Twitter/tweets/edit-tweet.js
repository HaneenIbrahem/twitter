const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

// Update tweet route
router.put("/edit-tweet", async (req, res) => {
    const { ID, newDescription, newHashtag, newDate } = req.body;

    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        // const userId = authResult.userId;

        // Check if the tweet with the provided ID exists
        const checkTweetQuery = 'SELECT * FROM tweets WHERE ID = ?';
        const checkTweetValues = [ID];
        const existingTweet = await executeQuery(checkTweetQuery, checkTweetValues);

        if (!existingTweet || existingTweet.length === 0) {
            res.status(404).json({ message: 'Tweet not found' });
            return;
        }

        // Update tweet details
        const updateTweetQuery = 'UPDATE tweets SET description = ?, hashtag = ?, date = ? WHERE ID = ?';
        const updateTweetValues = [newDescription, newHashtag, newDate, ID];
        await executeQuery(updateTweetQuery, updateTweetValues);

        return res.status(200).json({ message: 'Tweet updated successfully' });
    } catch (error) {
        console.error('Error updating tweet:', error);
        return res.status(500).json({ message: 'An error occurred while updating the tweet', error });
    }
});

module.exports = router;
