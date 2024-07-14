const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Post = require("./models/Post");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const Comment=require("./models/Comment");
// console.log(process.env) // remove this after you've confirmed it is working
const DATABASE_URL = process.env.DATABASE_URL;

const salt = bcrypt.genSaltSync(10); // for bcryptjs
const secret = "kjdbvkjbskuvbsevbsduvbsiv";

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());

app.use("/uploads", express.static(__dirname + "/uploads"));
// const baseurl = process.env.DATABASE_URL;

// const dbUrl =
//   "mongodb+srv://blog:GyFtVMjL5OKx0Rp9@cluster0.yi3xewv.mongodb.net/?retryWrites=true&w=majority";
// async function main() {
//   await mongoose.connect(dbUrl);
//   console.log("Database connected");
// }
// main().catch((err) => console.log(err));
// console.log(baseurl);
mongoose.connect(
  //   "mongodb+srv://blog:GyFtVMjL5OKx0Rp9@cluster0.yi3xewv.mongodb.net/?retryWrites=true&w=majority"
  `${process.env.DATABASE_URL}`
);
console.log("Database connected");

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt), //encrypting pass
    });
    // console.log(userDoc);
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try{
    const userDoc = await User.findOne({ username });
  if(!userDoc){
    return res.status(400).json("user not found");
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    // res.json();
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });

  } else {
    res.status(400).json("wrong credientails");
  }
  }catch(e){
    console.log(e);
    res.status(400).json("wrong credientails");
  }
  //   res.json(passOk);
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
  //   res.json(req.cookies);
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  const posts = await Post.find()
    .populate("author", "username")
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    const updatedFields = {
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    };
    // await postDoc.update({
    //   title,
    //   summary,
    //   content,
    //   cover: newPath ? newPath : postDoc.cover,
    // });
    const data = await Post.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.json(data);
  });
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", "username");
  res.json(postDoc);
});

app.post("/comment", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { postId, content } = req.body;
    try {
      // console.log("test");
      const commentDoc = await Comment.create({
        content,
        author: info.id,
        post: postId,
      });
      console.log(commentDoc);
      await Post.findByIdAndUpdate(postId, {
        $push: { comments: commentDoc._id },
      });
      res.json(commentDoc);
    } catch (e) {
      res.status(400).json(e);
    }
  });
});

// Fetch comments for a post
app.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ post: postId }).populate("author", "username");
    res.json(comments);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.listen(process.env.PORT);
//mongodb+srv://blog:GyFtVMjL5OKx0Rp9@cluster0.yi3xewv.mongodb.net/?retryWrites=true&w=majority
