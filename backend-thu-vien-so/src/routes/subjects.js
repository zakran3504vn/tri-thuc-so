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
    const [existing] = await pool.query('SELECT id FROM subjects WHERE slug = ?', [slug]);
    if (existing.length === 0) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Lấy danh sách môn học
router.get('/', async (req, res) => {
  try {
    const { grade_level, teacher_id } = req.query;
    let query = 'SELECT s.*, u.full_name as teacher_name FROM subjects s LEFT JOIN users u ON s.teacher_id = u.id WHERE s.is_active = true';
    const params = [];

    if (grade_level) {
      query += ' AND s.grade_level = ?';
      params.push(grade_level);
    }

    if (teacher_id) {
      query += ' AND s.teacher_id = ?';
      params.push(teacher_id);
    }

    query += ' ORDER BY s.created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách môn học:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy môn học theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT s.*, u.full_name as teacher_name FROM subjects s LEFT JOIN users u ON s.teacher_id = u.id WHERE s.id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy môn học' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy môn học:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy môn học theo slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(
      'SELECT s.*, u.full_name as teacher_name FROM subjects s LEFT JOIN users u ON s.teacher_id = u.id WHERE s.slug = ?',
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy môn học' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy môn học theo slug:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo môn học mới
router.post('/', async (req, res) => {
  try {
    const { title, description, grade_level, teacher_id, thumbnail } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Thiếu tiêu đề môn học' });
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(title);

    const [result] = await pool.query(
      'INSERT INTO subjects (title, slug, description, grade_level, teacher_id, thumbnail) VALUES (?, ?, ?, ?, ?, ?)',
      [title, slug, description || null, grade_level || null, teacher_id || null, thumbnail || null]
    );

    const [newSubject] = await pool.query(
      'SELECT s.*, u.full_name as teacher_name FROM subjects s LEFT JOIN users u ON s.teacher_id = u.id WHERE s.id = ?',
      [result.insertId]
    );
    res.status(201).json(newSubject[0]);
  } catch (error) {
    console.error('Lỗi khi tạo môn học:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật môn học
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, grade_level, teacher_id, thumbnail, is_active } = req.body;

    // Get current subject to check if title changed
    const [current] = await pool.query('SELECT * FROM subjects WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy môn học' });
    }

    let slug = current[0].slug;
    if (title && title !== current[0].title) {
      // Generate new slug if title changed
      slug = await generateUniqueSlug(title);
    }

    const [result] = await pool.query(
      'UPDATE subjects SET title = ?, slug = ?, description = ?, grade_level = ?, teacher_id = ?, thumbnail = ?, is_active = ? WHERE id = ?',
      [title, slug, description, grade_level, teacher_id, thumbnail, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy môn học' });
    }

    const [updatedSubject] = await pool.query(
      'SELECT s.*, u.full_name as teacher_name FROM subjects s LEFT JOIN users u ON s.teacher_id = u.id WHERE s.id = ?',
      [id]
    );
    res.json(updatedSubject[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật môn học:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa môn học
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM subjects WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy môn học' });
    }

    res.json({ message: 'Đã xóa môn học thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa môn học:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
