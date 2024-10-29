const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    pinned: Boolean,
    // likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // reSharedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // reSgaredtData: { type: Schema.Types.ObjectId, ref: 'Post' },
    // replyTo: { type: Schema.Types.ObjectId, ref: 'Post' },
    // pinned: Boolean
});
PostSchema.pre(/^find/, function (next) {
    this.populate({
        path: "postedBy",
        select: "-__v -password"
    })
    next()
})
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;