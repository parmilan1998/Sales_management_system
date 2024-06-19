 const {Op} = require("sequelize")
 const Sales = require("../models/sales")
 const Product = require ("../models/products")

// POST -> localhost:5000/api/v1/sales
exports.createSales = async (req, res) => {
  try {
    const { custName, customerContact, details } = req.body;

    // Create the main sales record
    const newSales = await Sales.create({
      custName,
      customerContact
    });

    // Create sales details (multiple entries)
    const createdDetails = await Promise.all(details.map(async (detail) => {
      const { productID, productName, salesQuantity, unitPrice, revenue } = detail;

      const newDetail = await SalesDetail.create({
        salesID: newSales.salesID,
        productID,
        productName,
        salesQuantity,
        unitPrice,
        revenue
      });

      return newDetail;
    }));

    res.status(201).json({
      message: 'Sales added successfully',
      sales: newSales,
      details: createdDetails
    });
  } catch (error) {
    console.error('Error creating sales:', error);
    res.status(500).json({ message: 'Error creating sales', error: error.message });
  }
};

 // GET -> localhost:5000/api/v1/sales/list
exports.getAllSales = async (req, res) =>{
    try{
        const sales = await Sales.findAll();
        res.status(200).json(sales)
    }catch(e){
       res.status(500).json({message:"Error retrieving sales"})
    }
}

// PUT -> localhost:5000/api/v1/sales/:id
exports.updateSales = async (req, res) => {
  try {
    const { id } = req.params;
    const { custName, customerContact, details } = req.body;

    // Update the main sales record
    const existingSales = await Sales.findByPk(id);
    if (!existingSales) {
      return res.status(404).json({ error: `Sales record with ID '${id}' not found` });
    }

    existingSales.custName = custName;
    existingSales.customerContact = customerContact;
    await existingSales.save();

    // Update or create sales details
    const updatedDetails = await Promise.all(details.map(async (detail) => {
      const { salesDetailID, productID, productName, salesQuantity, unitPrice, revenue } = detail;

      if (salesDetailID) {
        // Update existing detail
        const existingDetail = await SalesDetail.findByPk(salesDetailID);
        if (!existingDetail) {
          return res.status(404).json({ error: `Sales detail with ID '${salesDetailID}' not found` });
        }

        existingDetail.productID = productID;
        existingDetail.productName = productName;
        existingDetail.salesQuantity = salesQuantity;
        existingDetail.unitPrice = unitPrice;
        existingDetail.revenue = revenue;
        await existingDetail.save();

        return existingDetail;
      } else {
        // Create new detail
        const newDetail = await SalesDetail.create({
          salesID: existingSales.salesID,
          productID,
          productName,
          salesQuantity,
          unitPrice,
          revenue
        });

        return newDetail;
      }
    }));

    res.status(200).json({
      message: `Sales record with ID '${id}' updated successfully`,
      updatedSales: existingSales,
      updatedDetails
    });
  } catch (error) {
    console.error('Error updating sales:', error);
    res.status(500).json({ message: 'Error updating sales', error: error.message });
  }
};



 // GET -> localhost:5000/api/v1/sales/query
 exports.querySales= async (req, res) => {
  try {
    // Query parameters
    const { keyword, page = 1, limit = 6, sort = "ASC" } = req.query;
    // console.log("Query Params:", { keyword, page, limit, sort });

    // Pagination
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;
    // console.log("Pagination:", { parsedPage, parsedLimit, offset });

    // Search condition
    const searchCondition = keyword
      ? {
          [Op.or]: [
            { productName: { [Op.like]: `%${keyword}%` } },
          ],
        }
      : {};
    // console.log("Where Clause:", searchCondition);

    // Sorting by ASC or DESC
    const sortOrder = sort === "desc" ? "DESC" : "ASC";
    // console.log(sortOrder);

    // search, pagination, and sorting
    const { count, rows: purchases } = await Purchase.findAndCountAll({
      where: searchCondition,
      offset: offset,
      limit: parsedLimit,
      order: [["createdAt", sortOrder]],
    });

    // Total pages
    const totalPages = Math.ceil(count / parsedLimit);

    res.status(200).json({
      purchases,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalCount: count,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


 // DELETE -> localhost:5000/api/v1/sales/:id
 exports.deleteSales = async(req, res) =>{
  const {id} =req.params;

  try{
    const sale = await Sales.findByPk(id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    await sale.destroy();
  res.status(200).send("Product deleted successfully");
} catch (error) {
  res.status(500).send("Error deleting product");
}
 }


