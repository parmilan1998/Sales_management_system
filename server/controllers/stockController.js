const Stock = require("../models/stock")
const {Op}  = require("sequelize")

//PUT -> localhost:500/api/v1/stock/:id
exports.updateStock = async (req,res)=>{
 
}

// GET -> localhost:5000/api/v1/stock/list
exports.getAllStock = async (req,res)=>{
    try {
        const stocks = await Stock.findAll();
        res.status(200).json(stocks);
    } catch (error) {
        res.status(500).json({message:'Error retrieving products'});
    }
    
}
// POST -> localhost:500/api/v1/stock/search
exports.searchStock = async (req, res)=>{

}

//DELETE -> localhost:500/api/v1/stock/:id
exports.deleteStock = async(req,res)=>{
    const { id } = req.params;
    try {
      const stocks = await Stock.findByPk(id);
  
      if (!stocks) {
        return res.status(404).json({ message: "Product stock not found" });
      }
      await stocks.destroy();
      res.status(200).json({ message:"Stock Product deleted successfully"});
    } catch (error) {
      res.status(500).json({ message:"Error deleting Stock Product"});
    }
}

