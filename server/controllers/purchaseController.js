const Purchase = require("../models/purchase");
const { Op } = require("sequelize");
const Product = require("../models/products");

// POST -> localhost:5000/api/v1/purchase
exports.createPurchase = async (req, res) => {

  try {
    const purchases = req.body
    const purchasedGoods = await Promise.all(
      purchases.map(async(purchase)=>{
   const{     
    productName,
    purchaseVendor,
    vendorContact,
    purchaseQuantity,
    purchasePrice
        } = purchase 
  

      const product = await Product.findOne({
        where: {
          productName: productName,
          categoryName: categoryName
        }
      });

      if (!product) {
        return res.status(404).json({ error: `Product '${productName}' in category '${categoryName}' not found` });
      }  
      const newPurchase = await Purchase.create({
        productName,
        purchaseVendor,
        vendorContact,
        purchaseQuantity,
        purchasePrice,
      
      });
      product.productQuantity += purchaseQuantity;
      await product.save();
      return newPurchase;

   })
  )
    
    res.status(201).json({
      message: "Purchase Created Successfully!",
      result : purchasedGoods
    });
  } catch (err) {
    console.error("Error creating purchase:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET -> localhost:5000/api/v1/purchase
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll();
    res.status(200).json({
      message: "Fetch all purchases successfully",
      purchase: purchases,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving purchases" });
  }
};

// PUT -> localhost:5000/api/v1/purchase
exports.updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      purchaseVendor,
      vendorContact,
      purchaseQuantity,
      purchasePrice,
     
    } = req.body;
    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    const updatedPurchase = await purchase.update(req.body);
    res.status(200).json({
      message: "Purchase Updated Successfully!",
      updatePurchase: updatedPurchase,
    });
  } catch (error) {
    console.error("Error updating purchase:", error);
    res.status(500).send("Error updating purchase");
  }
};

// DELETE -> localhost:5000/api/v1/purchase
exports.deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    const destroyPurchase = await purchase.destroy();
    res.status(200).json({
      message: "Purchase deleted successfully",
      deletePurchase: destroyPurchase,
    });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).send("Error deleting purchase");
  }
};

// GET -> localhost:5000/api/v1/purchase/search
exports.searchPurchases = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: "Search keyword is required" });
    }
    const purchases = await Purchase.findAll({
      where: {
        [Op.or]: [
          { purchaseVendor: { [Op.like]: `%${keyword}%` } },
          { productName: { [Op.like]: `%${keyword}%` } },
        ],
      },
    });
    res.status(200).json({
      message: "Fetch all purchases successfully",
      purchase: purchases,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET -> localhost:5000/api/v1/purchase/pagination
exports.paginationPurchases = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ error: "Invalid page or limit parameters" });
    }

    const offset = (page - 1) * limit;

    const purchases = await Purchase.findAndCountAll({
      offset: offset,
      limit: limit,
    });
    res.status(200).json({
      purchase: purchases.rows,
      totalPages: Math.ceil(purchases.count / limit),
      totalCount: purchases.count,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET -> localhost:5000/api/v1/purchase/sorting
exports.sortingPurchases = async (req, res) => {
  try {
    const { sortBy } = req.query;

    res.status(200).json({
      message: "Fetch all purchases successfully",
      purchase: purchases,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
