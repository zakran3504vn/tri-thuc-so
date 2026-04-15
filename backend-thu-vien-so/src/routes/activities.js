const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy danh sách hoạt động
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM activities WHERE is_active = true ORDER BY activity_date DESC, created_at DESC';
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hoạt động:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy hoạt động theo ID kèm hình ảnh
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [activityRows] = await pool.query('SELECT * FROM activities WHERE id = ?', [id]);

    if (activityRows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy hoạt động' });
    }

    const [imageRows] = await pool.query(
      'SELECT * FROM activity_images WHERE activity_id = ? ORDER BY order_index ASC',
      [id]
    );

    const activity = activityRows[0];
    activity.images = imageRows;
    res.json(activity);
  } catch (error) {
    console.error('Lỗi khi lấy hoạt động:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo hoạt động mới
router.post('/', async (req, res) => {
  try {
    const { title, description, activity_date, location, thumbnail } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Thiếu tiêu đề hoạt động' });
    }

    const [result] = await pool.query(
      'INSERT INTO activities (title, description, activity_date, location, thumbnail) VALUES (?, ?, ?, ?, ?)',
      [title, description || null, activity_date || null, location || null, thumbnail || null]
    );

    const [newActivity] = await pool.query('SELECT * FROM activities WHERE id = ?', [result.insertId]);
    res.status(201).json(newActivity[0]);
  } catch (error) {
    console.error('Lỗi khi tạo hoạt động:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật hoạt động
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, activity_date, location, thumbnail, is_active } = req.body;

    const [result] = await pool.query(
      'UPDATE activities SET title = ?, description = ?, activity_date = ?, location = ?, thumbnail = ?, is_active = ? WHERE id = ?',
      [title, description, activity_date, location, thumbnail, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy hoạt động' });
    }

    const [updatedActivity] = await pool.query('SELECT * FROM activities WHERE id = ?', [id]);
    res.json(updatedActivity[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật hoạt động:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa hoạt động
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM activities WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy hoạt động' });
    }

    res.json({ message: 'Đã xóa hoạt động thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa hoạt động:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
