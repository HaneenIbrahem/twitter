const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

// Retrieve following list with paging route
router.get("/following/:userId", async (req, res) => {
    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        const authenticatedUserID = authResult.userId;

        // Get the user ID whose following list to retrieve from the route parameter
        const userId = req.params.userId;

        // Get the page and pageSize from query parameters
        const page = req.query.page || 1; // Default to page 1 if not specified
        const pageSize = req.query.pageSize || 10; // Default to 10 following per page if not specified

        // Calculate the offset based on page number and page size
        const offset = (page - 1) * pageSize;

        // Query to retrieve following list for the specified user with paging
        const query = `
            SELECT followingId
            FROM followers
            WHERE followerId = ?
            LIMIT ? OFFSET ?
        `;
        const values = [userId, parseInt(pageSize), parseInt(offset)];

        // Execute the query
        const followingList = await executeQuery(query, values);

        // Return the following list as the API response
        res.status(200).json({ followingList });
    } catch (error) {
        console.error('Error retrieving following list:', error);
        res.status(500).json({ message: 'An error occurred while retrieving following list', error });
    }
});

module.exports = router;
