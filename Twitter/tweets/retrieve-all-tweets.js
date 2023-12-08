const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

// Retrieve paginated tweets route
router.get("/tweets", async (req, res) => {
    try {
        // Authenticate the request if needed
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

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

        return res.status(200).json(paginatedTweets);
    } catch (error) {
        console.error('Error retrieving paginated tweets:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving paginated tweets', error });
    }
});

module.exports = router;
