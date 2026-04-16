const pool = require('../../config/database');

async function migrate() {
  try {
    console.log('Đang chạy migration: Thêm cột is_featured vào bảng reference_books...');

    // Check if is_featured column already exists
    const [columns] = await pool.query(`
      SHOW COLUMNS FROM reference_books LIKE 'is_featured'
    `);

    if (columns.length === 0) {
      // Add is_featured column
      await pool.query(`
        ALTER TABLE reference_books 
        ADD COLUMN is_featured BOOLEAN DEFAULT FALSE AFTER cover_image
      `);
      console.log('Đã thêm cột is_featured vào bảng reference_books');
    } else {
      console.log('Cột is_featured đã tồn tại trong bảng reference_books');
    }

    console.log('Migration hoàn tất!');
  } catch (error) {
    console.error('Lỗi khi chạy migration:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrate };
