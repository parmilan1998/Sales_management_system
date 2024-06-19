 const {Op} = require("sequelize")
 const Sales = require("../models/sales")
 const Product = require ("../models/products")

// POST -> localhost:5000/api/v1/sales
 exports.createSales = async (req, res) =>{ 
   
    try{
        const sales = req.body
        const createdSales = await Promise.all(
            sales.map(async (sale)=>{
                const{
                    productName,
                    salesQuantity,
                    custName,
                    customerContact
                } = sale

                const product = await Product.findOne({
                    where: {
                      productName: productName
                    }
                  });

                  if (!product) {
                    return res.status(404).json({ error: `Product '${productName}' in category '${categoryName}' not found` });
                  }  

                  const { unitPrice: productUnitPrice, productQuantity } = product;

                  if (productQuantity < salesQuantity) {
                   return res.status(404).json({ error:`Insufficient quantity available for product '${productName}'`});
                  }
          
                  const calculatedTotalPrice = productUnitPrice * salesQuantity;  

                  const newSale = await Sales.create({
                    productID: product.productID,
                    categoryID: product.categoryID,
                    categoryName: product.categoryName,
                    productName: productName,
                    salesQuantity: salesQuantity,
                    unitPrice: productUnitPrice,
                    revenue: calculatedTotalPrice,
                    custName: custName,
                    customerContact: customerContact
                  });
                  product.productQuantity -= salesQuantity;
                  await product.save();
          
                  return newSale;
                })
              );
          
              res.status(201).json({
                message: "Sales added successfully",
                result: createdSales
              });
    }
    catch(e){
      console.error("Error creating sales:", e);
        res.status(500).json({message:"Error carryingout sales", e: e.message,})
    }
 }

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
    const { productName, salesQuantity, custName, customerContact } = req.body;

   
    const existingSale = await Sales.findByPk(id);

    if (!existingSale) {
      return res.status(404).json({ error: `Sales record with ID '${id}' not found` });
    }

    
    const currentProduct = await Product.findByPk(existingSale.productID);

    if (!currentProduct) {
      return res.status(404).json({ error: `Product with ID '${existingSale.productID}' not found` });
    }

    // If product name is changing, adjust quantities in old and new products
    if (productName !== existingSale.productName) {
      // Find the new product by name
      const newProduct = await Product.findOne({
        where: {
          productName: productName
        }
      });

      if (!newProduct) {
        return res.status(404).json({ error: `Product '${productName}' not found` });
      }

      // Restore quantity in the current product
      currentProduct.productQuantity += existingSale.salesQuantity;
      await currentProduct.save();

      // Deduct quantity from the new product
      if (newProduct.productQuantity < salesQuantity) {
        return res.status(404).json({ error: `Insufficient quantity available for product '${productName}'` });
      }
      newProduct.productQuantity -= salesQuantity;
      await newProduct.save();

      // Update the sales record with new product details
      existingSale.productID = newProduct.productID;
      existingSale.categoryID = newProduct.categoryID;
      existingSale.productName = newProduct.productName;
    } else {
      const quantityDifference = salesQuantity - existingSale.salesQuantity;
      if (quantityDifference !== 0) {
   
        if (quantityDifference > 0) {
          // Decrease product quantity if salesQuantity is increased
          currentProduct.productQuantity -= Math.abs(quantityDifference);
        } else {
          // Increase product quantity if salesQuantity is decreased
          currentProduct.productQuantity += Math.abs(quantityDifference);
        }
        await currentProduct.save();
      }
    }

    // Update sales record details
    existingSale.salesQuantity = salesQuantity;
    existingSale.custName = custName;
    existingSale.customerContact = customerContact;

    // Calculate the new total price
    const { unitPrice: productUnitPrice } = currentProduct;
    const calculatedTotalPrice = productUnitPrice * salesQuantity;
    existingSale.revenue = calculatedTotalPrice;

    // Save the updated sales record
    await existingSale.save();

    res.status(200).json({
      message: `Sales record with ID '${id}' updated successfully`,
      updatedSale: existingSale
    });
  } catch (e) {
    console.error("Error updating sales:", e);
    res.status(500).json({ message: "Error updating sales", e: e.message });
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


