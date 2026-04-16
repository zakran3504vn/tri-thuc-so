const pool = require('../../config/database');

async function migrate() {
  try {
    console.log('Đang chạy migration: Xóa cột announcement_type...');

    // Check if column exists
    const [columns] = await pool.query(`
      SHOW COLUMNS FROM announcements LIKE 'announcement_type'
    `);

    if (columns.length > 0) {
      // Drop the column
      await pool.query(`
        ALTER TABLE announcements DROP COLUMN announcement_type
      `);
      console.log('Đã xóa cột announcement_type');
    } else {
      console.log('Cột announcement_type không tồn tại');
    }

    console.log('Migration hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi chạy migration:', error);
    process.exit(1);
  }
}

migrate();
