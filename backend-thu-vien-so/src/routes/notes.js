const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy tất cả notes của một user cho một truyện
router.get('/', async (req, res) => {
  try {
    const { user_id, story_id } = req.query;

    if (!user_id || !story_id) {
      return res.status(400).json({ error: 'Thiếu user_id hoặc story_id' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM notes WHERE user_id = ? AND story_id = ? ORDER BY page_number ASC',
      [user_id, story_id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách notes:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy note cụ thể của một trang
router.get('/page', async (req, res) => {
  try {
    const { user_id, story_id, page_number } = req.query;

    if (!user_id || !story_id || page_number === undefined) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM notes WHERE user_id = ? AND story_id = ? AND page_number = ?',
      [user_id, story_id, page_number]
    );

    res.json(rows[0] || null);
  } catch (error) {
    console.error('Lỗi khi lấy note:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo hoặc cập nhật note
router.post('/', async (req, res) => {
  try {
    const { user_id, story_id, page_number, note_content } = req.body;

    if (!user_id || !story_id || page_number === undefined || !note_content) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const [result] = await pool.query(
      `INSERT INTO notes (user_id, story_id, page_number, note_content) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE note_content = VALUES(note_content)`,
      [user_id, story_id, page_number, note_content]
    );

    const [note] = await pool.query(
      'SELECT * FROM notes WHERE user_id = ? AND story_id = ? AND page_number = ?',
      [user_id, story_id, page_number]
    );

    res.status(201).json(note[0]);
  } catch (error) {
    console.error('Lỗi khi tạo note:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa note
router.delete('/', async (req, res) => {
  try {
    const { user_id, story_id, page_number } = req.query;

    if (!user_id || !story_id || page_number === undefined) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const [result] = await pool.query(
      'DELETE FROM notes WHERE user_id = ? AND story_id = ? AND page_number = ?',
      [user_id, story_id, page_number]
    );

    res.json({ message: 'Đã xóa note thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa note:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
