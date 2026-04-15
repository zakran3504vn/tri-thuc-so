'use client';
import { useState, useEffect } from 'react';
import {
  ReferenceBook,
  getReferenceBooks,
  createReferenceBook,
  updateReferenceBook,
  deleteReferenceBook,
  uploadImage,
  uploadFile
} from '@/lib/api';

export default function AdminReferenceBooks() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [grade, setGrade] = useState('');
  const [numberOfPages, setNumberOfPages] = useState<number | null>(null);
  const [fileUrl, setFileUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState('');
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [books, setBooks] = useState<ReferenceBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);

  const categories = ['Toán học', 'Ngữ văn', 'Tiếng Anh', 'Khoa học', 'Lịch sử', 'Địa lý'];
  const grades = ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksData, subjectsData] = await Promise.all([
        getReferenceBooks(),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/subjects`).then(res => res.json())
      ]);
      setBooks(booksData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setTitle('');
    setAuthor('');
    setDescription('');
    setCategory('');
    setSubjectId(null);
    setGrade('');
    setNumberOfPages(null);
    setFileUrl('');
    setSelectedFile(null);
    setCoverImage('');
    setSelectedCoverFile(null);
    setPreviewUrl('');
    setSubmitMessage('');
    setShowForm(true);
  };

  const handleEdit = (item: ReferenceBook) => {
    setEditingId(item.id);
    setTitle(item.title);
    setAuthor(item.author || '');
    setDescription(item.description || '');
    setCategory(item.category || '');
    setSubjectId(item.subject_id || null);
    setGrade(item.grade || '');
    setNumberOfPages(item.number_of_pages || null);
    setFileUrl(item.file_url);
    setSelectedFile(null);
    setCoverImage(item.cover_image || '');
    setPreviewUrl(item.cover_image ? (item.cover_image.startsWith('http') ? item.cover_image : `http://localhost:3001${item.cover_image}`) : '');
    setSelectedCoverFile(null);
    setSubmitMessage('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (!fileUrl && !selectedFile)) {
      setSubmitMessage('Vui lòng nhập tiêu đề và tải lên file tài liệu');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage('');

      // Upload file if selected
      let finalFileUrl = fileUrl;
      if (selectedFile) {
        const uploadResult = await uploadFile(selectedFile);
        finalFileUrl = uploadResult.fileUrl;
      }

      // Upload cover image if selected
      let finalCoverImage = coverImage;
      if (selectedCoverFile) {
        const uploadResult = await uploadImage(selectedCoverFile);
        finalCoverImage = uploadResult.imageUrl;
      }

      const token = localStorage.getItem('token');
      const bookData = {
        title,
        author: author || undefined,
        description: description || undefined,
        category: category || undefined,
        subject_id: subjectId || undefined,
        grade: grade || undefined,
        number_of_pages: numberOfPages || undefined,
        file_url: finalFileUrl,
        file_type: selectedFile?.type || undefined,
        file_size: selectedFile?.size || undefined,
        cover_image: finalCoverImage || undefined,
      };

      if (editingId) {
        await updateReferenceBook(editingId, bookData, token || undefined);
        setSubmitMessage('Cập nhật tài liệu thành công!');
      } else {
        await createReferenceBook(bookData, token || undefined);
        setSubmitMessage('Thêm tài liệu thành công!');
      }

      // Reset form and close
      setTitle('');
      setAuthor('');
      setDescription('');
      setCategory('');
      setSubjectId(null);
      setGrade('');
      setNumberOfPages(null);
      setFileUrl('');
      setSelectedFile(null);
      setCoverImage('');
      setSelectedCoverFile(null);
      setPreviewUrl('');
      setEditingId(null);
      setTimeout(() => setShowForm(false), 1500);

      // Reload data
      await fetchData();
    } catch (error: any) {
      setSubmitMessage(error.message || 'Lỗi khi lưu tài liệu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await deleteReferenceBook(id, token || undefined);
      await fetchData();
    } catch (error) {
      console.error('Failed to delete reference book:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCoverFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCoverFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveCover = () => {
    setSelectedCoverFile(null);
    setPreviewUrl('');
    setCoverImage('');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileUrl('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {showForm ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">{editingId ? 'Cập nhật tài liệu' : 'Thêm tài liệu mới'}</h3>
            <button
              onClick={() => setShowForm(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <i className="ri-close-line text-gray-600"></i>
            </button>
          </div>
          {submitMessage && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${submitMessage.includes('thành công') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {submitMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề tài liệu *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tiêu đề..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tác giả</label>
              <input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên tác giả..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Môn học</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn môn học</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Lớp</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn lớp</option>
                {grades.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Số trang</label>
              <input
                type="number"
                value={numberOfPages || ''}
                onChange={e => setNumberOfPages(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập số trang..."
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Nhập mô tả..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">File tài liệu *</label>
              {fileUrl && !selectedFile && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl mb-3">
                  <i className="ri-file-pdf-line text-blue-600 text-2xl"></i>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">File hiện tại</p>
                    <p className="text-xs text-gray-500 truncate">{fileUrl}</p>
                  </div>
                  <a
                    href={fileUrl.startsWith('http') ? fileUrl : `http://localhost:3001${fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 cursor-pointer"
                    title="Xem file"
                  >
                    <i className="ri-eye-line"></i>
                  </a>
                </div>
              )}
              {selectedFile ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <i className="ri-file-pdf-line text-red-500 text-2xl"></i>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 cursor-pointer"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-file-upload-line text-blue-600 text-xl"></i>
                    </div>
                    <p className="text-sm text-gray-600">{fileUrl ? 'Thay đổi file' : 'Nhấp để chọn file'}</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (tối đa 50MB)</p>
                  </label>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh bìa</label>
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleCoverFileSelect}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-image-add-line text-blue-600 text-xl"></i>
                    </div>
                    <p className="text-sm text-gray-600">Nhấp để chọn ảnh bìa</p>
                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG, GIF, WebP (tối đa 5MB)</p>
                  </label>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm tài liệu')}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Danh sách tài liệu tham khảo</h3>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></span>
              Thêm tài liệu
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-500 text-sm">Đang tải...</p>
            </div>
          ) : books.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có tài liệu nào</p>
          ) : (
            <div className="space-y-3">
              {books.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  {item.cover_image && (
                    <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.cover_image.startsWith('http') ? item.cover_image : `http://localhost:3001${item.cover_image}`} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {item.category && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {item.category}
                        </span>
                      )}
                      {item.grade && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                          {item.grade}
                        </span>
                      )}
                      {item.number_of_pages && (
                        <span className="text-xs text-gray-400">{item.number_of_pages} trang</span>
                      )}
                    </div>
                    <div className="font-medium text-gray-800 text-sm truncate">{item.title}</div>
                    {item.author && (
                      <div className="text-xs text-gray-400 mt-0.5">{item.author}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-0.5">{formatDate(item.created_at)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={item.file_url.startsWith('http') ? item.file_url : `http://localhost:3001${item.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer"
                      title="Tải xuống"
                    >
                      <i className="ri-download-line text-xs"></i>
                    </a>
                    <button
                      onClick={() => handleEdit(item)}
                      className="w-7 h-7 flex items-center justify-center bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 cursor-pointer"
                      title="Sửa"
                    >
                      <i className="ri-edit-line text-xs"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 cursor-pointer"
                      title="Xóa"
                    >
                      <i className="ri-delete-bin-line text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
