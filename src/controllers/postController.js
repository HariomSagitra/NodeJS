const Post = require("../models/postModel");
const { post } = require("../routes/userRoutes");
const asyncHandler = require("../utils/asyncHandler");

// createPost API

const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Please provide title and content",
    });
  }

  const post = await Post.create({
    title,
    content,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Post is created suceessfully",
    post,
  });
});

// getPOst API

const getMyPosts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const skip = (page - 1) * limit;

  const posts = await Post.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "name email");

  res.status(200).json({
    success: true,
    count: posts.length,
    posts,
  });
});

// updatepost API

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      sucess: false,
      message: "post not found",
    });
  }

  if (post.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      sucess: false,
      message: "Not Authorized",
    });
  }

  const { title, content } = req.body;

  post.title = title || post.title;
  post.content = content || post.content;

  await post.save();

  res.status(200).json({
    success: true,
    message: "Post update successfully",
    post,
  });
});

//deletePost API

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "post not found",
    });
  }

  console.log("Post User:", post.user.toString());
  console.log("Logged User:", req.user._id.toString());
  if (post.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Anathorized user",
    });
  }

  await post.deleteOne();

  return res.status(200).json({
    success: true,
    message: "post delete succefullly",
  });
});

// searchPost API

const searchPost = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword || "";

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  const skip = (page - 1) * limit;

  const sort = req.query.sort || "newest";
 

  let sortOption = {}

  if(sort==="oldest"){
    sortOption = {createdAt:1}
  }else{
    sortOption = {createdAt:-1}
  }



  const searchQuery = {
    $or: [
      {
        title: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        content: {
          $regex: keyword,
          $options: "i",
        },
      },
    ],
  };

  const totalPosts = await Post.countDocuments(searchQuery);

  const totalPages = Math.ceil(totalPosts / limit);

  const posts = await Post.find(searchQuery)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .populate("user", "name email");

    return res.status(200).json({
  sucess: true,
  message: "get all post sucessfully",
  page,
  limit,
  totalPages,
  totalPosts,
  count:posts.length,
  posts,
});

});




module.exports = {
  createPost,
  getMyPosts,
  updatePost,
  deletePost,
  searchPost,
};
