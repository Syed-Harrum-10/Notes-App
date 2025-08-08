const pool = require('../database/db');
import { Request, Response } from "express";

const CREATE = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !description || !price || !stock) {
      return res.status(400).json({ message: "Name, description, price, and stock are required." });
    }

    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "You are not authorized to create product" });
    }

    const roleResult = await pool.query(`SELECT role FROM auth WHERE id = $1`, [userId]);

    if (roleResult.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const role = roleResult.rows[0].role;

    if (role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Only admins can create products." });
    }

    const result = await pool.query(
      `INSERT INTO Product (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, price, stock]
    );

    res.status(201).json({
      message: 'Product created successfully.',
      product: result.rows[0]
    });
  } catch (err: any) {
    console.error('Error in CREATE route:', err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const READ = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM Product');
    res.status(200).json({
      message: 'Products fetched successfully.',
      products: result.rows
    });
  } catch (err: any) {
    console.error('Error in READ route:', err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const UPDATE = async (req: Request, res: Response) => {
  try {
    const { id, name, description, price, stock } = req.body;

    if (!id || !name || !description || !price || !stock) {
      return res.status(400).json({ message: "ID, name, description, price, and stock are required." });
    }

    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "You are not authorized to update product" });
    }

    const roleResult = await pool.query(`SELECT role FROM auth WHERE id = $1`, [userId]);

    if (roleResult.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const role = roleResult.rows[0].role;

    if (role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Only admins can update products." });
    }

    const result = await pool.query(
      `UPDATE Product SET name = $1, description = $2, price = $3, stock = $4, updatedAt = NOW() WHERE id = $5 RETURNING *`,
      [name, description, price, stock, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({
      message: 'Product updated successfully.',
      product: result.rows[0]
    });
  } catch (err: any) {
    console.error('Error in UPDATE route:', err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const DELETE = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required for deletion." });
    }

    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "You are not authorized to delete product" });
    }

    const roleResult = await pool.query(`SELECT role FROM auth WHERE id = $1`, [userId]);

    if (roleResult.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const role = roleResult.rows[0].role;

    if (role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Only admins can delete products." });
    }

    const result = await pool.query(
      'DELETE FROM Product WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({
      message: 'Product deleted successfully.',
      deletedProduct: result.rows[0]
    });
  } catch (err: any) {
    console.error('Error in DELETE route:', err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { CREATE, READ, UPDATE, DELETE };
