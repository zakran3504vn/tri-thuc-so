const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy danh sách thông báo
router.get('/', async (req, res) => {
  try {
    const { type, include_inactive } = req.query;
    let query = `
      SELECT a.*, u.full_name as created_by_name 
      FROM announcements a 
      LEFT JOIN users u ON a.created_by = u.id 
    `;
    const params = [];

    if (!include_inactive) {
      query += ' WHERE a.is_active = true';
    }

    if (type) {
      query += include_inactive ? ' WHERE a.announcement_type = ?' : ' AND a.announcement_type = ?';
      params.push(type);
    }

    query += ' ORDER BY a.priority DESC, a.publish_date DESC, a.created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thông báo:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy thông báo theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT a.*, u.full_name as created_by_name FROM announcements a LEFT JOIN users u ON a.created_by = u.id WHERE a.id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy thông báo' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông báo:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo thông báo mới
router.post('/', async (req, res) => {
  try {
    const { title, content, announcement_type, priority, publish_date, expiry_date, image_url, created_by } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Thiếu title hoặc content' });
    }

    const [result] = await pool.query(
      'INSERT INTO announcements (title, content, announcement_type, priority, publish_date, expiry_date, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, content, announcement_type || 'general', priority || 0, publish_date || null, expiry_date || null, image_url || null, created_by || null]
    );

    const [newAnnouncement] = await pool.query(
      'SELECT a.*, u.full_name as created_by_name FROM announcements a LEFT JOIN users u ON a.created_by = u.id WHERE a.id = ?',
      [result.insertId]
    );
    res.status(201).json(newAnnouncement[0]);
  } catch (error) {
    console.error('Lỗi khi tạo thông báo:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật thông báo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, announcement_type, priority, publish_date, expiry_date, image_url, is_active } = req.body;

    const [result] = await pool.query(
      'UPDATE announcements SET title = ?, content = ?, announcement_type = ?, priority = ?, publish_date = ?, expiry_date = ?, image_url = ?, is_active = ? WHERE id = ?',
      [title, content, announcement_type, priority, publish_date, expiry_date, image_url, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy thông báo' });
    }

    const [updatedAnnouncement] = await pool.query(
      'SELECT a.*, u.full_name as created_by_name FROM announcements a LEFT JOIN users u ON a.created_by = u.id WHERE a.id = ?',
      [id]
    );
    res.json(updatedAnnouncement[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật thông báo:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa thông báo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM announcements WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy thông báo' });
    }

    res.json({ message: 'Đã xóa thông báo thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa thông báo:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
