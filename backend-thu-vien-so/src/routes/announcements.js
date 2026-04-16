const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Helper function to create slug
function createSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Lấy danh sách thông báo
router.get('/', async (req, res) => {
  try {
    const { type, category_id, include_inactive } = req.query;
    let query = `
      SELECT a.*, u.full_name as created_by_name, c.name as category_name, c.color as category_color, c.slug as category_slug
      FROM announcements a 
      LEFT JOIN users u ON a.created_by = u.id 
      LEFT JOIN categories_announcements c ON a.category_id = c.id
    `;
    const params = [];
    const conditions = [];

    if (!include_inactive) {
      conditions.push('(a.is_active = true OR a.is_active IS NULL)');
    }

    if (category_id) {
      conditions.push('a.category_id = ?');
      params.push(category_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.priority DESC, a.publish_date DESC, a.created_at DESC';
    const [rows] = await pool.query(query, params);
    
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thông báo:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy danh sách danh mục thông báo
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM categories_announcements WHERE is_active = true ORDER BY name ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy danh mục theo ID
router.get('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM categories_announcements WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy danh mục' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy danh mục:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy thông báo theo slug (đặt trước /:id để tránh bị match nhầm)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(
      `SELECT a.*, u.full_name as created_by_name, c.name as category_name, c.color as category_color, c.slug as category_slug
       FROM announcements a 
       LEFT JOIN users u ON a.created_by = u.id 
       LEFT JOIN categories_announcements c ON a.category_id = c.id
       WHERE a.slug = ? AND (a.is_active = true OR a.is_active IS NULL)`,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy thông báo' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông báo theo slug:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Lấy thông báo theo ID (đặt sau các route cụ thể)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT a.*, u.full_name as created_by_name, c.name as category_name, c.color as category_color, c.slug as category_slug
       FROM announcements a 
       LEFT JOIN users u ON a.created_by = u.id 
       LEFT JOIN categories_announcements c ON a.category_id = c.id
       WHERE a.id = ?`,
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
    const { title, slug, content, category_id, priority, publish_date, expiry_date, image_url, created_by } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Thiếu title hoặc content' });
    }

    // Tự động tạo slug nếu không cung cấp
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = createSlug(title);
      // Kiểm tra slug đã tồn tại chưa
      const [existing] = await pool.query('SELECT id FROM announcements WHERE slug = ?', [finalSlug]);
      if (existing.length > 0) {
        finalSlug = `${finalSlug}-${Date.now()}`;
      }
    }

    const [result] = await pool.query(
      'INSERT INTO announcements (title, slug, content, category_id, priority, publish_date, expiry_date, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, finalSlug, content, category_id || null, priority || 0, publish_date || null, expiry_date || null, image_url || null, created_by || null]
    );

    const [newAnnouncement] = await pool.query(
      `SELECT a.*, u.full_name as created_by_name, c.name as category_name, c.color as category_color, c.slug as category_slug
       FROM announcements a 
       LEFT JOIN users u ON a.created_by = u.id 
       LEFT JOIN categories_announcements c ON a.category_id = c.id
       WHERE a.id = ?`,
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
    const { title, slug, content, category_id, priority, publish_date, expiry_date, image_url, is_active } = req.body;

    // Nếu có title mới nhưng không có slug, tự động tạo slug mới
    let finalSlug = slug;
    if (title && !slug) {
      finalSlug = createSlug(title);
      // Kiểm tra slug đã tồn tại chưa (trừ chính thông báo này)
      const [existing] = await pool.query('SELECT id FROM announcements WHERE slug = ? AND id != ?', [finalSlug, id]);
      if (existing.length > 0) {
        finalSlug = `${finalSlug}-${Date.now()}`;
      }
    }

    const [result] = await pool.query(
      'UPDATE announcements SET title = ?, slug = ?, content = ?, category_id = ?, priority = ?, publish_date = ?, expiry_date = ?, image_url = ?, is_active = ? WHERE id = ?',
      [title, finalSlug, content, category_id, priority, publish_date, expiry_date, image_url, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy thông báo' });
    }

    const [updatedAnnouncement] = await pool.query(
      `SELECT a.*, u.full_name as created_by_name, c.name as category_name, c.color as category_color, c.slug as category_slug
       FROM announcements a 
       LEFT JOIN users u ON a.created_by = u.id 
       LEFT JOIN categories_announcements c ON a.category_id = c.id
       WHERE a.id = ?`,
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

// ==== CATEGORIES MANAGEMENT ROUTES ====

// Tạo danh mục mới
router.post('/categories', async (req, res) => {
  try {
    const { name, slug, color, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Thiếu tên danh mục' });
    }

    // Tự động tạo slug nếu không cung cấp
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = createSlug(name);
      const [existing] = await pool.query('SELECT id FROM categories_announcements WHERE slug = ?', [finalSlug]);
      if (existing.length > 0) {
        finalSlug = `${finalSlug}-${Date.now()}`;
      }
    }

    const [result] = await pool.query(
      'INSERT INTO categories_announcements (name, slug, color, description) VALUES (?, ?, ?, ?)',
      [name, finalSlug, color || 'blue', description || null]
    );

    const [newCategory] = await pool.query(
      'SELECT * FROM categories_announcements WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(newCategory[0]);
  } catch (error) {
    console.error('Lỗi khi tạo danh mục:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Cập nhật danh mục
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, color, description, is_active } = req.body;

    // Nếu có name mới nhưng không có slug, tự động tạo slug mới
    let finalSlug = slug;
    if (name && !slug) {
      finalSlug = createSlug(name);
      const [existing] = await pool.query('SELECT id FROM categories_announcements WHERE slug = ? AND id != ?', [finalSlug, id]);
      if (existing.length > 0) {
        finalSlug = `${finalSlug}-${Date.now()}`;
      }
    }

    const [result] = await pool.query(
      'UPDATE categories_announcements SET name = ?, slug = ?, color = ?, description = ?, is_active = ? WHERE id = ?',
      [name, finalSlug, color, description, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy danh mục' });
    }

    const [updatedCategory] = await pool.query(
      'SELECT * FROM categories_announcements WHERE id = ?',
      [id]
    );
    res.json(updatedCategory[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật danh mục:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xóa danh mục
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra xem có thông báo nào đang sử dụng danh mục này không
    const [announcements] = await pool.query('SELECT COUNT(*) as count FROM announcements WHERE category_id = ?', [id]);
    if (announcements[0].count > 0) {
      return res.status(400).json({ error: 'Không thể xóa danh mục đang có thông báo' });
    }
    
    const [result] = await pool.query('DELETE FROM categories_announcements WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy danh mục' });
    }

    res.json({ message: 'Đã xóa danh mục thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa danh mục:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
