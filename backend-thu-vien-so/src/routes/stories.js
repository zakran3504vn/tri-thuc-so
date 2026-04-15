const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy danh sách tất cả truyện
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM stories ORDER BY id ASC';
    const params = [];

    if (category && category !== 'Tất cả') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách truyện:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy chi tiết một truyện theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM stories WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy truyện' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết truyện:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo truyện mới
router.post('/', async (req, res) => {
  try {
    const { title, author, category, total_pages, cover_image, description } = req.body;

    if (!title || !author || !category || !total_pages) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const [result] = await pool.query(
      'INSERT INTO stories (title, author, category, total_pages, cover_image, description) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, category, total_pages, cover_image || null, description || null]
    );

    const [newStory] = await pool.query('SELECT * FROM stories WHERE id = ?', [result.insertId]);
    res.status(201).json(newStory[0]);
  } catch (error) {
    console.error('Lỗi khi tạo truyện:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật truyện
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, total_pages, cover_image, description } = req.body;

    const [result] = await pool.query(
      'UPDATE stories SET title = ?, author = ?, category = ?, total_pages = ?, cover_image = ?, description = ? WHERE id = ?',
      [title, author, category, total_pages, cover_image, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy truyện' });
    }

    const [updatedStory] = await pool.query('SELECT * FROM stories WHERE id = ?', [id]);
    res.json(updatedStory[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật truyện:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa truyện
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM stories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy truyện' });
    }

    res.json({ message: 'Đã xóa truyện thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa truyện:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
