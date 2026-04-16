const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all news
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM news WHERE is_active = true ORDER BY order_index ASC, created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách news:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Get highlighted news
router.get('/highlighted', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM news WHERE is_active = true AND is_highlighted = true ORDER BY order_index ASC, created_at DESC LIMIT 3'
    );
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách news nổi bật:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Get news by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy news' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy news:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Create news
router.post('/', async (req, res) => {
  try {
    const { category, date, title, excerpt, content, image_url, is_highlighted, order_index, is_active } = req.body;
    if (!category || !date || !title) {
      return res.status(400).json({ error: 'Thiếu danh mục, ngày hoặc tiêu đề' });
    }
    const [result] = await pool.query(
      'INSERT INTO news (category, date, title, excerpt, content, image_url, is_highlighted, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [category, date, title, excerpt, content, image_url, is_highlighted || false, order_index || 0, is_active !== undefined ? is_active : true]
    );
    const [newNews] = await pool.query('SELECT * FROM news WHERE id = ?', [result.insertId]);
    res.status(201).json(newNews[0]);
  } catch (error) {
    console.error('Lỗi khi tạo news:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Update news
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, date, title, excerpt, content, image_url, is_highlighted, order_index, is_active } = req.body;
    await pool.query(
      'UPDATE news SET category = ?, date = ?, title = ?, excerpt = ?, content = ?, image_url = ?, is_highlighted = ?, order_index = ?, is_active = ? WHERE id = ?',
      [category, date, title, excerpt, content, image_url, is_highlighted, order_index, is_active, id]
    );
    const [updatedNews] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    if (updatedNews.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy news' });
    }
    res.json(updatedNews[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật news:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Delete news
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM news WHERE id = ?', [id]);
    res.json({ message: 'Đã xóa news' });
  } catch (error) {
    console.error('Lỗi khi xóa news:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
