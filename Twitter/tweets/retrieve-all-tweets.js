const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const app = express();
app.use(express.json());

// Retrieve paginated tweets route
app.get("/tweets", async (req, res) => {
    try {
        // Authenticate the request if needed
        // const authResult = authenticate(req);
        // if (authResult.statusCode !== 200) {
        //     res.status(authResult.statusCode).json({ message: 'Authentication failed' });
        //     return;
        // }

        // Access the authenticated user's information if needed
        // const authenticatedUserID = authResult.userID;

        // Get query parameters for pagination
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Calculate the offset based on page number and page size
        const offset = (page - 1) * pageSize;

        // Fetch paginated tweets
        const getPaginatedTweetsQuery = 'SELECT * FROM tweets LIMIT ? OFFSET ?';
        const getPaginatedTweetsValues = [pageSize, offset];
        const paginatedTweets = await executeQuery(getPaginatedTweetsQuery, getPaginatedTweetsValues);

        // Optionally, filter tweets based on the authenticated user if needed
        // const userTweets = paginatedTweets.filter(tweet => tweet.userID === authenticatedUserID);

        return res.status(200).json(paginatedTweets);
    } catch (error) {
        console.error('Error retrieving paginated tweets:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving paginated tweets', error });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
