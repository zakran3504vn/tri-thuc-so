const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy bookmark của một user cho một truyện
router.get('/', async (req, res) => {
  try {
    const { user_id, story_id } = req.query;

    if (!user_id || !story_id) {
      return res.status(400).json({ error: 'Thiếu user_id hoặc story_id' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM bookmarks WHERE user_id = ? AND story_id = ?',
      [user_id, story_id]
    );

    res.json(rows[0] || null);
  } catch (error) {
    console.error('Lỗi khi lấy bookmark:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo hoặc cập nhật bookmark
router.post('/', async (req, res) => {
  try {
    const { user_id, story_id, page_number } = req.body;

    if (!user_id || !story_id || page_number === undefined) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const [result] = await pool.query(
      `INSERT INTO bookmarks (user_id, story_id, page_number) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE page_number = VALUES(page_number)`,
      [user_id, story_id, page_number]
    );

    const [bookmark] = await pool.query(
      'SELECT * FROM bookmarks WHERE user_id = ? AND story_id = ?',
      [user_id, story_id]
    );

    res.status(201).json(bookmark[0]);
  } catch (error) {
    console.error('Lỗi khi tạo bookmark:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa bookmark
router.delete('/', async (req, res) => {
  try {
    const { user_id, story_id } = req.query;

    if (!user_id || !story_id) {
      return res.status(400).json({ error: 'Thiếu user_id hoặc story_id' });
    }

    const [result] = await pool.query(
      'DELETE FROM bookmarks WHERE user_id = ? AND story_id = ?',
      [user_id, story_id]
    );

    res.json({ message: 'Đã xóa bookmark thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa bookmark:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
