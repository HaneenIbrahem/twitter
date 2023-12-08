const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

// Unfollow user route
router.post("/unfollow/:userIdToUnfollow", async (req, res) => {
    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        const authenticatedUserID = authResult.userId;

        // Get the user ID to unfollow from the route parameter
        const userIdToUnfollow = req.params.userIdToUnfollow;

        const unfollowQuery = 'DELETE FROM followers WHERE followerId = ? AND followingId = ?';
        const unfollowValues = [authenticatedUserID, userIdToUnfollow];
        await executeQuery(unfollowQuery, unfollowValues);

        return res.status(200).json({ message: 'Unfollowed user successfully' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return res.status(500).json({ message: 'An error occurred while unfollowing user', error });
    }
});

module.exports = router;
