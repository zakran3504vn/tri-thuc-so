const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy danh sách tin nhắn liên hệ
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tin nhắn liên hệ:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy tin nhắn theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM contact_submissions WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tin nhắn' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy tin nhắn:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo tin nhắn mới
router.post('/', async (req, res) => {
  try {
    const { full_name, email, phone, subject, message } = req.body;

    if (!full_name || !subject || !message) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const [result] = await pool.query(
      'INSERT INTO contact_submissions (full_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, phone, subject, message]
    );

    const [newSubmission] = await pool.query('SELECT * FROM contact_submissions WHERE id = ?', [result.insertId]);
    res.status(201).json(newSubmission[0]);
  } catch (error) {
    console.error('Lỗi khi tạo tin nhắn:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Đánh dấu đã đọc
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'UPDATE contact_submissions SET is_read = TRUE WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tin nhắn' });
    }

    const [updatedSubmission] = await pool.query('SELECT * FROM contact_submissions WHERE id = ?', [id]);
    res.json(updatedSubmission[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật tin nhắn:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa tin nhắn
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM contact_submissions WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tin nhắn' });
    }

    res.json({ message: 'Đã xóa tin nhắn thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa tin nhắn:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
