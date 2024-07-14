const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

const Comment = model("Comment", CommentSchema);

module.exports = Comment;
