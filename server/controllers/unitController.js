const Product = require("../models/products");
const Unit = require("../models/unit");

// POST -> localhost:5000/api/v1/unit/list
exports.createUnitType = async (req, res) => {
  try {
    const { unitType } = req.body;
    const unit = await Unit.create({ unitType });
    res.status(201).json(unit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET -> localhost:5000/api/v1/unit
exports.getAllUitTypes = async (req, res) => {
  try {
    const units = await Unit.findAll();
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
