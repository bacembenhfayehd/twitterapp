import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationsModel.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    if (!img && !text) {
      return res
        .status(400)
        .json({ message: "post should have text or image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log("error in create post controller", error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json("post not found");
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json("you are not authorized to delete this post");
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "post deleted successfuly !" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log("error in delte post controller", error);
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "text field is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ error: "post not found" });
    }

    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();

    return res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log("error in comment post controller", error);
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "post not found !" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      return res.status(200).json({ message: "post unliked successfuly" });
    } else {
      //like the post

      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();
    }

    const notification = new Notification({
      from: userId,
      to: post.user,
      type: "like",
    });
    await notification.save();
    return res.status(200).json({ message: "post liked successfuly !" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log("error in liking post controller", error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ created: 1 }).populate({
      path: "user",
      select: "-password",
    });

    if (posts.length == 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log("error in getting all posts controller", error);
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "user not found !" });
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })

      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log("error in getting likedPosts controller", error);
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: " user not found !" });
    }

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ created: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log("error in getting following posts", error);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const posts = await Post.find({ user: user._id })
      .populate({
        path: "user",
        select: "-password",
      })

      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log("error in getting user posts", error);
  }
};
