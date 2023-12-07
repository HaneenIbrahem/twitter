const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const app = express();
app.use(express.json());

// Like tweet route
app.post("/like-tweet/:tweetId", async (req, res) => {
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
        const checkLikeQuery = 'SELECT * FROM tweet_likes WHERE tweetId = ? AND userId = ?';
        const checkLikeValues = [tweetId, userId];
        const existingLike = await executeQuery(checkLikeQuery, checkLikeValues);

        if (existingLike.length > 0) {
            res.status(400).json({ message: 'You have already liked this tweet' });
            return;
        }

        // If the user hasn't liked the tweet, insert a new like record
        const insertLikeQuery = 'INSERT INTO tweet_likes (tweetId, userId) VALUES (?, ?)';
        const insertLikeValues = [tweetId, userId];
        await executeQuery(insertLikeQuery, insertLikeValues);

        return res.status(200).json({ message: 'Tweet liked successfully' });
    } catch (error) {
        console.error('Error liking tweet:', error);
        return res.status(500).json({ message: 'An error occurred while liking the tweet', error });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
