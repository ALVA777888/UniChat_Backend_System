const { default: mongoose } = require('mongoose');

const FollowSchema = new mongoose.Schema({
    followerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAccount',
        required: true
    },
    followingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAccount',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Follow', FollowSchema);