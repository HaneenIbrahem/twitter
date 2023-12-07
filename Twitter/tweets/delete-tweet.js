const express = require('express');
const executeQuery = require('../support/execute-query');
const authenticate = require('../auth/authenticate');

const app = express();
app.use(express.json());

app.delete("/delete-tweet", async (req, res) => {
    const ID = req.body.ID;

    try {
        // Authenticate the request
        const authResult = authenticate(req);
        if (authResult.statusCode !== 200) {
            res.status(authResult.statusCode).json({ message: 'Authentication failed' });
            return;
        }

        // Access the authenticated user's information
        // const userId = authResult.userId;

        const deleteQuery = 'DELETE FROM tweets WHERE ID = ?'; 
        const deleteValues = [ID];
        await executeQuery(deleteQuery, deleteValues);

        return res.status(200).json({ message: 'Tweet deleted successfully' });
    } catch (error) {
        console.error('Error deleting tweet:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the tweet', error });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
