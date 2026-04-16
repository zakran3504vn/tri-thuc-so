const pool = require('../../config/database');

async function up() {
  try {
    console.log('Creating homepage tables...');

    // Create banners table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        link_url TEXT,
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create stats table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        value VARCHAR(255) NOT NULL,
        icon VARCHAR(100),
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create news table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        date VARCHAR(20) NOT NULL,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content TEXT,
        image_url TEXT,
        is_highlighted BOOLEAN DEFAULT FALSE,
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Insert sample banners
    await pool.query(`
      INSERT INTO banners (title, description, image_url, link_url, order_index, is_active) VALUES
      ('Chào mừng đến với Thư viện số', 'Khám phá kho tàng kiến thức vô tận với hàng ngàn đầu sách, bài giảng và tài liệu học tập', 'https://readdy.ai/api/search-image?query=library%20digital%20education%20books%20colorful%20modern%20clean%20background&width=1200&height=400&seq=banner001&orientation=landscape', '/mon-hoc', 1, true),
      ('Bài giảng chất lượng cao', 'Hệ thống bài giảng đa dạng, phong phú theo chương trình chuẩn quốc gia', 'https://readdy.ai/api/search-image?query=online%20learning%20students%20education%20modern%20clean%20background&width=1200&height=400&seq=banner002&orientation=landscape', '/mon-hoc', 2, true),
      ('Thư viện sách phong phú', 'Hàng ngàn đầu sách, truyện và tài liệu tham khảo miễn phí', 'https://readdy.ai/api/search-image?query=books%20library%20reading%20education%20colorful%20clean&width=1200&height=400&seq=banner003&orientation=landscape', '/truyen-doc', 3, true)
      ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description)
    `);

    // Insert sample stats
    await pool.query(`
      INSERT INTO stats (label, value, icon, order_index, is_active) VALUES
      ('Học sinh', '10,000+', 'ri-user-line', 1, true),
      ('Bài giảng', '500+', 'ri-video-line', 2, true),
      ('Sách điện tử', '2,000+', 'ri-book-line', 3, true),
      ('Giáo viên', '100+', 'ri-user-star-line', 4, true)
      ON DUPLICATE KEY UPDATE label=VALUES(label), value=VALUES(value)
    `);

    // Insert sample news
    await pool.query(`
      INSERT INTO news (category, date, title, excerpt, image_url, is_highlighted, order_index) VALUES
      ('Tin tức', '15/04/2026', 'Khánh thành thư viện số toàn quốc', 'Thư viện số chính thức đi vào hoạt động với hàng ngàn tài liệu học tập và sách điện tử...', 'https://readdy.ai/api/search-image?query=school%20opening%20ceremony%20Vietnamese%20students%20happy%20colorful%20classroom%20modern%20education%20warm%20light&width=600&height=400&seq=news001&orientation=landscape', true, 1),
      ('Hoạt động', '08/04/2026', 'Cuộc thi Đọc sách hay - Chia sẻ tri thức lần thứ 5', 'Thư viện số tổ chức cuộc thi đọc sách với nhiều phần thưởng hấp dẫn dành cho học sinh toàn quốc...', 'https://readdy.ai/api/search-image?query=reading%20competition%20children%20books%20library%20colorful%20warm%20atmosphere%20Vietnamese%20school%20event&width=600&height=400&seq=news002&orientation=landscape', false, 2),
      ('Tài nguyên', '05/04/2026', 'Ra mắt bộ sách tham khảo Toán - Văn - Anh lớp 6 mới nhất', 'Bộ sách tham khảo mới được biên soạn bởi đội ngũ giáo viên giàu kinh nghiệm, bám sát chương trình 2025...', 'https://readdy.ai/api/search-image?query=new%20textbooks%20stack%20colorful%20covers%20education%20clean%20background%20modern%20Vietnamese%20school%20books&width=600&height=400&seq=news003&orientation=landscape', false, 3)
      ON DUPLICATE KEY UPDATE title=VALUES(title), excerpt=VALUES(excerpt)
    `);

    console.log('Homepage tables created successfully!');
  } catch (error) {
    console.error('Error creating homepage tables:', error);
    throw error;
  }
}

async function down() {
  try {
    console.log('Dropping homepage tables...');
    await pool.query('DROP TABLE IF EXISTS news');
    await pool.query('DROP TABLE IF EXISTS stats');
    await pool.query('DROP TABLE IF EXISTS banners');
    console.log('Homepage tables dropped successfully!');
  } catch (error) {
    console.error('Error dropping homepage tables:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  up()
    .then(() => {
      console.log('Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { up, down };
