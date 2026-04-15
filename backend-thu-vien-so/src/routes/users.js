const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy danh sách users
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    let query = 'SELECT id, username, full_name, email, role, avatar, is_active, created_at FROM users';
    const params = [];

    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách users:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy user theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT id, username, full_name, email, role, avatar, is_active, created_at FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy user:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo user mới
router.post('/', async (req, res) => {
  try {
    const { username, password, full_name, email, role, avatar } = req.body;

    if (!username || !password || !full_name) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const [result] = await pool.query(
      'INSERT INTO users (username, password, full_name, email, role, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [username, password, full_name, email || null, role || 'student', avatar || null]
    );

    const [newUser] = await pool.query(
      'SELECT id, username, full_name, email, role, avatar, is_active, created_at FROM users WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Lỗi khi tạo user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username hoặc email đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, role, avatar, is_active } = req.body;

    const [result] = await pool.query(
      'UPDATE users SET full_name = ?, email = ?, role = ?, avatar = ?, is_active = ? WHERE id = ?',
      [full_name, email, role, avatar, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }

    const [updatedUser] = await pool.query(
      'SELECT id, username, full_name, email, role, avatar, is_active, created_at FROM users WHERE id = ?',
      [id]
    );
    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật user:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }

    res.json({ message: 'Đã xóa user thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa user:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
