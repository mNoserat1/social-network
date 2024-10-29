const router = require("express").Router()
const authMiddleware = require("../middlewares/auth")
const postController = require("../controllers/postController")
//  all route here start with /api/v1/post

// 
router.route("/").get(postController.getAllPosts).post(authMiddleware.protected, postController.createPost)



router.route("/:id").get(postController.getOne)
    .post(authMiddleware.protected, authMiddleware.isAllowed, postController.upadtePsot)
    .delete(authMiddleware.protected, authMiddleware.isAllowed, postController.deletePost)
    .put(authMiddleware.protected, authMiddleware.isAllowed, postController.upadtePsot)






module.exports = router;