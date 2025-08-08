const pool = require('../database/db');
import {Request, Response} from "express"

// CREATE
const CREATE = async (req, res) => {
    try {
        const { title, content, userId } = req.body;

        if (!title || !content || !userId) {
            return res.status(400).json({ message: "Title, content, and userId are required." });
        }

        const result = await pool.query(
            `INSERT INTO notes (title, content, userId) VALUES ($1, $2, $3) RETURNING *`,
            [title, content, userId]
        );

        res.status(201).json({
            message: 'Note created successfully.',
            note: result.rows[0]
        });

    } catch (err) {
        console.error('Error in CREATE route:', err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// READ 
const READ = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM notes');
        res.status(200).json({
            message: 'Notes fetched successfully.',
            notes: result.rows 
        });

    } catch (err) {
        console.error('Error in READ route:', err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// UPDATE 
const UPDATE = async (req, res) => {
    try {
        const { id, title, content } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Note ID is required for update." });
        }

        const result = await pool.query(
            `UPDATE notes SET title = $1, content = $2, updatedAt = NOW() WHERE id = $3 RETURNING *`,
            [title, content, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Note not found." });
        }

        res.status(200).json({
            message: 'Note updated successfully.',
            note: result.rows[0]
        });

    } catch (err) {
        console.error('Error in UPDATE route:', err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE (Requires note ID)
const DELETE = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Note ID is required for deletion." });
        }

        const result = await pool.query(
            'DELETE FROM notes WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Note not found." });
        }

        res.status(200).json({
            message: 'Note deleted successfully.',
            deletedNote: result.rows[0]
        });

    } catch (err) {
        console.error('Error in DELETE route:', err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { CREATE, READ, UPDATE, DELETE };