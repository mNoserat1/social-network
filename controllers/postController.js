
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Post = require("../models/postModel");

exports.getAllPosts = catchAsync(async (req, res) => {


    const posts = await Post.find()
    res.status(200).json({
        status: 'success',
        data: {
            data: posts
        }
    });

})

exports.createPost = catchAsync(async (req, res) => {
    // set the user id for th post creation
    const userID = req.user._id


    req.body.postedBy = userID
    const newPost = await Post.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: newPost
        }
    });

})

exports.deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});



exports.getOne = catchAsync(async (req, res, next) => {
    // let query = Model.findById(req.params.id);
    // if (popOptions) query = query.populate(popOptions);
    // const doc = await query;
    const post = await Post.findById(req.params.id)
    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: post
        }
    });
});











exports.upadtePsot = catchAsync(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!post) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: post
        }
    });
})