 const {Op} = require("sequelize")
 const Sales = require("../models/sales")
 const Product = require ("../models/products")

 exports.createSales = async (req, res) =>{ 
   
    try{
        const sales = req.body
        const createdSales = await Promise.all(
            sales.map(async (sale)=>{
                const{
                    categoryName,
                    productName,
                    salesQuantity,
                    custName,
                    customerContact
                } = sale

                const product = await Product.findOne({
                    where: {
                      productName: productName,
                      categoryName: categoryName
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
                    categoryName: categoryName,
                    productName: productName,
                    salesQuantity: salesQuantity,
                    unitPrice: productUnitPrice,
                    totalPrice: calculatedTotalPrice,
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
        res.status(500).json({message:"Error carryingout sales"})
    }
 }

exports.getSales = async (req, res) =>{
    try{
        const sales = await Sales.findAll();
        res.status(200).json(sales)
    }catch(e){
       res.status(500).json({message:"Error retrieving sales"})
    }
}

 exports.updateSales = async (req,res) =>{

 }

 exports.searchSales = async (req,res) =>{}

 exports.deleteSales = async(req, res) =>{}

