const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all banners
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM banners WHERE is_active = true ORDER BY order_index ASC, created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách banners:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Get banner by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM banners WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy banner' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy banner:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Create banner
router.post('/', async (req, res) => {
  try {
    const { title, description, image_url, link_url, order_index, is_active } = req.body;
    if (!title || !image_url) {
      return res.status(400).json({ error: 'Thiếu tiêu đề hoặc hình ảnh' });
    }
    const [result] = await pool.query(
      'INSERT INTO banners (title, description, image_url, link_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, image_url, link_url, order_index || 0, is_active !== undefined ? is_active : true]
    );
    const [newBanner] = await pool.query('SELECT * FROM banners WHERE id = ?', [result.insertId]);
    res.status(201).json(newBanner[0]);
  } catch (error) {
    console.error('Lỗi khi tạo banner:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Update banner
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, link_url, order_index, is_active } = req.body;
    await pool.query(
      'UPDATE banners SET title = ?, description = ?, image_url = ?, link_url = ?, order_index = ?, is_active = ? WHERE id = ?',
      [title, description, image_url, link_url, order_index, is_active, id]
    );
    const [updatedBanner] = await pool.query('SELECT * FROM banners WHERE id = ?', [id]);
    if (updatedBanner.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy banner' });
    }
    res.json(updatedBanner[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật banner:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Delete banner
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM banners WHERE id = ?', [id]);
    res.json({ message: 'Đã xóa banner' });
  } catch (error) {
    console.error('Lỗi khi xóa banner:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
