require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const booksRouter = require("./routes/books");
const ordersRouter = require("./routes/orders");
const usersRouter = require("./routes/users");

const app = express();
app.use(bodyParser.json());

// Rejestracja tras
app.use("/api/books", booksRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
// Porty dla poszczególnych serwisów
const PORT_BOOKS = 3001;
const PORT_ORDERS = 3002;
const PORT_USERS = 3003;

// Serwis książek
const booksApp = express();
booksApp.use(express.json());
booksApp.use("/api/books", booksRouter);
booksApp.listen(PORT_BOOKS, () => console.log('Books service running on port 3001'));

// Serwis zamówień
const ordersApp = express();
ordersApp.use(express.json());
ordersApp.use("/api/orders", ordersRouter);
ordersApp.listen(PORT_ORDERS, () => console.log('Orders service running on port 3002'));

// Serwis użytkowników
const usersApp = express();
usersApp.use(express.json());
usersApp.use("/api/users", usersRouter);
usersApp.listen(PORT_USERS, () => console.log('Users service running on port 3003'));