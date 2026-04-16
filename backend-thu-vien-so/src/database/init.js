const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('Đang tạo database...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'thu_vien_so'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE ${process.env.DB_NAME || 'thu_vien_so'}`);

    console.log('Đang tạo bảng stories...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        total_pages INT NOT NULL,
        cover_image TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Đang tạo bảng pages...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        story_id INT NOT NULL,
        page_number INT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
        UNIQUE KEY unique_page (story_id, page_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Đang tạo bảng bookmarks...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        story_id INT NOT NULL,
        page_number INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
        UNIQUE KEY unique_bookmark (user_id, story_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Đang tạo bảng notes...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        story_id INT NOT NULL,
        page_number INT NOT NULL,
        note_content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
        UNIQUE KEY unique_note (user_id, story_id, page_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Đang tạo bảng users...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        role ENUM('admin', 'teacher', 'student') DEFAULT 'student',
        avatar TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Đang tạo bảng môn học...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        grade_level VARCHAR(50),
        teacher_id INT,
        thumbnail TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Add slug column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE subjects
        ADD COLUMN slug VARCHAR(255) NOT NULL UNIQUE AFTER title
      `);
      console.log('Đã thêm cột slug vào bảng subjects');
    } catch (error) {
      // Column already exists, ignore error
      console.log('Cột slug đã tồn tại trong bảng subjects');
    }

    console.log('Đang tạo bảng bài giảng (lessons)...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subject_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        video_url TEXT,
        video_duration INT,
        content TEXT,
        week_number INT,
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Add week_number column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE lessons
        ADD COLUMN week_number INT AFTER content
      `);
      console.log('Đã thêm cột week_number vào bảng lessons');
    } catch (error) {
      // Column already exists, ignore error
      console.log('Cột week_number đã tồn tại trong bảng lessons');
    }

    // Add thumbnail column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE lessons
        ADD COLUMN thumbnail TEXT AFTER video_url
      `);
      console.log('Đã thêm cột thumbnail vào bảng lessons');
    } catch (error) {
      // Column already exists, ignore error
      console.log('Cột thumbnail đã tồn tại trong bảng lessons');
    }

    console.log('Đang tạo bảng hoạt động...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        activity_date DATE,
        location VARCHAR(255),
        thumbnail TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Đang tạo bảng hình ảnh hoạt động...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activity_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        activity_id INT NOT NULL,
        image_url TEXT NOT NULL,
        caption VARCHAR(255),
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Đang tạo bảng sách tham khảo...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reference_books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        description TEXT,
        category VARCHAR(100),
        subject_id INT,
        grade VARCHAR(50),
        number_of_pages INT,
        file_url TEXT NOT NULL,
        file_type VARCHAR(50),
        file_size INT,
        cover_image TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Đang tạo bảng danh mục thông báo...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories_announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        color VARCHAR(20) DEFAULT 'blue',
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Đang tạo bảng thông báo...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        category_id INT,
        priority INT DEFAULT 0,
        publish_date DATETIME,
        expiry_date DATETIME,
        image_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES categories_announcements(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Đang tạo bảng banners...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        link_url VARCHAR(255) DEFAULT '/mon-hoc',
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Đang tạo bảng stats...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        label VARCHAR(100) NOT NULL,
        value VARCHAR(50) NOT NULL,
        icon VARCHAR(50) DEFAULT 'ri-star-line',
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Đang tạo bảng thông tin liên hệ...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        address TEXT,
        phone VARCHAR(50),
        email VARCHAR(255),
        working_hours TEXT,
        map_iframe TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Đang tạo bảng tin nhắn liên hệ...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Thêm cột slug nếu chưa tồn tại
    try {
      await connection.query(`
        ALTER TABLE announcements ADD COLUMN slug VARCHAR(255) NOT NULL UNIQUE AFTER title
      `);
      console.log('Đã thêm cột slug vào bảng announcements');
    } catch (error) {
      console.log('Cột slug đã tồn tại hoặc không thể thêm');
    }

    // Thêm cột category_id nếu chưa tồn tại
    try {
      await connection.query(`
        ALTER TABLE announcements ADD COLUMN category_id INT AFTER announcement_type
      `);
      await connection.query(`
        ALTER TABLE announcements ADD FOREIGN KEY (category_id) REFERENCES categories_announcements(id) ON DELETE SET NULL
      `);
      console.log('Đã thêm cột category_id vào bảng announcements');
    } catch (error) {
      console.log('Cột category_id đã tồn tại hoặc không thể thêm');
    }

    // Thêm cột image_url nếu bảng đã tồn tại nhưng chưa có cột này
    try {
      await connection.query(`
        ALTER TABLE announcements ADD COLUMN image_url TEXT AFTER expiry_date
      `);
      console.log('Đã thêm cột image_url vào bảng announcements');
    } catch (error) {
      // Cột có thể đã tồn tại, bỏ qua lỗi
      console.log('Cột image_url đã tồn tại hoặc không thể thêm');
    }

    // Insert default categories if not exist
    try {
      await connection.query(`
        INSERT IGNORE INTO categories_announcements (id, name, slug, color, description) VALUES
        (1, 'Thông báo chung', 'thong-bao-chung', 'blue', 'Các thông báo chung của nhà trường'),
        (2, 'Khẩn cấp', 'khan-cap', 'red', 'Thông báo khẩn cấp, cần chú ý ngay'),
        (3, 'Sự kiện', 'su-kien', 'green', 'Thông tin về các sự kiện sắp diễn ra'),
        (4, 'Học tập', 'hoc-tap', 'purple', 'Thông báo liên quan đến học tập'),
        (5, 'Hoạt động', 'hoat-dong', 'orange', 'Thông tin về hoạt động ngoại khóa')
      `);
      console.log('Đã thêm danh mục thông báo mặc định');
    } catch (error) {
      console.log('Danh mục thông báo đã tồn tại hoặc không thể thêm');
    }

    // Thêm các cột mới vào bảng reference_books nếu chưa tồn tại
    try {
      await connection.query(`
        ALTER TABLE reference_books ADD COLUMN subject_id INT AFTER category
      `);
      console.log('Đã thêm cột subject_id vào bảng reference_books');
    } catch (error) {
      console.log('Cột subject_id đã tồn tại hoặc không thể thêm');
    }

    try {
      await connection.query(`
        ALTER TABLE reference_books ADD COLUMN grade VARCHAR(50) AFTER subject_id
      `);
      console.log('Đã thêm cột grade vào bảng reference_books');
    } catch (error) {
      console.log('Cột grade đã tồn tại hoặc không thể thêm');
    }

    try {
      await connection.query(`
        ALTER TABLE reference_books ADD COLUMN number_of_pages INT AFTER grade
      `);
      console.log('Đã thêm cột number_of_pages vào bảng reference_books');
    } catch (error) {
      console.log('Cột number_of_pages đã tồn tại hoặc không thể thêm');
    }

    try {
      await connection.query(`
        ALTER TABLE reference_books ADD FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
      `);
      console.log('Đã thêm foreign key cho subject_id');
    } catch (error) {
      console.log('Foreign key đã tồn tại hoặc không thể thêm');
    }

    console.log('Đang tạo bảng bài tập bổ trợ (exercises)...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS exercises (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subject_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT,
        file_url TEXT,
        difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Add file_url column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE exercises
        ADD COLUMN file_url TEXT AFTER content
      `);
      console.log('Đã thêm cột file_url vào bảng exercises');
    } catch (error) {
      // Column already exists, ignore error
      console.log('Cột file_url đã tồn tại trong bảng exercises');
    }

    console.log('Đang tạo bảng đề kiểm tra (tests)...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subject_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        file_url TEXT,
        duration INT COMMENT 'Thời gian làm bài tính bằng phút',
        total_questions INT,
        passing_score INT COMMENT 'Điểm đạt tính theo thang điểm 100',
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Add slug column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE tests
        ADD COLUMN slug VARCHAR(255) NOT NULL UNIQUE AFTER title
      `);
      console.log('Đã thêm cột slug vào bảng tests');
    } catch (error) {
      // Column already exists, ignore error
      console.log('Cột slug đã tồn tại trong bảng tests');
    }

    // Add file_url column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE tests
        ADD COLUMN file_url TEXT AFTER description
      `);
      console.log('Đã thêm cột file_url vào bảng tests');
    } catch (error) {
      // Column already exists, ignore error
      console.log('Cột file_url đã tồn tại trong bảng tests');
    }

    console.log('Đang tạo bảng sách mềm (soft_books)...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS soft_books (
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

    // Add slug column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE soft_books
        ADD COLUMN slug VARCHAR(255) NOT NULL UNIQUE AFTER title
      `);
      console.log('Đã thêm cột slug vào bảng soft_books');
    } catch (error) {
      // Column already exists, ignore error
      console.log('Cột slug đã tồn tại trong bảng soft_books');
    }

    console.log('Đang tạo dữ liệu mẫu...');
    
    // Insert sample stories
    const [result] = await connection.query(`
      INSERT INTO stories (id, title, author, category, total_pages, cover_image, description) VALUES
      (1, 'Dế Mèn Phiêu Lưu Ký', 'Tô Hoài', 'Phiêu lưu', 6, 'https://readdy.ai/api/search-image?query=Vietnamese%20children%20story%20book%20cover%20cricket%20adventure%20colorful%20illustration%20warm%20background%20simple%20clean&width=200&height=280&seq=tr001&orientation=portrait', 'Câu chuyện phiêu lưu của chú dế Mèn đáng yêu'),
      (2, 'Cô Bé Bán Diêm', 'H.C. Andersen', 'Cổ tích', 5, 'https://readdy.ai/api/search-image?query=fairy%20tale%20book%20cover%20little%20match%20girl%20illustration%20warm%20golden%20light%20snow%20winter%20simple%20clean&width=200&height=280&seq=tr002&orientation=portrait', 'Câu chuyện cổ tích cảm động về cô bé bán diêm'),
      (3, 'Hoàng Tử Bé', 'Antoine de Saint-Exupéry', 'Thiếu nhi', 5, 'https://readdy.ai/api/search-image?query=The%20Little%20Prince%20book%20cover%20illustration%20planet%20stars%20night%20sky%20blue%20purple%20simple%20clean%20children&width=200&height=280&seq=tr003&orientation=portrait', 'Câu chuyện triết lý về tình bạn và tình yêu'),
      (4, 'Cuộc Phiêu Lưu Của Tom Sawyer', 'Mark Twain', 'Phiêu lưu', 4, 'https://readdy.ai/api/search-image?query=Tom%20Sawyer%20adventure%20book%20cover%20river%20boy%20illustration%20warm%20colors%20simple%20clean%20children&width=200&height=280&seq=tr004&orientation=portrait', 'Cuộc phiêu lưu của cậu bé Tom Sawyer nghịch ngợm'),
      (5, 'Truyện Cổ Tích Việt Nam', 'Nhiều tác giả', 'Cổ tích', 8, 'https://readdy.ai/api/search-image?query=Vietnamese%20folk%20tales%20book%20cover%20traditional%20illustration%20colorful%20warm%20background%20simple%20clean&width=200&height=280&seq=tr005&orientation=portrait', 'Tuyển tập truyện cổ tích Việt Nam'),
      (6, 'Khoa Học Vui', 'NXB Kim Đồng', 'Khoa học', 6, 'https://readdy.ai/api/search-image?query=science%20fun%20book%20cover%20children%20experiments%20colorful%20illustration%20clean%20background%20simple&width=200&height=280&seq=tr006&orientation=portrait', 'Sách khoa học vui nhộn cho trẻ em')
      ON DUPLICATE KEY UPDATE title=VALUES(title), author=VALUES(author)
    `);

    // Insert sample pages for story 1
    await connection.query(`
      INSERT INTO pages (story_id, page_number, content, image_url) VALUES
      (1, 0, 'Tôi sống trong một hang đất bên bờ ruộng. Mùa hè năm ấy, tôi mới lớn và bắt đầu nhận ra thế giới xung quanh thật rộng lớn và kỳ diệu. Tiếng gió thổi qua những ngọn cỏ, tiếng nước chảy róc rách từ con mương nhỏ — tất cả đều khiến tôi tò mò muốn khám phá.', 'https://readdy.ai/api/search-image?query=cricket%20insect%20in%20green%20meadow%20summer%20morning%20dew%20drops%20grass%20illustration%20warm%20light%20watercolor%20style&width=560&height=320&seq=fb001&orientation=landscape'),
      (1, 1, 'Một buổi sáng, tôi gặp chị Cào Cào đang nhảy nhót trên bãi cỏ. Chị kể cho tôi nghe về những vùng đất xa xôi, nơi có những cánh đồng bất tận và những con suối trong vắt. Lòng tôi bỗng dưng rạo rực, muốn lên đường ngay lập tức.', 'https://readdy.ai/api/search-image?query=grasshopper%20cricket%20meeting%20in%20colorful%20meadow%20flowers%20butterflies%20warm%20illustration%20children%20book%20style&width=560&height=320&seq=fb002&orientation=landscape'),
      (1, 2, 'Tôi quyết định rời bỏ cái hang nhỏ bé quen thuộc. Mang theo chiếc ba lô tí hon, tôi bước ra ngoài với trái tim đầy hứng khởi. Con đường trước mặt dài và chưa biết sẽ dẫn đến đâu, nhưng tôi không sợ — tôi là Dế Mèn, và tôi sinh ra để phiêu lưu!', 'https://readdy.ai/api/search-image?query=small%20cricket%20with%20backpack%20starting%20journey%20on%20dirt%20path%20green%20fields%20blue%20sky%20adventure%20illustration%20warm&width=560&height=320&seq=fb003&orientation=landscape'),
      (1, 3, 'Trên đường đi, tôi gặp anh Dế Trũi — một người bạn mới hiền lành và tốt bụng. Chúng tôi kết bạn ngay từ lần đầu gặp gỡ và cùng nhau tiếp tục cuộc hành trình. Hai chúng tôi chia sẻ thức ăn, kể chuyện cho nhau nghe và cùng nhau vượt qua những khó khăn đầu tiên.', 'https://readdy.ai/api/search-image?query=two%20cricket%20friends%20walking%20together%20on%20path%20through%20forest%20warm%20friendship%20illustration%20children%20book%20colorful&width=560&height=320&seq=fb004&orientation=landscape'),
      (1, 4, 'Chúng tôi đến một vùng đất mới, nơi có những sinh vật kỳ lạ chưa từng gặp. Có những con bướm đủ màu sắc, những chú ếch to lớn và cả những con rắn đáng sợ. Mỗi ngày là một cuộc phiêu lưu mới, mỗi bước chân là một bài học quý giá về cuộc sống.', 'https://readdy.ai/api/search-image?query=magical%20forest%20with%20colorful%20butterflies%20frogs%20insects%20adventure%20scene%20warm%20illustration%20children%20book%20fantasy&width=560&height=320&seq=fb005&orientation=landscape'),
      (1, 5, 'Sau bao nhiêu gian nan, tôi hiểu ra rằng: cuộc sống không chỉ là những cuộc phiêu lưu hào hứng, mà còn là những bài học về tình bạn, lòng dũng cảm và sự trưởng thành. Tôi — Dế Mèn — đã lớn lên không chỉ về thể xác mà còn về tâm hồn.', 'https://readdy.ai/api/search-image?query=cricket%20sitting%20on%20flower%20petal%20sunset%20golden%20light%20peaceful%20reflection%20growth%20wisdom%20illustration%20warm&width=560&height=320&seq=fb006&orientation=landscape')
      ON DUPLICATE KEY UPDATE content=VALUES(content)
    `);

    // Insert sample pages for story 2
    await connection.query(`
      INSERT INTO pages (story_id, page_number, content, image_url) VALUES
      (2, 0, 'Đêm giao thừa lạnh giá, tuyết rơi trắng xóa khắp nơi. Giữa phố phường nhộn nhịp ánh đèn, một cô bé nhỏ bé đi chân trần, đầu trần, tay cầm những que diêm rao bán. Không ai mua, không ai để ý đến em.', 'https://readdy.ai/api/search-image?query=little%20girl%20selling%20matches%20in%20snowy%20street%20night%20Christmas%20lights%20warm%20glow%20cold%20winter%20illustration&width=560&height=320&seq=fb007&orientation=landscape'),
      (2, 1, 'Cô bé ngồi thu mình vào một góc tường, run rẩy vì lạnh. Em không dám về nhà vì chưa bán được que diêm nào. Bỗng em nghĩ đến việc đốt một que diêm để sưởi ấm — chỉ một que thôi...', 'https://readdy.ai/api/search-image?query=little%20girl%20huddled%20in%20corner%20snowy%20night%20striking%20match%20warm%20glow%20cold%20illustration%20fairy%20tale&width=560&height=320&seq=fb008&orientation=landscape'),
      (2, 2, 'Que diêm thứ nhất bùng cháy. Trong ánh lửa nhỏ bé ấy, cô bé thấy hiện ra một lò sưởi ấm áp với những ngọn lửa hồng rực rỡ. Nhưng que diêm tắt, và tất cả biến mất. Chỉ còn lại bóng tối và cái lạnh buốt xương.', 'https://readdy.ai/api/search-image?query=match%20flame%20vision%20warm%20fireplace%20cozy%20room%20contrast%20cold%20dark%20night%20fairy%20tale%20illustration%20golden&width=560&height=320&seq=fb009&orientation=landscape'),
      (2, 3, 'Que diêm thứ hai — em thấy một bàn tiệc thịnh soạn với những món ăn ngon lành. Que diêm thứ ba — một cây thông Noel lộng lẫy. Và que diêm thứ tư — bà nội hiền từ của em hiện ra, mỉm cười âu yếm.', 'https://readdy.ai/api/search-image?query=Christmas%20tree%20feast%20grandmother%20vision%20match%20flame%20magical%20warm%20illustration%20fairy%20tale%20children%20book&width=560&height=320&seq=fb010&orientation=landscape'),
      (2, 4, '"Bà ơi, đừng bỏ con đi!" — cô bé kêu lên và đốt hết cả bó diêm để giữ bà lại. Ánh sáng rực rỡ bao phủ hai bà cháu, và họ cùng bay lên cao, cao mãi, đến nơi không còn lạnh lẽo, không còn đói khát, không còn đau khổ.', 'https://readdy.ai/api/search-image?query=grandmother%20and%20little%20girl%20ascending%20to%20heaven%20warm%20golden%20light%20stars%20magical%20fairy%20tale%20illustration%20peaceful&width=560&height=320&seq=fb011&orientation=landscape')
      ON DUPLICATE KEY UPDATE content=VALUES(content)
    `);

    // Insert sample pages for story 3
    await connection.query(`
      INSERT INTO pages (story_id, page_number, content, image_url) VALUES
      (3, 0, 'Tôi là một phi công bị hỏng máy bay giữa sa mạc Sahara. Sáng hôm sau, tôi bị đánh thức bởi một giọng nói nhỏ bé: "Làm ơn vẽ cho tôi một con cừu!" Trước mặt tôi là một cậu bé kỳ lạ, tóc vàng, mắt sáng long lanh.', 'https://readdy.ai/api/search-image?query=little%20prince%20blond%20hair%20standing%20in%20desert%20stars%20night%20sky%20illustration%20watercolor%20blue%20purple%20magical&width=560&height=320&seq=fb012&orientation=landscape'),
      (3, 1, 'Cậu bé đến từ tiểu hành tinh B-612, một hành tinh nhỏ xíu chỉ có ba ngọn núi lửa và một bông hoa hồng kiêu kỳ. Cậu yêu bông hoa ấy hết lòng, nhưng sự kiêu ngạo của hoa khiến cậu buồn và quyết định rời đi.', 'https://readdy.ai/api/search-image?query=tiny%20planet%20asteroid%20with%20rose%20volcano%20little%20prince%20illustration%20watercolor%20stars%20space%20magical%20children&width=560&height=320&seq=fb013&orientation=landscape'),
      (3, 2, 'Trên hành trình, Hoàng Tử Bé ghé thăm nhiều hành tinh kỳ lạ: hành tinh của ông vua chỉ biết ra lệnh, hành tinh của kẻ kiêu ngạo, hành tinh của người say rượu, hành tinh của nhà kinh doanh đếm sao...', 'https://readdy.ai/api/search-image?query=little%20prince%20visiting%20different%20planets%20king%20businessman%20drunkard%20illustration%20watercolor%20colorful%20space%20journey&width=560&height=320&seq=fb014&orientation=landscape'),
      (3, 3, '"Điều quan trọng nhất là vô hình với mắt thường. Chỉ có trái tim mới nhìn thấy được." — Con cáo nói với Hoàng Tử Bé. Và cậu hiểu ra rằng bông hoa hồng của mình thật sự đặc biệt, không phải vì vẻ đẹp bên ngoài, mà vì tình yêu cậu đã dành cho nó.', 'https://readdy.ai/api/search-image?query=little%20prince%20and%20fox%20in%20wheat%20field%20golden%20sunset%20friendship%20illustration%20watercolor%20warm%20magical%20children&width=560&height=320&seq=fb015&orientation=landscape'),
      (3, 4, 'Khi chia tay, Hoàng Tử Bé nói: "Khi nhìn lên bầu trời đêm, anh sẽ thấy tôi cười trên một trong những ngôi sao đó." Và từ đó, mỗi khi nhìn lên bầu trời đầy sao, tôi lại mỉm cười và nhớ đến cậu bé kỳ diệu ấy.', 'https://readdy.ai/api/search-image?query=little%20prince%20standing%20on%20planet%20looking%20at%20stars%20night%20sky%20farewell%20illustration%20watercolor%20blue%20purple%20emotional&width=560&height=320&seq=fb016&orientation=landscape')
      ON DUPLICATE KEY UPDATE content=VALUES(content)
    `);

    // Insert sample pages for story 4
    await connection.query(`
      INSERT INTO pages (story_id, page_number, content, image_url) VALUES
      (4, 0, 'Tom Sawyer là một cậu bé tinh nghịch sống ở thị trấn nhỏ bên bờ sông Mississippi. Cậu ghét đi học, ghét làm việc nhà, nhưng lại rất thích phiêu lưu và khám phá. Mỗi ngày với Tom đều là một cuộc phiêu lưu mới.', 'https://readdy.ai/api/search-image?query=Tom%20Sawyer%20boy%20river%20Mississippi%20adventure%20illustration%20warm%20colors%20children%20book%20classic%20American&width=560&height=320&seq=fb017&orientation=landscape'),
      (4, 1, 'Một ngày, Tom và người bạn thân Huckleberry Finn khám phá ra một hang động bí ẩn. Bên trong hang tối tăm và lạnh lẽo, nhưng hai cậu bé dũng cảm vẫn tiến vào, tay cầm ngọn nến leo lét.', 'https://readdy.ai/api/search-image?query=two%20boys%20exploring%20dark%20cave%20with%20candle%20adventure%20mystery%20illustration%20warm%20children%20book%20classic&width=560&height=320&seq=fb018&orientation=landscape'),
      (4, 2, 'Trong hang, họ tình cờ chứng kiến một tên tội phạm nguy hiểm. Tim đập thình thịch, hai cậu bé nín thở và trốn vào bóng tối. Đây là cuộc phiêu lưu thật sự — không phải trò chơi nữa rồi!', 'https://readdy.ai/api/search-image?query=boys%20hiding%20in%20cave%20shadows%20danger%20adventure%20tense%20moment%20illustration%20warm%20children%20book%20classic&width=560&height=320&seq=fb019&orientation=landscape'),
      (4, 3, 'Cuối cùng, Tom và Huck thoát ra an toàn và còn tìm được kho báu bí ẩn. Cả thị trấn vui mừng chào đón hai cậu bé anh hùng. Tom hiểu ra rằng: dũng cảm thật sự không phải là không sợ hãi, mà là làm điều đúng dù có sợ.', 'https://readdy.ai/api/search-image?query=boys%20finding%20treasure%20chest%20cave%20celebration%20happy%20ending%20illustration%20warm%20children%20book%20classic%20adventure&width=560&height=320&seq=fb020&orientation=landscape')
      ON DUPLICATE KEY UPDATE content=VALUES(content)
    `);

    // Insert sample users
    console.log('Đang thêm dữ liệu mẫu users...');
    await connection.query(`
      INSERT INTO users (username, password, full_name, email, role) VALUES
      ('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin@thuvienso.com', 'admin'),
      ('teacher1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Văn A', 'teacher1@thuvienso.com', 'teacher'),
      ('student1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Trần Văn B', 'student1@thuvienso.com', 'student')
      ON DUPLICATE KEY UPDATE full_name=VALUES(full_name)
    `);

    // Insert sample subjects
    console.log('Đang thêm dữ liệu mẫu môn học...');
    await connection.query(`
      INSERT INTO subjects (title, description, grade_level, teacher_id, thumbnail) VALUES
      ('Toán học', 'Môn Toán học cơ bản cho học sinh tiểu học', 'Lớp 1-3', 2, 'https://readdy.ai/api/search-image?query=mathematics%20education%20book%20cover%20numbers%20calculations%20colorful%20illustration%20clean&width=200&height=280&seq=sub001&orientation=portrait'),
      ('Tiếng Việt', 'Môn Tiếng Việt phát triển kỹ năng đọc viết', 'Lớp 1-3', 2, 'https://readdy.ai/api/search-image?query=vietnamese%20language%20education%20book%20cover%20alphabet%20writing%20colorful%20illustration%20clean&width=200&height=280&seq=sub002&orientation=portrait'),
      ('Khoa học', 'Môn Khoa học tự nhiên khám phá thế giới xung quanh', 'Lớp 4-5', 2, 'https://readdy.ai/api/search-image?query=science%20education%20book%20cover%20nature%20plants%20animals%20colorful%20illustration%20clean&width=200&height=280&seq=sub003&orientation=portrait')
      ON DUPLICATE KEY UPDATE title=VALUES(title)
    `);

    // Insert sample lessons
    console.log('Đang thêm dữ liệu mẫu bài giảng...');
    await connection.query(`
      INSERT INTO lessons (subject_id, title, description, video_url, video_duration, content, order_index) VALUES
      (1, 'Bài 1: Số đếm từ 1 đến 10', 'Học cách đếm số từ 1 đến 10', 'https://example.com/video1.mp4', 600, 'Trong bài học này, các em sẽ học cách đếm số từ 1 đến 10 thông qua các hình ảnh sinh động.', 1),
      (1, 'Bài 2: Phép cộng cơ bản', 'Học phép cộng với số nhỏ', 'https://example.com/video2.mp4', 720, 'Các em sẽ học cách thực hiện phép cộng với các số từ 1 đến 10.', 2),
      (2, 'Bài 1: Bảng chữ cái', 'Học nhận biết bảng chữ cái', 'https://example.com/video3.mp4', 900, 'Bài học giúp các em làm quen với 29 chữ cái trong bảng chữ cái tiếng Việt.', 1),
      (3, 'Bài 1: Cây và phần của cây', 'Tìm hiểu về cấu tạo cây', 'https://example.com/video4.mp4', 540, 'Các em sẽ học về bộ phận của cây: rễ, thân, lá, hoa, quả.', 1)
      ON DUPLICATE KEY UPDATE title=VALUES(title)
    `);

    // Insert sample activities
    console.log('Đang thêm dữ liệu mẫu hoạt động...');
    await connection.query(`
      INSERT INTO activities (title, description, activity_date, location, thumbnail) VALUES
      ('Hội trại Xuân 2024', 'Hội trại xuân với nhiều hoạt động vui nhộn và bổ ích cho học sinh', '2024-02-15', 'Trường Tiểu học ABC', 'https://readdy.ai/api/search-image?query=school%20camp%20activity%20children%20playing%20outdoor%20colorful%20illustration%20clean&width=200&height=280&seq=act001&orientation=portrait'),
      ('Ngày hội Đọc sách', 'Ngày hội khuyến đọc với nhiều cuốn sách hay và hoạt động thú vị', '2024-03-20', 'Thư viện trường', 'https://readdy.ai/api/search-image?query=book%20festival%20children%20reading%20library%20colorful%20illustration%20clean&width=200&height=280&seq=act002&orientation=portrait'),
      ('Thể thao học đường', 'Giải thể thao học đường với các môn: chạy bộ, nhảy xa, bóng đá', '2024-04-10', 'Sân vận động trường', 'https://readdy.ai/api/search-image?query=school%20sports%20day%20children%20running%20playing%20colorful%20illustration%20clean&width=200&height=280&seq=act003&orientation=portrait')
      ON DUPLICATE KEY UPDATE title=VALUES(title)
    `);

    // Insert sample activity images
    console.log('Đang thêm dữ liệu mẫu hình ảnh hoạt động...');
    await connection.query(`
      INSERT INTO activity_images (activity_id, image_url, caption, order_index) VALUES
      (1, 'https://readdy.ai/api/search-image?query=children%20camp%20tent%20campfire%20night%20warm%20illustration%20clean&width=560&height=320&seq=actimg001&orientation=landscape', 'Lửa trại đêm hội trại', 1),
      (1, 'https://readdy.ai/api/search-image?query=children%20playing%20games%20outdoor%20happy%20colorful%20illustration%20clean&width=560&height=320&seq=actimg002&orientation=landscape', 'Chơi trò chơi tập thể', 2),
      (2, 'https://readdy.ai/api/search-image?query=children%20reading%20books%20library%20cozy%20warm%20illustration%20clean&width=560&height=320&seq=actimg003&orientation=landscape', 'Học sinh đọc sách', 1),
      (3, 'https://readdy.ai/api/search-image?query=children%20running%20race%20sports%20day%20energetic%20colorful%20illustration%20clean&width=560&height=320&seq=actimg004&orientation=landscape', 'Đua chạy học đường', 1)
      ON DUPLICATE KEY UPDATE image_url=VALUES(image_url)
    `);

    // Insert sample reference books
    console.log('Đang thêm dữ liệu mẫu sách tham khảo...');
    await connection.query(`
      INSERT INTO reference_books (title, author, description, category, grade, number_of_pages, file_url, file_type, file_size, cover_image) VALUES
      ('Toán Nâng Cao Lớp 5', 'NXB Giáo Dục', 'Sách toán nâng cao cho học sinh lớp 5', 'Toán học', 'Lớp 5', 180, 'https://example.com/toan5.pdf', 'PDF', 5242880, 'https://readdy.ai/api/search-image?query=mathematics%20textbook%20cover%20grade%205%20blue%20clean%20modern%20design%20numbers%20geometric%20shapes%20simple&width=200&height=280&seq=stk001&orientation=portrait'),
      ('Tiếng Anh Giao Tiếp Cơ Bản', 'NXB Trẻ', 'Sách tiếng Anh giao tiếp cơ bản', 'Tiếng Anh', 'Lớp 6', 220, 'https://example.com/tienganh6.pdf', 'PDF', 6291456, 'https://readdy.ai/api/search-image?query=English%20communication%20book%20cover%20teal%20green%20modern%20design%20speech%20bubbles%20clean%20minimal&width=200&height=280&seq=stk002&orientation=portrait'),
      ('Ngữ Văn Nâng Cao Lớp 6', 'NXB Giáo Dục', 'Sách ngữ văn nâng cao lớp 6', 'Ngữ văn', 'Lớp 6', 160, 'https://example.com/nguvan6.pdf', 'PDF', 7340032, 'https://readdy.ai/api/search-image?query=Vietnamese%20literature%20textbook%20cover%20green%20elegant%20design%20writing%20pen%20clean%20minimal&width=200&height=280&seq=stk003&orientation=portrait'),
      ('Khoa Học Tự Nhiên Lớp 7', 'NXB Giáo Dục', 'Sách khoa học tự nhiên lớp 7', 'Khoa học', 'Lớp 7', 200, 'https://example.com/khoahoc7.pdf', 'PDF', 4194304, 'https://readdy.ai/api/search-image?query=natural%20science%20textbook%20cover%20indigo%20blue%20modern%20design%20atoms%20molecules%20clean%20minimal&width=200&height=280&seq=stk004&orientation=portrait'),
      ('Lịch Sử Việt Nam Cận Đại', 'NXB Giáo Dục', 'Sách lịch sử Việt Nam cận đại', 'Lịch sử', 'Lớp 8', 240, 'https://example.com/lichsu8.pdf', 'PDF', 5242880, 'https://readdy.ai/api/search-image?query=Vietnamese%20history%20textbook%20cover%20amber%20golden%20design%20traditional%20clean%20minimal%20education&width=200&height=280&seq=stk005&orientation=portrait'),
      ('Toán Tư Duy Lớp 4', 'NXB Kim Đồng', 'Sách toán tư duy lớp 4', 'Toán học', 'Lớp 4', 140, 'https://example.com/toantu4.pdf', 'PDF', 6291456, 'https://readdy.ai/api/search-image?query=math%20thinking%20book%20cover%20grade%204%20colorful%20blue%20puzzle%20shapes%20clean%20children%20education&width=200&height=280&seq=stk006&orientation=portrait'),
      ('Vật Lý Cơ Bản Lớp 8', 'NXB Giáo Dục', 'Sách vật lý cơ bản lớp 8', 'Khoa học', 'Lớp 8', 190, 'https://example.com/vatly8.pdf', 'PDF', 7340032, 'https://readdy.ai/api/search-image?query=physics%20textbook%20cover%20grade%208%20purple%20modern%20design%20waves%20energy%20clean%20minimal%20education&width=200&height=280&seq=stk007&orientation=portrait'),
      ('Tiếng Anh Lớp 7 Nâng Cao', 'NXB Trẻ', 'Sách tiếng Anh nâng cao lớp 7', 'Tiếng Anh', 'Lớp 7', 250, 'https://example.com/tienganh7.pdf', 'PDF', 4194304, 'https://readdy.ai/api/search-image?query=English%20advanced%20textbook%20cover%20grade%207%20teal%20modern%20design%20globe%20clean%20minimal%20education&width=200&height=280&seq=stk008&orientation=portrait'),
      ('Địa Lý Việt Nam Lớp 9', 'NXB Giáo Dục', 'Sách địa lý Việt Nam lớp 9', 'Địa lý', 'Lớp 9', 210, 'https://example.com/dialy9.pdf', 'PDF', 5242880, 'https://readdy.ai/api/search-image?query=geography%20Vietnam%20textbook%20cover%20grade%209%20cyan%20map%20modern%20design%20clean%20minimal%20education&width=200&height=280&seq=stk009&orientation=portrait'),
      ('Ngữ Văn Lớp 8 Tổng Hợp', 'NXB Giáo Dục', 'Sách ngữ văn tổng hợp lớp 8', 'Ngữ văn', 'Lớp 8', 175, 'https://example.com/nguvan8.pdf', 'PDF', 6291456, 'https://readdy.ai/api/search-image?query=Vietnamese%20literature%20textbook%20cover%20grade%208%20green%20elegant%20pen%20writing%20clean%20minimal%20education&width=200&height=280&seq=stk010&orientation=portrait'),
      ('Toán Lớp 9 Chuyên Đề', 'NXB Giáo Dục', 'Sách toán chuyên đề lớp 9', 'Toán học', 'Lớp 9', 280, 'https://example.com/toan9.pdf', 'PDF', 7340032, 'https://readdy.ai/api/search-image?query=mathematics%20advanced%20textbook%20cover%20grade%209%20blue%20geometric%20shapes%20clean%20modern%20minimal%20education&width=200&height=280&seq=stk011&orientation=portrait'),
      ('Lịch Sử Thế Giới Lớp 7', 'NXB Giáo Dục', 'Sách lịch sử thế giới lớp 7', 'Lịch sử', 'Lớp 7', 195, 'https://example.com/lichsuworld7.pdf', 'PDF', 4194304, 'https://readdy.ai/api/search-image?query=world%20history%20textbook%20cover%20grade%207%20amber%20golden%20ancient%20design%20clean%20minimal%20education&width=200&height=280&seq=stk012&orientation=portrait')
      ON DUPLICATE KEY UPDATE title=VALUES(title)
    `);

    // Insert sample banners
    console.log('Đang thêm dữ liệu mẫu banners...');
    await connection.query(`
      INSERT IGNORE INTO banners (title, description, image_url, link_url, order_index, is_active) VALUES
      ('Thư Viện Số', 'Tri Thức Không Giới Hạn', 'https://readdy.ai/api/search-image?query=beautiful%20modern%20digital%20library%20education%20platform%20with%20glowing%20blue%20and%20green%20gradient%20background%2C%20floating%20books%2C%20soft%20light%20rays%2C%20knowledge%20concept%2C%20clean%20minimalist%20aesthetic%2C%20Vietnamese%20school%20children%20reading%2C%20warm%20inviting%20atmosphere%2C%20bokeh%20background%2C%20high%20quality%20photography&width=1440&height=900&seq=hero001&orientation=landscape', '/mon-hoc', 1, TRUE),
      ('Khám Phá Môn Học', 'Hệ thống bài giảng đa dạng', 'https://readdy.ai/api/search-image?query=education%20classroom%20students%20learning%20colorful%20books%20laptops%20modern%20bright%20clean%20background%20blue%20green%20gradient&width=1440&height=900&seq=hero002&orientation=landscape', '/mon-hoc', 2, TRUE)
    `);

    // Insert sample stats
    console.log('Đang thêm dữ liệu mẫu stats...');
    await connection.query(`
      INSERT IGNORE INTO stats (label, value, icon, order_index, is_active) VALUES
      ('Bài giảng video', '1,200+', 'ri-book-2-line', 1, TRUE),
      ('Học sinh đang học', '50,000+', 'ri-user-star-line', 2, TRUE),
      ('Đầu sách & truyện', '500+', 'ri-file-text-line', 3, TRUE),
      ('Giáo viên tham gia', '120+', 'ri-award-line', 4, TRUE)
    `);

    // Insert sample announcements
    console.log('Đang thêm dữ liệu mẫu thông báo...');
    try {
      await connection.query(`
        INSERT INTO announcements (title, slug, content, category_id, priority, publish_date, image_url, created_by) VALUES
        ('Thông báo nghỉ lễ', 'thong-bao-nghi-le', 'Nhà trường thông báo lịch nghỉ lễ 30/4 - 1/5. Các em học sinh nghỉ từ 29/4 đến 2/5. Học sinh quay trở lại trường vào ngày 3/5.', 1, 1, '2024-04-20 08:00:00', 'https://readdy.ai/api/search-image?query=Vietnamese%20holiday%20celebration%20flag%20flowers%20festive%20warm%20colors%20clean%20background&width=600&height=380&seq=an001&orientation=landscape', 1),
        ('Khẩn: Thay đổi lịch học', 'khan-thay-doi-lich-hoc', 'Do điều kiện thời tiết, nhà trường thông báo thay đổi lịch học ngày mai. Các lớp học trực tuyến thay vì học tại trường.', 2, 3, '2024-04-15 17:00:00', 'https://readdy.ai/api/search-image?query=weather%20alert%20storm%20rain%20cloudy%20dark%20sky%20warning%20sign&width=600&height=380&seq=an002&orientation=landscape', 1),
        ('Ngày hội Mẹ', 'ngay-hoi-me', 'Nhà trường tổ chức ngày hội Mẹ vào ngày 12/5. Mời phụ huynh và học sinh tham gia các hoạt động ý nghĩa.', 3, 2, '2024-05-01 09:00:00', 'https://readdy.ai/api/search-image?query=mothers%20day%20celebration%20flowers%20family%20love%20warm%20colors%20happy%20children&width=600&height=380&seq=an003&orientation=landscape', 1)
        ON DUPLICATE KEY UPDATE title=VALUES(title)
      `);
    } catch (error) {
      // Nếu các cột mới chưa tồn tại, thử INSERT cơ bản
      console.log('Thử INSERT với cấu trúc cơ bản...');
      await connection.query(`
        INSERT IGNORE INTO announcements (title, slug, content, category_id, priority, publish_date, created_by) VALUES
        ('Thông báo nghỉ lễ', 'thong-bao-nghi-le', 'Nhà trường thông báo lịch nghỉ lễ 30/4 - 1/5. Các em học sinh nghỉ từ 29/4 đến 2/5. Học sinh quay trở lại trường vào ngày 3/5.', 1, 1, '2024-04-20 08:00:00', 1),
        ('Khẩn: Thay đổi lịch học', 'khan-thay-doi-lich-hoc', 'Do điều kiện thời tiết, nhà trường thông báo thay đổi lịch học ngày mai. Các lớp học trực tuyến thay vì học tại trường.', 2, 3, '2024-04-15 17:00:00', 1),
        ('Ngày hội Mẹ', 'ngay-hoi-me', 'Nhà trường tổ chức ngày hội Mẹ vào ngày 12/5. Mời phụ huynh và học sinh tham gia các hoạt động ý nghĩa.', 3, 2, '2024-05-01 09:00:00', 1)
      `);
    }

    await connection.end();
    console.log('✅ Database đã được khởi tạo thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo database:', error);
    process.exit(1);
  }
}

initDatabase();
