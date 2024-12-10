const sequelize = require("../config/database");
const Book = require("./book");
const Order = require("./order");
const User = require("./user");

Order.belongsTo(Book, { foreignKey: "bookId" });
Order.belongsTo(User, { foreignKey: "userId" });
// Synchronizacja modeli
(async () => {
  await sequelize.sync();
  console.log("Database synced successfully!");
})();

module.exports = { Book, Order, User };
