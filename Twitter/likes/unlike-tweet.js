const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const app = express();
app.use(express.json());

app.delete("/unlike-tweet/:tweetId", async (req, res) => {
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

        // Check if the user has already liked the tweet
        const checkLikeQuery = 'SELECT * FROM tweet_likes WHERE userId = ? AND tweetId = ?';
        const checkLikeValues = [userId, tweetId];
        const existingLike = await executeQuery(checkLikeQuery, checkLikeValues);

        if (!existingLike || existingLike.length === 0) {
            return res.status(404).json({ message: 'Tweet not liked by the user' });
        }

        // Unlike the tweet
        const unlikeQuery = 'DELETE FROM tweet_likes WHERE userId = ? AND tweetId = ?';
        const unlikeValues = [userId, tweetId];
        await executeQuery(unlikeQuery, unlikeValues);

        return res.status(200).json({ message: 'Tweet unliked successfully' });
    } catch (error) {
        console.error('Error unliking tweet:', error);
        return res.status(500).json({ message: 'An error occurred while unliking the tweet', error });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
