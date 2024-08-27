import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
    },

    img: {
      type: String,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        text: {
          type: String,
        },

        user: {
          type: mongoose.Schema.Types.ObjectId, // Correction ici
          ref: "User",
        },
      },
    ],
  },

  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
