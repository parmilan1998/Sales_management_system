const { body, validationResult} = require('express-validator')
const db = require('../config/db')

exports.createCategory = [
    (req, res) => {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { CategoryName, CDescription } = req.body;

        if (!CategoryName) {
            return res.status(400).send('CategoryName is required');
        }

        const description = CDescription || null;

        const q = 'INSERT INTO category (CategoryName, CDescription) VALUES (?, ?)';

        db.execute(q, [CategoryName, description], (err, result) => {
            if (err) {
                console.error('Error executing query:', err.stack);
                return res.status(500).send('Error executing query');
            }
            res.status(201).send('Category added successfully');
        });
    }
];


exports.getCategory =(req,res)=>{ 
    const q = 'SELECT * FROM category';
    db.query(q, (err, data) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).send('Error executing query');
        }
        res.json(data);
    });}

    exports.updateCategory = [
        body('CategoryName').optional().notEmpty().withMessage('CategoryName cannot be empty'),
        body('CDescription').optional().notEmpty().withMessage('Category Description cannot be empty'),

        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            const { id } = req.params;
            const { CategoryName, CDescription } = req.body;
    
            let query = 'UPDATE category SET';
            let values = [];
            if (CategoryName) {
                query += ' CategoryName = ?,';
                values.push(CategoryName);
            }
            if (CDescription) {
                query += ' CDescription = ?,';
                values.push(CDescription);
            }

            query = query.slice(0, -1) + ' WHERE CategoryID = ?';
            values.push(id);
    
            db.execute(query, values, (err, result) => {
                if (err) {
                    console.error('Error executing query:', err.stack);
                    return res.status(500).send('Error executing query');
                }
                res.status(200).send('Category updated successfully');
            });
        }
    ];


exports.deleteCategory =(req, res) => {
    const { id } = req.params;
    const q = 'DELETE FROM category WHERE CategoryID = ?';
    db.execute(q, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).send('Error executing query');
        }
        res.status(200).send('Category deleted successfully');
    });
};

exports.searchCategory = (req, res) => {
    const { CategoryName, CDescription } = req.query;
    
    let query = 'SELECT * FROM category';
    let values = [];
    
    if (CategoryName || CDescription) {
        query += ' WHERE';
        
        if (CategoryName) {
            query += ' CategoryName LIKE ?';
            values.push(`%${CategoryName}%`);
        }
        
        if (CategoryName && CDescription) {
            query += ' AND';
        }
        
        if (CDescription) {
            query += ' CDescription LIKE ?';
            values.push(`%${CDescription}%`);
        }
    }

    db.query(query, values, (err, data) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).send('Error executing query');
        }
        res.json(data);
    });
};


    

