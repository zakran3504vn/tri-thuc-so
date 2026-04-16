const pool = require('./src/config/database');

async function check() {
  try {
    const [rows] = await pool.query('SELECT id, title, slug, is_active FROM announcements WHERE slug LIKE ?', ['%khai-giang%']);
    console.log('Found announcements:');
    console.table(rows);
    
    // Check exact slug
    const [exact] = await pool.query('SELECT id, title, slug, is_active FROM announcements WHERE slug = ?', ['khai-giang-nam-hoc-moi-2026-2027-nhieu-diem-moi-dang-chu-y']);
    console.log('\nExact match:');
    console.table(exact);
    
    await pool.end();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

check();
