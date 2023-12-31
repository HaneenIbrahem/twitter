const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const router = express.Router();

router.post("/add-tweet", async (req, res) => {
    const {userId, description, hashtag, date } = req.body;

    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        // const userId = authResult.userId;

        const insertQuery = 'INSERT INTO tweets (userId, description, hashtag, date) VALUES (?, ?, ?, ?)';
        const insertValues = [userId, description, hashtag, date];
        await executeQuery(insertQuery, insertValues);

        return res.status(200).json({ message: 'Tweet created successfully' });
    } catch (error) {
        console.error('Error creating tweet:', error);
        return res.status(500).json({ message: 'An error occurred while creating the tweet', error });
    }
});

module.exports = router;