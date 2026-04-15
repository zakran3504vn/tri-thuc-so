const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy danh sách bài tập theo môn học
router.get('/', async (req, res) => {
  try {
    const { subject_id } = req.query;
    let query = 'SELECT * FROM exercises WHERE is_active = true';
    const params = [];

    if (subject_id) {
      query += ' AND subject_id = ?';
      params.push(subject_id);
    }

    query += ' ORDER BY order_index ASC, id ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài tập:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy chi tiết bài tập theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM exercises WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bài tập' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết bài tập:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo bài tập mới
router.post('/', async (req, res) => {
  try {
    const { subject_id, title, description, content, file_url, difficulty, order_index, is_active } = req.body;

    if (!subject_id || !title) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const [result] = await pool.query(
      'INSERT INTO exercises (subject_id, title, description, content, file_url, difficulty, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [subject_id, title, description || null, content || null, file_url || null, difficulty || 'medium', order_index || 0, is_active !== undefined ? is_active : true]
    );

    const [newExercise] = await pool.query('SELECT * FROM exercises WHERE id = ?', [result.insertId]);
    res.status(201).json(newExercise[0]);
  } catch (error) {
    console.error('Lỗi khi tạo bài tập:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật bài tập
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_id, title, description, content, file_url, difficulty, order_index, is_active } = req.body;

    const [result] = await pool.query(
      'UPDATE exercises SET subject_id = ?, title = ?, description = ?, content = ?, file_url = ?, difficulty = ?, order_index = ?, is_active = ? WHERE id = ?',
      [subject_id, title, description, content, file_url, difficulty, order_index, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bài tập' });
    }

    const [updatedExercise] = await pool.query('SELECT * FROM exercises WHERE id = ?', [id]);
    res.json(updatedExercise[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật bài tập:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa bài tập
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM exercises WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bài tập' });
    }

    res.json({ message: 'Đã xóa bài tập thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa bài tập:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
