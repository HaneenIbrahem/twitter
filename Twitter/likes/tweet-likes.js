const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const app = express();
app.use(express.json());

// Retrieve tweet likes with paging route
app.get("/tweet-likes/:tweetId", async (req, res) => {
    try {
        const tweetId = req.params.tweetId;
        const page = req.query.page || 1; // Default to page 1 if not specified
        const pageSize = req.query.pageSize || 10; // Default to 10 likes per page if not specified

        // Calculate the offset based on page number and page size
        const offset = (page - 1) * pageSize;

        // Query to retrieve likes for the specified tweet with paging
        const query = 'SELECT * FROM tweet_likes WHERE tweetId = ? LIMIT ? OFFSET ?';
        const values = [tweetId, parseInt(pageSize), parseInt(offset)];

        // Execute the query
        const likes = await executeQuery(query, values);

        // Return the likes as the API response
        res.status(200).json({ likes });
    } catch (error) {
        console.error('Error retrieving tweet likes:', error);
        res.status(500).json({ message: 'An error occurred while retrieving tweet likes', error });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
