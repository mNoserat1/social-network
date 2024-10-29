const router = require("express").Router()
const authMiddleware = require("../middlewares/auth")
//  all route here start with /api/v1/user

// /api/v1/user/singup
router.route("/singup").post(authMiddleware.signUp)
router.route("/logIn").post(authMiddleware.logIn)





module.exports = router;