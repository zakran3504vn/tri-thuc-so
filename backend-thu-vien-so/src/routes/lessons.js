const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy danh sách bài giảng theo môn học
router.get('/', async (req, res) => {
  try {
    const { subject_id } = req.query;
    let query = 'SELECT * FROM lessons WHERE is_active = true';
    const params = [];

    if (subject_id) {
      query += ' AND subject_id = ?';
      params.push(subject_id);
    }

    query += ' ORDER BY order_index ASC, created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài giảng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy bài giảng theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM lessons WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bài giảng' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy bài giảng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo bài giảng mới
router.post('/', async (req, res) => {
  try {
    const { subject_id, title, description, video_url, video_duration, content, week_number, order_index, thumbnail, is_active } = req.body;

    if (!subject_id || !title) {
      return res.status(400).json({ error: 'Thiếu subject_id hoặc title' });
    }

    const [result] = await pool.query(
      'INSERT INTO lessons (subject_id, title, description, video_url, video_duration, content, week_number, order_index, thumbnail, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [subject_id, title, description || null, video_url || null, video_duration || null, content || null, week_number || null, order_index || 0, thumbnail || null, is_active !== undefined ? is_active : true]
    );

    const [newLesson] = await pool.query('SELECT * FROM lessons WHERE id = ?', [result.insertId]);
    res.status(201).json(newLesson[0]);
  } catch (error) {
    console.error('Lỗi khi tạo bài giảng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật bài giảng
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, video_url, video_duration, content, week_number, order_index, is_active, thumbnail } = req.body;

    const [result] = await pool.query(
      'UPDATE lessons SET title = ?, description = ?, video_url = ?, video_duration = ?, content = ?, week_number = ?, order_index = ?, is_active = ?, thumbnail = ? WHERE id = ?',
      [title, description, video_url, video_duration, content, week_number, order_index, is_active, thumbnail, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bài giảng' });
    }

    const [updatedLesson] = await pool.query('SELECT * FROM lessons WHERE id = ?', [id]);
    res.json(updatedLesson[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật bài giảng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa bài giảng
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM lessons WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bài giảng' });
    }

    res.json({ message: 'Đã xóa bài giảng thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa bài giảng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
