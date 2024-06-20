import Post from "../models/Post.model.js";
import User from "../models/User.model.js";

// Create
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;

    const user = User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = Post.find(); // getting all posts to display

    res.status(201).json(post); // 201 sever code is for saving somthing
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Read

export const getFeedPosts = async (req, res) => {
  try {
    const post = Post.find(); // getting all posts to display
    res.status(200).json(post); // sending all posts to front-end
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = Post.find({ userId }); // getting all posts of the given User
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId); // disliking the post
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
