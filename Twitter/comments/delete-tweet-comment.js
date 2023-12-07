const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const app = express();
app.use(express.json());

// Delete tweet comment route
app.delete("/delete-tweet-comment/:tweetId/:commentId", async (req, res) => {
    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        const userId = authResult.userId;

        // Get the tweet ID and comment ID from the route parameters
        const tweetId = req.params.tweetId;
        const commentId = req.params.commentId;

        // Check if the comment belongs to the authenticated user
        const checkOwnershipQuery = 'SELECT * FROM tweet_comments WHERE tweetId = ? AND id = ? AND userId = ?';
        const checkOwnershipValues = [tweetId, commentId, userId];
        const ownershipCheckResult = await executeQuery(checkOwnershipQuery, checkOwnershipValues);

        if (ownershipCheckResult.length === 0) {
            res.status(403).json({ message: 'Unauthorized access to delete tweet comment' });
            return;
        }

        // If ownership is confirmed, delete the tweet comment
        const deleteCommentQuery = 'DELETE FROM tweet_comments WHERE tweetId = ? AND id = ?';
        const deleteCommentValues = [tweetId, commentId];
        await executeQuery(deleteCommentQuery, deleteCommentValues);

        return res.status(200).json({ message: 'Tweet comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting tweet comment:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the tweet comment', error });
    }
});

// Start the server
app.listen(4000, () => {
    console.log('Server started on port 4000');
});
