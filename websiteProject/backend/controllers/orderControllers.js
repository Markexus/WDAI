// Plik do obsługi kontrolerów dla zamówień

import { orderSchema } from "../models/Order.js";
import { cartSchema, cartItemSchema } from "../models/Cart.js";
import { productSchema } from "../models/Product.js";
import { orderItemSchema } from "../models/OrderItems.js";

// Tworzenie zamówienia
const createOrder = async (req, res) => {
  const { shippingAddress } = req.body;
  const userId = req.user.userId;

  try {
    // Pobieranie koszyka użytkownika
    const cart = await cartSchema.findOne({
      where: { user: userId }, // Wyszukujemy koszyk dla danego użytkownika
    });

    if (!cart) {
      return res.status(404).json({ message: "Koszyk nie znaleziony" });
    }

    // Pobieranie pozycji w koszyku użytkownika
    const cartItems = await cartItemSchema.findAll({
      where: { cartId: cart.id },
      include: [
        {
          model: productSchema,
          as: "product",
          attributes: ["id", "title", "price"],
        },
      ],
    });

    if (!cartItems.length) {
      return res
        .status(404)
        .json({ message: "Koszyk nie znaleziony lub jest pusty" });
    }

    // Obliczanie całkowitej ceny zamówienia
    const totalPrice = cartItems.reduce((acc, item) => {
      if (item.product && item.product.price && item.quantity) {
        return acc + item.product.price * item.quantity;
      }
      return acc;
    }, 0);

    // Tworzenie zamówienia
    const order = await orderSchema.create({
      userId: userId,
      totalPrice,
      shippingAddress,
      status: "Oczekiwanie na zapłatę",
      createdAt: new Date(),
    });

    // Dodanie produktów do tabeli OrderItems
    for (let item of cartItems) {
      await orderItemSchema.create({
        orderId: order.id,
        productId: item.product.id,
        quantity: item.quantity,
      });

      // Zmiejszanie ilości produktów w magazynie
      await productSchema.decrement("availableQuantity", {
        by: item.quantity,
        where: { id: item.product.id },
      });
    }

    // Opróżnianie koszyka
    await cartItemSchema.destroy({ where: { cartId: cart.id } });

    res.status(201).json({ message: "Zamówienie utworzone pomyślnie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Nie udało się utworzyć zamówienia" });
  }
};

// Pobieranie zamówień użytkownika
const getOrderHistory = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Pobieranie zamówień użytkownika
    const orders = await orderSchema.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: orderItemSchema,
          as: "OrderItems",
          include: [
            {
              model: productSchema,
              as: "Product",
              attributes: ["id", "title", "price"],
            },
          ],
          attributes: ["quantity"],
        },
      ],
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Nie udało się pobrać zamówień" });
  }
};

// Pobieranie szczegółów danego zamówienia
const getOrderDetails = async (req, res) => {
  const orderId = req.params.orderid;
  const userid = req.user.userId;

  try {
    // Sprawdzanie czy zamówienie należy do użytkownika
    const order = await orderSchema.findOne({
      where: { id: orderId, userId: userid },
    });
    if (!order) {
      return res.status(404).json({ message: "Zamówienia dla tego użytkownika nie zostało znalezione" });
    }

    // Pobieranie szczegółów zamówienia
    const order2 = await orderSchema.findByPk(orderId, {
      include: [
        {
          model: orderItemSchema,
          as: "OrderItems",
          include: [
            {
              model: productSchema,
              as: "Product",
              attributes: ["id", "title", "price"],
            },
          ],
          attributes: ["quantity"],
        },
      ],
    });

    if (!order2) {
      return res.status(404).json({ message: "Zamówienie nie znalezione" });
    }

    res.status(200).json({ order2 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Nie udało się pobrać zamówienia" });
  }
};

export { createOrder, getOrderHistory, getOrderDetails };
