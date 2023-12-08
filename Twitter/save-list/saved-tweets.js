const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

// Retrieve saved tweets with paging route
router.get("/saved-tweets", async (req, res) => {
    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        const authenticatedUserId = authResult.userId;

        // Extract paging parameters from the query string
        const page = req.query.page || 1; // Default to page 1 if not specified
        const pageSize = req.query.pageSize || 10; // Default to 10 tweets per page if not specified

        // Calculate the offset based on page number and page size
        const offset = (page - 1) * pageSize;

        // Query to retrieve saved tweets for the authenticated user with paging
        const query = `
            SELECT tweets.*
            FROM tweets
            INNER JOIN saved_tweets ON tweets.ID = saved_tweets.tweetId
            WHERE saved_tweets.userId = ?
            LIMIT ? OFFSET ?
        `;
        const values = [authenticatedUserId, parseInt(pageSize), parseInt(offset)];

        // Execute the query
        const savedTweets = await executeQuery(query, values);

        // Return the saved tweets as the API response
        res.status(200).json({ savedTweets });
    } catch (error) {
        console.error('Error retrieving saved tweets:', error);
        res.status(500).json({ message: 'An error occurred while retrieving saved tweets', error });
    }
});

module.exports = router;
