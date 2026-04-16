/**
 * Migration: Seed stats data
 * Created: 2024-04-16
 */

async function up(pool) {
  console.log('Running migration 004: Seed stats...');
  
  const [existing] = await pool.query('SELECT COUNT(*) as count FROM stats');
  if (existing[0].count > 0) {
    console.log('⚠️ Stats table already has data, skipping...');
    return;
  }
  
  await pool.query(`
    INSERT INTO stats (label, value, icon, order_index, is_active) VALUES
    ('Bài giảng video', '1,200+', 'ri-book-2-line', 1, TRUE),
    ('Học sinh đang học', '50,000+', 'ri-user-star-line', 2, TRUE),
    ('Đầu sách & truyện', '500+', 'ri-file-text-line', 3, TRUE),
    ('Giáo viên tham gia', '120+', 'ri-award-line', 4, TRUE)
  `);
  
  console.log('✅ Stats seeded');
}

async function down(pool) {
  console.log('Reverting migration 004: Remove stats data...');
  await pool.query(`DELETE FROM stats WHERE id IN (1, 2, 3, 4)`);
  console.log('✅ Stats data removed');
}

module.exports = { up, down };
