const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Lấy danh sách sách tham khảo
router.get('/', async (req, res) => {
  try {
    const { category, subject_id, grade, min_pages, max_pages } = req.query;
    let query = 'SELECT * FROM reference_books WHERE is_active = true';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (subject_id) {
      query += ' AND subject_id = ?';
      params.push(subject_id);
    }

    if (grade) {
      query += ' AND grade = ?';
      params.push(grade);
    }

    if (min_pages) {
      query += ' AND number_of_pages >= ?';
      params.push(min_pages);
    }

    if (max_pages) {
      query += ' AND number_of_pages <= ?';
      params.push(max_pages);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách tham khảo:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy sách nổi bật (featured)
router.get('/featured', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM reference_books WHERE is_active = true AND is_featured = true ORDER BY created_at DESC LIMIT 6'
    );
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy sách nổi bật:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy sách tham khảo theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM reference_books WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sách tham khảo' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy sách tham khảo:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo sách tham khảo mới
router.post('/', async (req, res) => {
  try {
    const { title, author, description, category, subject_id, grade, number_of_pages, file_url, file_type, file_size, cover_image, is_featured } = req.body;

    if (!title || !file_url) {
      return res.status(400).json({ error: 'Thiếu title hoặc file_url' });
    }

    const [result] = await pool.query(
      'INSERT INTO reference_books (title, author, description, category, subject_id, grade, number_of_pages, file_url, file_type, file_size, cover_image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, author || null, description || null, category || null, subject_id || null, grade || null, number_of_pages || null, file_url, file_type || null, file_size || null, cover_image || null, is_featured || false]
    );

    const [newBook] = await pool.query('SELECT * FROM reference_books WHERE id = ?', [result.insertId]);
    res.status(201).json(newBook[0]);
  } catch (error) {
    console.error('Lỗi khi tạo sách tham khảo:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật sách tham khảo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, category, subject_id, grade, number_of_pages, file_url, file_type, file_size, cover_image, is_active, is_featured } = req.body;

    const [result] = await pool.query(
      'UPDATE reference_books SET title = ?, author = ?, description = ?, category = ?, subject_id = ?, grade = ?, number_of_pages = ?, file_url = ?, file_type = ?, file_size = ?, cover_image = ?, is_active = ?, is_featured = ? WHERE id = ?',
      [title, author, description, category, subject_id, grade, number_of_pages, file_url, file_type, file_size, cover_image, is_active, is_featured, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sách tham khảo' });
    }

    const [updatedBook] = await pool.query('SELECT * FROM reference_books WHERE id = ?', [id]);
    res.json(updatedBook[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật sách tham khảo:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa sách tham khảo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM reference_books WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sách tham khảo' });
    }

    res.json({ message: 'Đã xóa sách tham khảo thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa sách tham khảo:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
