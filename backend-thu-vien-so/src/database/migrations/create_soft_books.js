const pool = require('../../config/database');

async function migrate() {
  try {
    console.log('Đang chạy migration: Tạo bảng soft_books...');

    // Check if soft_books table already exists
    const [tables] = await pool.query(`
      SHOW TABLES LIKE 'soft_books'
    `);

    if (tables.length === 0) {
      // Create soft_books table
      await pool.query(`
        CREATE TABLE soft_books (
          id INT AUTO_INCREMENT PRIMARY KEY,
          subject_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          author VARCHAR(255),
          description TEXT,
          file_url TEXT NOT NULL,
          file_type VARCHAR(50),
          file_size INT,
          cover_image TEXT,
          order_index INT DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('Đã tạo bảng soft_books');
    } else {
      console.log('Bảng soft_books đã tồn tại');

      // Check if slug column exists
      const [columns] = await pool.query(`
        SHOW COLUMNS FROM soft_books LIKE 'slug'
      `);

      if (columns.length === 0) {
        // Add slug column as nullable first
        await pool.query(`
          ALTER TABLE soft_books
          ADD COLUMN slug VARCHAR(255) NULL AFTER title
        `);
        console.log('Đã thêm cột slug vào bảng soft_books');
      } else {
        console.log('Cột slug đã tồn tại trong bảng soft_books');
      }
    }

    console.log('Migration hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi chạy migration:', error);
    process.exit(1);
  }
}

migrate();
