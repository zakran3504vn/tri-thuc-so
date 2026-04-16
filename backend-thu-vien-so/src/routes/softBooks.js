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
    const [existing] = await pool.query('SELECT id FROM soft_books WHERE slug = ?', [slug]);
    if (existing.length === 0) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Lấy danh sách sách mềm theo môn học
router.get('/', async (req, res) => {
  try {
    const { subject_id } = req.query;
    let query = 'SELECT * FROM soft_books WHERE is_active = true';
    const params = [];

    if (subject_id) {
      query += ' AND subject_id = ?';
      params.push(subject_id);
    }

    query += ' ORDER BY order_index ASC, id ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách mềm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy chi tiết sách mềm theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM soft_books WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sách mềm' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sách mềm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo sách mềm mới
router.post('/', async (req, res) => {
  try {
    const { subject_id, title, author, description, file_url, file_type, file_size, cover_image, order_index, is_active } = req.body;

    if (!subject_id || !title || !file_url) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(title);

    const [result] = await pool.query(
      'INSERT INTO soft_books (subject_id, title, slug, author, description, file_url, file_type, file_size, cover_image, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [subject_id, title, slug, author || null, description || null, file_url, file_type || null, file_size || null, cover_image || null, order_index || 0, is_active !== undefined ? is_active : true]
    );

    const [newSoftBook] = await pool.query('SELECT * FROM soft_books WHERE id = ?', [result.insertId]);
    res.status(201).json(newSoftBook[0]);
  } catch (error) {
    console.error('Lỗi khi tạo sách mềm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật sách mềm
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_id, title, author, description, file_url, file_type, file_size, cover_image, order_index, is_active } = req.body;

    // Get current soft book to check if title changed
    const [current] = await pool.query('SELECT * FROM soft_books WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sách mềm' });
    }

    let slug = current[0].slug;
    if (title && title !== current[0].title) {
      // Generate new slug if title changed
      slug = await generateUniqueSlug(title);
    }

    const [result] = await pool.query(
      'UPDATE soft_books SET subject_id = ?, title = ?, slug = ?, author = ?, description = ?, file_url = ?, file_type = ?, file_size = ?, cover_image = ?, order_index = ?, is_active = ? WHERE id = ?',
      [subject_id, title, slug, author, description, file_url, file_type, file_size, cover_image, order_index, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sách mềm' });
    }

    const [updatedSoftBook] = await pool.query('SELECT * FROM soft_books WHERE id = ?', [id]);
    res.json(updatedSoftBook[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật sách mềm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa sách mềm
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM soft_books WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sách mềm' });
    }

    res.json({ message: 'Đã xóa sách mềm thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa sách mềm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
