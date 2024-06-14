const Purchase = require("../models/purchase");
const { Op } = require("sequelize");

// POST -> localhost:5000/api/v1/purchase
exports.createPurchase = async (req, res) => {
  try {
    const { purchaseData, purchaseQuantity, purchasePrice } = req.body;
    console.log(req.body);

    const purchase = await Purchase.create({
      purchaseData,
      purchaseQuantity,
      purchasePrice,
    });
    res.status(201).json({
      message: "Purchase Created Successfully!",
      purchase: purchase,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
