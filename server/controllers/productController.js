// import db from "../database/db.js";
// import { validationResult } from "express-validator";

// <<<<<<< HEAD
// exports.createProduct = (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
// =======
// export const createProduct = (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
// >>>>>>> a6403c6613f015a4d2567e3be8f594e8234418c6

//   const products = req.body;

//   const insertionPromises = products.map((product) => {
//     const {
//       ProductName,
//       CategoryName,
//       PDescription,
//       UnitPrice,
//       M_Date,
//       E_Date,
//     } = product;

//     const q = `
//             INSERT INTO products (ProductName, CategoryID, PDescription, UnitPrice, M_Date, E_Date)
//             SELECT ?, c.CategoryID, ?, ?, ?, ?
//             FROM category c
//             WHERE c.CategoryName = ?`;

//     return new Promise((resolve, reject) => {
//       db.execute(
//         q,
//         [ProductName, PDescription, UnitPrice, M_Date, E_Date, CategoryName],
//         (err, result) => {
//           if (err) {
//             console.error("Error executing query:", err.stack);
//             reject(err);
//           } else {
//             resolve("Product added successfully");
//           }
//         }
//       );
//     });
//   });

//   Promise.all(insertionPromises)
//     .then((results) => {
//       res.status(201).json({ message: "Products added successfully", results });
//     })
//     .catch((err) => {
//       console.error("Error adding products:", err);
//       res.status(500).send("Error adding products");
//     });
// };

// <<<<<<< HEAD
// exports.getAllProduct = (req, res) => {
//   const q = "SELECT * FROM products";
//   db.query(q, (err, data) => {
//     if (err) {
//       console.error("Error executing query:", err.stack);
//       return res.status(500).send("Error executing query");
//     }
//     res.json(data);
//   });
// };

// exports.getProduct = (req, res) => {
//   const { id } = req.params;
//   const q = "SELECT * FROM products WHERE ProductID = ?";

//   db.query(q, [id], (err, data) => {
//     if (err) {
//       console.error("Error executing query:", err.stack);
//       return res.status(500).send("Error executing query");
//     }
//     res.json(data);
//   });
// };

// exports.updateProduct = [
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { id } = req.params;
//     const {
//       ProductName,
//       CategoryName,
//       PDescription,
//       UnitPrice,
//       M_Date,
//       E_Date,
//     } = req.body;

//     let query = "UPDATE products SET";
//     let values = [];

//     if (ProductName) {
//       query += " ProductName = ?,";
//       values.push(ProductName);
//     }
//     if (PDescription) {
//       query += " PDescription = ?,";
//       values.push(PDescription);
//     }
//     if (UnitPrice) {
//       query += " UnitPrice = ?,";
//       values.push(UnitPrice);
//     }
//     if (M_Date) {
//       query += " M_Date = ?,";
//       values.push(M_Date);
//     }
//     if (E_Date) {
//       query += " E_Date = ?,";
//       values.push(E_Date);
//     }

//     if (CategoryName) {
//       query +=
//         " CategoryID = (SELECT CategoryID FROM category WHERE CategoryName = ?),";
//       values.push(CategoryName);
//     }

//     query = query.slice(0, -1) + " WHERE ProductID = ?";
//     values.push(id);

//     db.execute(query, values, (err, result) => {
//       if (err) {
//         console.error("Error executing query:", err.stack);
//         return res.status(500).send("Error executing query");
//       }
//       res.status(200).send("Product updated successfully");
//     });
//   },
// ];

// exports.deleteProduct = (req, res) => {
//   const { id } = req.params;
//   const q = "DELETE FROM products WHERE ProductID = ?";
//   db.execute(q, [id], (err, result) => {
//     if (err) {
//       console.error("Error executing query:", err.stack);
//       return res.status(500).send("Error executing query");
//     }
//     res.status(200).send("Product deleted successfully");
//   });
// };

// exports.searchProduct = (req, res) => {
//   const { ProductName, CategoryName } = req.query;

//   let query = `
// =======
// export const getAllProduct =(req,res)=>{
//     const q = 'SELECT * FROM products';
//     db.query(q, (err, data) => {
//         if (err) {
//             console.error('Error executing query:', err.stack);
//             return res.status(500).send('Error executing query');
//         }
//         res.json(data);
//     });}

//     export const getProduct =(req,res)=>{
//         const { id } = req.params;
//         const q = 'SELECT * FROM products WHERE ProductID = ?';

//         db.query(q,[id], (err, data) => {
//             if (err) {
//                 console.error('Error executing query:', err.stack);
//                 return res.status(500).send('Error executing query');
//             }
//             res.json(data);
//         });}

// export const updateProduct = [
//         (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { id } = req.params;
//         const { ProductName, CategoryName, PDescription, UnitPrice, M_Date, E_Date } = req.body;

//         let query = 'UPDATE products SET';
//         let values = [];

//         if (ProductName) {
//             query += ' ProductName = ?,';
//             values.push(ProductName);
//         }
//         if (PDescription) {
//             query += ' PDescription = ?,';
//             values.push(PDescription);
//         }
//         if (UnitPrice) {
//             query += ' UnitPrice = ?,';
//             values.push(UnitPrice);
//         }
//         if (M_Date) {
//             query += ' M_Date = ?,';
//             values.push(M_Date);
//         }
//         if (E_Date) {
//             query += ' E_Date = ?,';
//             values.push(E_Date);
//         }

//         if (CategoryName) {
//             query += ' CategoryID = (SELECT CategoryID FROM category WHERE CategoryName = ?),';
//             values.push(CategoryName);
//         }

//         query = query.slice(0, -1) + ' WHERE ProductID = ?';
//         values.push(id);

//         db.execute(query, values, (err, result) => {
//             if (err) {
//                 console.error('Error executing query:', err.stack);
//                 return res.status(500).send('Error executing query');
//             }
//             res.status(200).send('Product updated successfully');
//         });
//     }
// ];
//         export const deleteProduct =(req, res) => {
//             const { id } = req.params;
//             const q = 'DELETE FROM products WHERE ProductID = ?';
//             db.execute(q, [id], (err, result) => {
//                 if (err) {
//                     console.error('Error executing query:', err.stack);
//                     return res.status(500).send('Error executing query');
//                 }
//                 res.status(200).send('Product deleted successfully');
//             });
//         };

//         export const searchProduct = (req, res) => {
//             const { ProductName,CategoryName } = req.query;

//             let query = `
// >>>>>>> a6403c6613f015a4d2567e3be8f594e8234418c6
//                 SELECT p.ProductID, p.ProductName, c.CategoryName, p.PDescription, p.UnitPrice, p.M_Date, p.E_Date
//                 FROM products p
//                 JOIN category c ON p.CategoryID = c.CategoryID
//             `;
//   let values = [];

//   if (ProductName) {
//     query += " AND ProductName LIKE ?";
//     values.push(`%${ProductName}%`);
//   }
//   if (CategoryName) {
//     query += " AND c.CategoryName LIKE ?";
//     values.push(`%${CategoryName}%`);
//   }

//   db.query(query, values, (err, data) => {
//     if (err) {
//       console.error("Error executing query:", err);
//       return res.status(500).send("Error executing query: " + err.message);
//     }
//     res.json(data);
//   });
// };
