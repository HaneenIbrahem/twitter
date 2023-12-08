const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

// Retrieve followers list with paging route
router.get("/followers/:userId", async (req, res) => {
    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        const authenticatedUserID = authResult.userId;

        // Get the user ID whose followers list to retrieve from the route parameter
        const userId = req.params.userId;

        // Get the page and pageSize from query parameters
        const page = req.query.page || 1; // Default to page 1 if not specified
        const pageSize = req.query.pageSize || 10; // Default to 10 followers per page if not specified

        // Calculate the offset based on page number and page size
        const offset = (page - 1) * pageSize;

        // Query to retrieve followers list for the specified user with paging
        const query = `
            SELECT followerId
            FROM followers
            WHERE followingId = ?
            LIMIT ? OFFSET ?
        `;
        const values = [userId, parseInt(pageSize), parseInt(offset)];

        // Execute the query
        const followersList = await executeQuery(query, values);

        // Return the followers list as the API response
        res.status(200).json({ followersList });
    } catch (error) {
        console.error('Error retrieving followers list:', error);
        res.status(500).json({ message: 'An error occurred while retrieving followers list', error });
    }
});

module.exports = router;
