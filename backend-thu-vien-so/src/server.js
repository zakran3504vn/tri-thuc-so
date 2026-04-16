const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const storiesRoutes = require('./routes/stories');
const pagesRoutes = require('./routes/pages');
const bookmarksRoutes = require('./routes/bookmarks');
const notesRoutes = require('./routes/notes');
const usersRoutes = require('./routes/users');
const subjectsRoutes = require('./routes/subjects');
const lessonsRoutes = require('./routes/lessons');
const activitiesRoutes = require('./routes/activities');
const activityImagesRoutes = require('./routes/activityImages');
const referenceBooksRoutes = require('./routes/referenceBooks');
const announcementsRoutes = require('./routes/announcements');
const exercisesRoutes = require('./routes/exercises');
const testsRoutes = require('./routes/tests');
const softBooksRoutes = require('./routes/softBooks');
const authRoutes = require('./routes/auth');
const contactInfoRoutes = require('./routes/contactInfo');
const contactSubmissionsRoutes = require('./routes/contactSubmissions');
const bannersRoutes = require('./routes/banners');
const statsRoutes = require('./routes/stats');
const newsRoutes = require('./routes/news');

const app = express();
const PORT = process.env.PORT || 5931;

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Tạo thư mục uploads/files cho tài liệu
const filesDir = path.join(__dirname, '../uploads/files');
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

// Tạo thư mục uploads/video-subjects cho video
const videosDir = path.join(__dirname, '../uploads/video-subjects');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

// Tạo thư mục uploads/exercises cho bài tập
const exercisesDir = path.join(__dirname, '../uploads/exercises');
if (!fs.existsSync(exercisesDir)) {
  fs.mkdirSync(exercisesDir, { recursive: true });
}

// Tạo thư mục uploads/tests cho đề kiểm tra
const testsDir = path.join(__dirname, '../uploads/tests');
if (!fs.existsSync(testsDir)) {
  fs.mkdirSync(testsDir, { recursive: true });
}

// Tạo thư mục uploads/soft-books cho sách mềm
const softBooksDir = path.join(__dirname, '../uploads/soft-books');
if (!fs.existsSync(softBooksDir)) {
  fs.mkdirSync(softBooksDir, { recursive: true });
}

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB for images
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Cấu hình multer cho file tài liệu (PDF, DOC, DOCX)
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, filesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadFile = multer({
  storage: fileStorage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB for documents
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận file tài liệu (pdf, doc, docx)'));
  }
});

// Cấu hình multer cho video
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, videosDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB for videos
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /mp4|avi|mov|wmv|flv|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận file video (mp4, avi, mov, wmv, flv, mkv, webm)'));
  }
});

// Cấu hình multer cho bài tập
const exerciseStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, exercisesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadExercise = multer({
  storage: exerciseStorage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB for exercise files
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx|txt|xlsx|xls|ppt|pptx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận file tài liệu (pdf, doc, docx, txt, xlsx, xls, ppt, pptx)'));
  }
});

// Cấu hình multer cho đề kiểm tra
const testStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, testsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadTest = multer({
  storage: testStorage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB for test files
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx|txt|xlsx|xls|ppt|pptx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận file tài liệu (pdf, doc, docx, txt, xlsx, xls, ppt, pptx)'));
  }
});

// Cấu hình multer cho sách mềm
const softBookStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, softBooksDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadSoftBook = multer({
  storage: softBookStorage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB for soft book files
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx|txt|xlsx|xls|ppt|pptx|epub/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận file tài liệu (pdf, doc, docx, txt, xlsx, xls, ppt, pptx, epub)'));
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ file tĩnh từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/stories', storiesRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/activity-images', activityImagesRoutes);
app.use('/api/reference-books', referenceBooksRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/tests', testsRoutes);
app.use('/api/soft-books', softBooksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact-info', contactInfoRoutes);
app.use('/api/contact-submissions', contactSubmissionsRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/news', newsRoutes);

// Upload image route
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nào được upload' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error);
    res.status(500).json({ error: 'Lỗi khi upload ảnh' });
  }
});

// Upload file route (PDF, DOC, DOCX)
app.post('/api/upload-file', uploadFile.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nào được upload' });
    }

    const fileUrl = `/uploads/files/${req.file.filename}`;
    res.json({
      success: true,
      fileUrl: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Lỗi khi upload file:', error);
    res.status(500).json({ error: 'Lỗi khi upload file' });
  }
});

// Upload video route
app.post('/api/upload-video', uploadVideo.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có video nào được upload' });
    }

    const videoUrl = `/uploads/video-subjects/${req.file.filename}`;
    res.json({
      success: true,
      videoUrl: videoUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Lỗi khi upload video:', error);
    res.status(500).json({ error: 'Lỗi khi upload video' });
  }
});

// Upload exercise file route
app.post('/api/upload-exercise', uploadExercise.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nào được upload' });
    }

    const fileUrl = `/uploads/exercises/${req.file.filename}`;
    res.json({
      success: true,
      fileUrl: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Lỗi khi upload file bài tập:', error);
    res.status(500).json({ error: 'Lỗi khi upload file bài tập' });
  }
});

// Upload test file route
app.post('/api/upload-test', uploadTest.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nào được upload' });
    }

    const fileUrl = `/uploads/tests/${req.file.filename}`;
    res.json({
      success: true,
      fileUrl: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Lỗi khi upload file đề kiểm tra:', error);
    res.status(500).json({ error: 'Lỗi khi upload file đề kiểm tra' });
  }
});

// Upload soft book file route
app.post('/api/upload-soft-book', uploadSoftBook.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nào được upload' });
    }

    const fileUrl = `/uploads/soft-books/${req.file.filename}`;
    res.json({
      success: true,
      fileUrl: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Lỗi khi upload file sách mềm:', error);
    res.status(500).json({ error: 'Lỗi khi upload file sách mềm' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend API đang chạy' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Lỗi server nội bộ' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Không tìm thấy route' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api`);
});
