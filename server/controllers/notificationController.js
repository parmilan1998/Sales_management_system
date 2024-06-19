const Notification = require("../models/notifications");

async function checkAndSendNotifications(product) {
  try {
    // Low stock
    if (product.quantity <= 10) {
      await Notification.create({
        notificationType: "lowStock",
        notificationMessage: `Low stock alert for ${product.name}`,
        productID: product.productID,
        userID: "admin",
      });
    }

    // Out of stock
    if (product.quantity === 0) {
      await Notification.create({
        notificationType: "outOfStock",
        notificationMessage: `Out of stock alert for ${product.name}`,
        productID: product.productID,
        userID: "admin",
      });
    }

    // Expired stock
    const currentDate = new Date();
    if (product.expiryDate <= currentDate) {
      await Notification.create({
        notificationType: "expiredStock",
        notificationMessage: `Expired stock alert for ${product.name}`,
        productID: product.productID,
        userID: "admin",
      });
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
    resizeBy.status(500).json({ message: error.message });
  }
}

// cron.schedule("0 6 * * *", () => {
//   console.log("running a task every day at 6:00 AM");
// });
