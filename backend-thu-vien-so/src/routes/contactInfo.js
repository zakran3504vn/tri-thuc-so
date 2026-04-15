const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy thông tin liên hệ (chỉ có 1 record)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_info ORDER BY id DESC LIMIT 1');
    
    if (rows.length === 0) {
      // Trả về object rỗng nếu chưa có dữ liệu
      return res.json({
        id: null,
        address: '',
        phone: '',
        email: '',
        working_hours: '',
        map_iframe: ''
      });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin liên hệ:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật thông tin liên hệ
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { address, phone, email, working_hours, map_iframe } = req.body;

    const [result] = await pool.query(
      'UPDATE contact_info SET address = ?, phone = ?, email = ?, working_hours = ?, map_iframe = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [address, phone, email, working_hours, map_iframe, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin liên hệ' });
    }

    const [updatedContact] = await pool.query('SELECT * FROM contact_info WHERE id = ?', [id]);
    res.json(updatedContact[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin liên hệ:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo thông tin liên hệ mới
router.post('/', async (req, res) => {
  try {
    const { address, phone, email, working_hours, map_iframe } = req.body;

    const [result] = await pool.query(
      'INSERT INTO contact_info (address, phone, email, working_hours, map_iframe) VALUES (?, ?, ?, ?, ?)',
      [address, phone, email, working_hours, map_iframe]
    );

    const [newContact] = await pool.query('SELECT * FROM contact_info WHERE id = ?', [result.insertId]);
    res.status(201).json(newContact[0]);
  } catch (error) {
    console.error('Lỗi khi tạo thông tin liên hệ:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
