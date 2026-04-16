const pool = require('./src/config/database');

async function check() {
  try {
    console.log('=== Kiểm tra database ===\n');
    
    // Kiểm tra tổng số thông báo
    const [total] = await pool.query('SELECT COUNT(*) as count FROM announcements');
    console.log('Tổng số thông báo:', total[0].count);
    
    // Kiểm tra thông báo active
    const [active] = await pool.query('SELECT COUNT(*) as count FROM announcements WHERE is_active = true');
    console.log('Thông báo đang active:', active[0].count);
    
    // Xem 3 thông báo đầu tiên
    const [rows] = await pool.query('SELECT id, title, slug, is_active, category_id FROM announcements LIMIT 3');
    console.log('\n3 thông báo đầu tiên:');
    console.table(rows);
    
    // Kiểm tra danh mục
    const [cats] = await pool.query('SELECT COUNT(*) as count FROM categories_announcements');
    console.log('\nTổng số danh mục:', cats[0].count);
    
    await pool.end();
  } catch (err) {
    console.error('Lỗi:', err);
  }
}

check();
