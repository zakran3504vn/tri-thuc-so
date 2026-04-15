const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy tất cả trang của một truyện
router.get('/story/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM pages WHERE story_id = ? ORDER BY page_number ASC',
      [storyId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách trang:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy một trang cụ thể
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM pages WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy trang' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy trang:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo trang mới
router.post('/', async (req, res) => {
  try {
    const { story_id, page_number, content, image_url } = req.body;

    if (!story_id || page_number === undefined || !content) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const [result] = await pool.query(
      'INSERT INTO pages (story_id, page_number, content, image_url) VALUES (?, ?, ?, ?)',
      [story_id, page_number, content, image_url || null]
    );

    const [newPage] = await pool.query('SELECT * FROM pages WHERE id = ?', [result.insertId]);
    res.status(201).json(newPage[0]);
  } catch (error) {
    console.error('Lỗi khi tạo trang:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật trang
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, image_url } = req.body;

    const [result] = await pool.query(
      'UPDATE pages SET content = ?, image_url = ? WHERE id = ?',
      [content, image_url, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy trang' });
    }

    const [updatedPage] = await pool.query('SELECT * FROM pages WHERE id = ?', [id]);
    res.json(updatedPage[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật trang:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa trang
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM pages WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy trang' });
    }

    res.json({ message: 'Đã xóa trang thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa trang:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
