const express = require("express");
const { Order, Book } = require("../models");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const orders = await Order.findAll({ where: { userId: req.params.userId } });
  res.json(orders);
});

router.post("/", authenticateToken, async (req, res) => {
  const { bookId, userId, quantity } = req.body;
  const book = await Book.findByPk(bookId);
  if (!book) return res.status(400).json({ error: "Book not found" });
  const order = await Order.create({ bookId, userId, quantity });
  res.status(201).json(order);
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  await order.destroy();
  res.json({ message: "Order deleted" });
});
router.patch("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params; // Pobranie ID zamówienia z URL
  const { quantity } = req.body; // Dane do aktualizacji

  try {
    // Sprawdź, czy zamówienie istnieje
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Aktualizuj zamówienie tylko, jeśli podano nowe dane
    if (quantity !== undefined) {
      order.quantity = quantity;
    }

    // Zapisz zmiany w bazie
    await order.save();

    // Zwróć zaktualizowane zamówienie
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order" });
  }
});
module.exports = router;
