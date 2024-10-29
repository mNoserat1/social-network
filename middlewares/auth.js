const User = require("../models/userModel")
const Post = require("../models/postModel")
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require("util")
const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);

    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signUp = catchAsync(async (req, res, next) => {

    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        photo: req.body.photo
    }
    const newUser = await User.create(userData);

    // const url = `${req.protocol}://${req.get('host')}/me`;
    // // console.log(url);

    createSendToken(newUser, 201, req, res);
});



// this shit
exports.logIn = catchAsync(async (req, res, next) => {

    // const username = req.body.username
    // const email = req.body.email
    // const password = req.body.password
    const { email, password, username } = req.body
    console.log("email = ", email);
    console.log("username = ", username);
    let user;
    if (!(email || username) || !password) {
        return next(new AppError('Please provide email/username and password!', 400));
    }

    if (email) {

        user = await User.findOne({ email }).select("+password");
    } else if (username) {
        user = await User.findOne({ username }).select("+password");

    }



    if (!user || !await user.comparePassword(password, user.password)) {
        return next(new AppError('Incorrect  email or password!', 400));
    }
    const token = signToken(user._id)
    res.status(201).json({
        token,
        user

    })


})


// this shit 
exports.protected = catchAsync(async (req, res, next) => {
    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

        token = req.headers.authorization.split(" ")[1]
        // console.log("token is = ", token);


    } else if (req.cookies.jwt) {
        token = req.cookies.jwt

    }

    if (!token) {
        // error h

        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );




    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    //  if there is error the global Error middleware Will deal with it
    const user = await User.findById(decoded.id)
    // check if user still exist
    if (!user) {
        // error h

        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        );


    }


    //  check if password changed logic
    if (await user.isPasswordChanged(decoded.iat)) {

        // error h
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        );
    }

    // all are ok move tonext route

    //  put the usr data on the request 

    req.user = user
    res.locals.user = user;


    next()
})




exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};



exports.isAdmin = (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!req.user.isAdmin) {
        return next(
            new AppError('You do not have permission to perform this action', 403)
        );
    }

    next();

};


exports.isAllowed = catchAsync(async (req, res, next) => {


    const post = await Post.findById(req.params.id)
    // find the post and check if Ids Match
    const user = req.user

    if (user.isAdmin) {

        return next()
    }
    if (user.id == post.postedBy.id) {
        return next()
    }
    return next(new AppError('You do not have permission to perform this action', 403))
})

// Only for rendered pages, no errors!




// exports.isLoggedIn = async (req, res, next) => {
//     if (req.cookies.jwt) {
//         try {
//             // 1) verify token
//             const decoded = await promisify(jwt.verify)(
//                 req.cookies.jwt,
//                 process.env.JWT_SECRET
//             );

//             // 2) Check if user still exists
//             const currentUser = await User.findById(decoded.id);
//             if (!currentUser) {
//                 return next();
//             }

//             // 3) Check if user changed password after the token was issued
//             if (currentUser.changedPasswordAfter(decoded.iat)) {
//                 return next();
//             }

//             // THERE IS A LOGGED IN USER
//             res.locals.user = currentUser;
//             return next();
//         } catch (err) {
//             return next();
//         }
//     }
//     next();
// };








