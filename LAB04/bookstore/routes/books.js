const express = require("express");
//const { Book } = require("../models");
const authenticateToken = require("../middleware/auth");
const router = express.Router();
const { Order, Book } = require("../models");
router.get("/", async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

router.get("/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

router.post("/", authenticateToken, async (req, res) => {
  const { title, author, year } = req.body;
  const book = await Book.create({ title, author, year });
  res.status(201).json(book);
});

router.delete("/:id", authenticateToken, (req, res) => {
  const bookId = req.params.id;
  Book.findByPk(bookId)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      return Order.findAll({ where: { bookId } }).then((relatedOrders) => {
        if (relatedOrders.length > 0) {
          return res.status(400).json({ error: "Cannot delete book with existing orders" });
        }

        // Usuń książkę
        return book.destroy().then(() => {
          res.status(200).json({ message: "Book deleted successfully" });
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

module.exports = router;
