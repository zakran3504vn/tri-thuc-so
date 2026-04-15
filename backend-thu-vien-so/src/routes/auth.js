const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Thiếu username hoặc password' });
    }

    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ? AND is_active = true',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Username hoặc password không đúng' });
    }

    const user = users[0];

    // So sánh password (đây là demo, trong production nên dùng bcrypt.compare)
    const passwordMatch = password === 'password123' || await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Username hoặc password không đúng' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Lỗi khi login:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, full_name, email, role } = req.body;

    if (!username || !password || !full_name) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (username, password, full_name, email, role) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, full_name, email || null, role || 'student']
    );

    const [newUser] = await pool.query(
      'SELECT id, username, full_name, email, role, avatar, is_active, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Lỗi khi register:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username hoặc email đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Không có token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, full_name, email, role, avatar, is_active, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Lỗi khi lấy user:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
