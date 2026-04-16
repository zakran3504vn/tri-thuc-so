const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Helper function to generate unique slug
async function generateUniqueSlug(title) {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const [existing] = await pool.query('SELECT id FROM tests WHERE slug = ?', [slug]);
    if (existing.length === 0) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Lấy danh sách đề kiểm tra theo môn học
router.get('/', async (req, res) => {
  try {
    const { subject_id } = req.query;
    let query = 'SELECT * FROM tests WHERE is_active = true';
    const params = [];

    if (subject_id) {
      query += ' AND subject_id = ?';
      params.push(subject_id);
    }

    query += ' ORDER BY order_index ASC, id ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đề kiểm tra:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy chi tiết đề kiểm tra theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM tests WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đề kiểm tra' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đề kiểm tra:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo đề kiểm tra mới
router.post('/', async (req, res) => {
  try {
    const { subject_id, title, description, file_url, duration, total_questions, passing_score, order_index, is_active } = req.body;

    if (!subject_id || !title) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(title);

    const [result] = await pool.query(
      'INSERT INTO tests (subject_id, title, slug, description, file_url, duration, total_questions, passing_score, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [subject_id, title, slug, description || null, file_url || null, duration || null, total_questions || null, passing_score || null, order_index || 0, is_active !== undefined ? is_active : true]
    );

    const [newTest] = await pool.query('SELECT * FROM tests WHERE id = ?', [result.insertId]);
    res.status(201).json(newTest[0]);
  } catch (error) {
    console.error('Lỗi khi tạo đề kiểm tra:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật đề kiểm tra
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_id, title, description, file_url, duration, total_questions, passing_score, order_index, is_active } = req.body;

    // Get current test to check if title changed
    const [current] = await pool.query('SELECT * FROM tests WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đề kiểm tra' });
    }

    let slug = current[0].slug;
    if (title && title !== current[0].title) {
      // Generate new slug if title changed
      slug = await generateUniqueSlug(title);
    }

    const [result] = await pool.query(
      'UPDATE tests SET subject_id = ?, title = ?, slug = ?, description = ?, file_url = ?, duration = ?, total_questions = ?, passing_score = ?, order_index = ?, is_active = ? WHERE id = ?',
      [subject_id, title, slug, description, file_url, duration, total_questions, passing_score, order_index, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đề kiểm tra' });
    }

    const [updatedTest] = await pool.query('SELECT * FROM tests WHERE id = ?', [id]);
    res.json(updatedTest[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật đề kiểm tra:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa đề kiểm tra
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM tests WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đề kiểm tra' });
    }

    res.json({ message: 'Đã xóa đề kiểm tra thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa đề kiểm tra:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
