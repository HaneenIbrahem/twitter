const express = require('express');
const app = express();

const changePasswordRoute = require('./auth/change-password');
const editUserInformationRoute = require('./auth/edit-user-information');
const loginRoute = require('./auth/log-in');
// const logoutRoute = require('./auth/logout');
const retrieveUserInformationRoute = require('./auth/retrieve-user-information');
const signupRoute = require('./auth/sign-up');
const addCommentRoute = require('./comments/add-comment');
const deleteTweetCommentRoute = require('./comments/delete-tweet-comment');
const tweetCommentsRoute = require('./comments/tweet-comments');
const followUserRoute = require('./followers/follow-user');
const followersListRoute = require('./followers/followers_list');
const followingListRoute = require('./followers/following-list');
const unfollowUserRoute = require('./followers/unfollow-user');
const hiddenTweetsRoute = require('./hide-list/hidden-tweets');
const hideTweetRoute = require('./hide-list/hide-tweet');
const unhideTweetRoute = require('./hide-list/unhide-tweet');
const likeTweetRoute = require('./likes/like-tweet');
const tweetLikesRoute = require('./likes/tweet-likes');
const unlikeTweetRoute = require('./likes/unlike-tweet');
const addToSaveRoute = require('./save-list/add-to-saved');
const deleteSavedTweetRoute = require('./save-list/delete-saved-tweet');
const savedTweetsRoute = require('./save-list/saved-tweets');
const addTweetRoute = require('./tweets/add-tweet');
const deleteTweetRoute = require('./tweets/delete-tweet');
const editTweetRoute = require('./tweets/edit-tweet');
const retrieveAllTweetsRoute = require('./tweets/retrieve-all-tweets');
const retrieveSpecificUserTweetRoute = require('./tweets/retrieve-specific-user-tweets');

app.use(express.json());

app.use('/api', changePasswordRoute);
app.use('/api', editUserInformationRoute);
app.use('/api', loginRoute);
// app.use('/api', logoutRoute);
app.use('/api', retrieveUserInformationRoute);
app.use('/api', signupRoute);
app.use('/api', addCommentRoute);
app.use('/api', deleteTweetCommentRoute);
app.use('/api', tweetCommentsRoute);
app.use('/api', followUserRoute);
app.use('/api', followersListRoute);
app.use('/api', followingListRoute);
app.use('/api', unfollowUserRoute);
app.use('/api', hiddenTweetsRoute);
app.use('/api', hideTweetRoute);
app.use('/api', unhideTweetRoute);
app.use('/api', likeTweetRoute);
app.use('/api', tweetLikesRoute);
app.use('/api', unlikeTweetRoute);
app.use('/api', addToSaveRoute);
app.use('/api', deleteSavedTweetRoute);
app.use('/api', savedTweetsRoute);
app.use('/api', addTweetRoute);
app.use('/api', deleteTweetRoute);
app.use('/api', editTweetRoute);
app.use('/api', retrieveAllTweetsRoute);
app.use('/api', retrieveSpecificUserTweetRoute);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
