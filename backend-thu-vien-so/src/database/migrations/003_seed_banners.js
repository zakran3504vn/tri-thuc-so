/**
 * Migration: Seed banners data
 * Created: 2024-04-16
 */

async function up(pool) {
  console.log('Running migration 003: Seed banners...');
  
  const [existing] = await pool.query('SELECT COUNT(*) as count FROM banners');
  if (existing[0].count > 0) {
    console.log('⚠️ Banners table already has data, skipping...');
    return;
  }
  
  await pool.query(`
    INSERT INTO banners (title, description, image_url, link_url, order_index, is_active) VALUES
    ('Thư Viện Số', 'Tri Thức Không Giới Hạn', 'https://readdy.ai/api/search-image?query=beautiful%20modern%20digital%20library%20education%20platform%20with%20glowing%20blue%20and%20green%20gradient%20background%2C%20floating%20books%2C%20soft%20light%20rays%2C%20knowledge%20concept%2C%20clean%20minimalist%20aesthetic%2C%20Vietnamese%20school%20children%20reading%2C%20warm%20inviting%20atmosphere%2C%20bokeh%20background%2C%20high%20quality%20photography&width=1440&height=900&seq=hero001&orientation=landscape', '/mon-hoc', 1, TRUE),
    ('Khám Phá Môn Học', 'Hệ thống bài giảng đa dạng', 'https://readdy.ai/api/search-image?query=education%20classroom%20students%20learning%20colorful%20books%20laptops%20modern%20bright%20clean%20background%20blue%20green%20gradient&width=1440&height=900&seq=hero002&orientation=landscape', '/mon-hoc', 2, TRUE)
  `);
  
  console.log('✅ Banners seeded');
}

async function down(pool) {
  console.log('Reverting migration 003: Remove banners data...');
  await pool.query(`DELETE FROM banners WHERE id IN (1, 2)`);
  console.log('✅ Banners data removed');
}

module.exports = { up, down };
