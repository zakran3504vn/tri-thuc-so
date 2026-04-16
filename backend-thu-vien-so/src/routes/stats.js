const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all stats
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM stats WHERE is_active = true ORDER BY order_index ASC, created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách stats:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Get stat by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM stats WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy stat' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy stat:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Create stat
router.post('/', async (req, res) => {
  try {
    const { label, value, icon, order_index, is_active } = req.body;
    if (!label || !value) {
      return res.status(400).json({ error: 'Thiếu nhãn hoặc giá trị' });
    }
    const [result] = await pool.query(
      'INSERT INTO stats (label, value, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?)',
      [label, value, icon, order_index || 0, is_active !== undefined ? is_active : true]
    );
    const [newStat] = await pool.query('SELECT * FROM stats WHERE id = ?', [result.insertId]);
    res.status(201).json(newStat[0]);
  } catch (error) {
    console.error('Lỗi khi tạo stat:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Update stat
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { label, value, icon, order_index, is_active } = req.body;
    await pool.query(
      'UPDATE stats SET label = ?, value = ?, icon = ?, order_index = ?, is_active = ? WHERE id = ?',
      [label, value, icon, order_index, is_active, id]
    );
    const [updatedStat] = await pool.query('SELECT * FROM stats WHERE id = ?', [id]);
    if (updatedStat.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy stat' });
    }
    res.json(updatedStat[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật stat:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Delete stat
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM stats WHERE id = ?', [id]);
    res.json({ message: 'Đã xóa stat' });
  } catch (error) {
    console.error('Lỗi khi xóa stat:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
