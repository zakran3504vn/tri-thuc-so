const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy danh sách môn học
router.get('/', async (req, res) => {
  try {
    const { grade_level, teacher_id } = req.query;
    let query = 'SELECT s.*, u.full_name as teacher_name FROM subjects s LEFT JOIN users u ON s.teacher_id = u.id WHERE s.is_active = true';
    const params = [];

    if (grade_level) {
      query += ' AND s.grade_level = ?';
      params.push(grade_level);
    }

    if (teacher_id) {
      query += ' AND s.teacher_id = ?';
      params.push(teacher_id);
    }

    query += ' ORDER BY s.created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách môn học:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy môn học theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT s.*, u.full_name as teacher_name FROM subjects s LEFT JOIN users u ON s.teacher_id = u.id WHERE s.id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy môn học' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy môn học:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo môn học mới
router.post('/', async (req, res) => {
  try {
    const { title, description, grade_level, teacher_id, thumbnail } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Thiếu tiêu đề môn học' });
    }

    const [result] = await pool.query(
      'INSERT INTO subjects (title, description, grade_level, teacher_id, thumbnail) VALUES (?, ?, ?, ?, ?)',
      [title, description || null, grade_level || null, teacher_id || null, thumbnail || null]
    );

    const [newSubject] = await pool.query(
      'SELECT s.*, u.full_name as teacher_name FROM subjects s LEFT JOIN users u ON s.teacher_id = u.id WHERE s.id = ?',
      [result.insertId]
    );
    res.status(201).json(newSubject[0]);
  } catch (error) {
    console.error('Lỗi khi tạo môn học:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật môn học
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, grade_level, teacher_id, thumbnail, is_active } = req.body;

    const [result] = await pool.query(
      'UPDATE subjects SET title = ?, description = ?, grade_level = ?, teacher_id = ?, thumbnail = ?, is_active = ? WHERE id = ?',
      [title, description, grade_level, teacher_id, thumbnail, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy môn học' });
    }

    const [updatedSubject] = await pool.query(
      'SELECT s.*, u.full_name as teacher_name FROM subjects s LEFT JOIN users u ON s.teacher_id = u.id WHERE s.id = ?',
      [id]
    );
    res.json(updatedSubject[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật môn học:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa môn học
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM subjects WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy môn học' });
    }

    res.json({ message: 'Đã xóa môn học thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa môn học:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
