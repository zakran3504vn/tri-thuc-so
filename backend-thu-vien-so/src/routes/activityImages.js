const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy danh sách hình ảnh theo hoạt động
router.get('/', async (req, res) => {
  try {
    const { activity_id } = req.query;
    if (!activity_id) {
      return res.status(400).json({ error: 'Thiếu activity_id' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM activity_images WHERE activity_id = ? ORDER BY order_index ASC',
      [activity_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hình ảnh:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo hình ảnh mới
router.post('/', async (req, res) => {
  try {
    const { activity_id, image_url, caption, order_index } = req.body;

    if (!activity_id || !image_url) {
      return res.status(400).json({ error: 'Thiếu activity_id hoặc image_url' });
    }

    const [result] = await pool.query(
      'INSERT INTO activity_images (activity_id, image_url, caption, order_index) VALUES (?, ?, ?, ?)',
      [activity_id, image_url, caption || null, order_index || 0]
    );

    const [newImage] = await pool.query('SELECT * FROM activity_images WHERE id = ?', [result.insertId]);
    res.status(201).json(newImage[0]);
  } catch (error) {
    console.error('Lỗi khi tạo hình ảnh:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật hình ảnh
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, caption, order_index } = req.body;

    const [result] = await pool.query(
      'UPDATE activity_images SET image_url = ?, caption = ?, order_index = ? WHERE id = ?',
      [image_url, caption, order_index, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy hình ảnh' });
    }

    const [updatedImage] = await pool.query('SELECT * FROM activity_images WHERE id = ?', [id]);
    res.json(updatedImage[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật hình ảnh:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa hình ảnh
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM activity_images WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy hình ảnh' });
    }

    res.json({ message: 'Đã xóa hình ảnh thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa hình ảnh:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
