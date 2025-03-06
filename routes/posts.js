const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.post("/create", async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    const post = new Post({ title, body });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error al crear publicación", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicaciones", error });
  }
});

router.get("/id/:_id", async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);
    if (!post) return res.status(404).json({ message: "Publicación no encontrada" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicación", error });
  }
});

router.get("/title/:title", async (req, res) => {
  try {
    const post = await Post.findOne({ title: req.params.title });
    if (!post) return res.status(404).json({ message: "Publicación no encontrada" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicación", error });
  }
});

router.put("/id/:_id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params._id, req.body, { new: true });
    if (!updatedPost) return res.status(404).json({ message: "Publicación no encontrada" });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar publicación", error });
  }
});

router.delete("/id/:_id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params._id);
    if (!deletedPost) return res.status(404).json({ message: "Publicación no encontrada" });
    res.status(200).json({ message: "Publicación eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar publicación", error });
  }
});

router.get("/postsWithPagination", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const posts = await Post.find().skip(skip).limit(limit);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicaciones", error });
  }
});

module.exports = router;