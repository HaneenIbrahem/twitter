const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

// Add comment to tweet route
router.post("/add-comment", async (req, res) => {
    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        const userId = authResult.userId;

        // Extract comment details from the request body
        const { tweetId, comment } = req.body;

        // Insert the comment into the database
        const insertCommentQuery = 'INSERT INTO tweet_comments (tweetId, userId, comment) VALUES (?, ?, ?)';
        const insertCommentValues = [tweetId, userId, comment];
        await executeQuery(insertCommentQuery, insertCommentValues);

        return res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ message: 'An error occurred while adding the comment', error });
    }
});
module.exports = router;