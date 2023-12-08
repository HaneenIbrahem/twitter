const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

// Follow user route
router.post("/follow/:userIdToFollow", async (req, res) => {
    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        const followerId = authResult.userId;

        // Get the user ID to follow from the route parameter
        const followingId = req.params.userIdToFollow;

        // Check if the user is trying to follow themselves
        if (followerId === followingId) {
            res.status(400).json({ message: 'Cannot follow yourself' });
            return;
        }

        // Check if the follow relationship already exists
        const checkFollowQuery = 'SELECT * FROM followers WHERE followerId = ? AND followingId = ?';
        const checkFollowValues = [followerId, followingId];
        const existingFollow = await executeQuery(checkFollowQuery, checkFollowValues);

        if (existingFollow.length > 0) {
            res.status(400).json({ message: 'You are already following this user' });
            return;
        }

        // Create a new follow relationship
        const followQuery = 'INSERT INTO followers (followerId, followingId) VALUES (?, ?)';
        const followValues = [followerId, followingId];
        await executeQuery(followQuery, followValues);

        res.status(200).json({ message: 'You are now following the user' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ message: 'An error occurred while following the user', error });
    }
});

module.exports = router;
