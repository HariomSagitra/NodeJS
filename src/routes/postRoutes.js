const express = require("express");
const router = express.Router();

const { createPost,getMyPosts,updatePost,deletePost,searchPost} = require("../controllers/postController")

const protect = require("../middleware/authMiddleware")

//post routes

router.post("/", protect, createPost);
router.get("/my-posts", protect, getMyPosts)
router.put("/:id", protect, updatePost)
router.delete("/:id",protect,deletePost)

router.get("/search",searchPost)


module.exports = router;