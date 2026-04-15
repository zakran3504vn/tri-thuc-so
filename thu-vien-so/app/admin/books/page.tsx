'use client';
import { useState, useEffect } from 'react';
import { getReferenceBooks, createReferenceBook, updateReferenceBook, deleteReferenceBook, ReferenceBook } from '@/lib/api';

export default function AdminBooks() {
  const [books, setBooks] = useState<ReferenceBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    subject_id: '',
    grade: '',
    number_of_pages: '',
    file_url: '',
    file_type: '',
    file_size: '',
    cover_image: '',
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getReferenceBooks();
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch reference books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      title: '',
      author: '',
      description: '',
      category: '',
      subject_id: '',
      grade: '',
      number_of_pages: '',
      file_url: '',
      file_type: '',
      file_size: '',
      cover_image: '',
    });
    setShowForm(true);
  };

  const handleEdit = (book: ReferenceBook) => {
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author || '',
      description: book.description || '',
      category: book.category || '',
      subject_id: book.subject_id?.toString() || '',
      grade: book.grade || '',
      number_of_pages: book.number_of_pages?.toString() || '',
      file_url: book.file_url,
      file_type: book.file_type || '',
      file_size: book.file_size?.toString() || '',
      cover_image: book.cover_image || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sách này?')) return;
    try {
      await deleteReferenceBook(id.toString());
      const updatedBooks = await getReferenceBooks();
      setBooks(updatedBooks);
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = {
        ...formData,
        subject_id: formData.subject_id ? parseInt(formData.subject_id) : null,
        number_of_pages: formData.number_of_pages ? parseInt(formData.number_of_pages) : null,
        file_size: formData.file_size ? parseInt(formData.file_size) : null,
      };

      if (editingId) {
        await updateReferenceBook(editingId.toString(), data);
      } else {
        await createReferenceBook(data);
      }

      const updatedBooks = await getReferenceBooks();
      setBooks(updatedBooks);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save book:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">{editingId ? 'Cập nhật sách' : 'Thêm sách mới'}</h3>
            <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer">
              <i className="ri-close-line text-gray-600"></i>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sách</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: 5, 6, 7..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số trang</label>
                <input
                  type="number"
                  value={formData.number_of_pages}
                  onChange={(e) => setFormData({ ...formData, number_of_pages: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL file</label>
              <input
                type="text"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL ảnh bìa</label>
              <input
                type="text"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900">Quản lý sách tham khảo</h3>
          <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
            <span className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></span>
            Thêm sách mới
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-gray-500 font-semibold text-xs uppercase">Tên sách</th>
                <th className="text-left py-3 px-4 text-gray-500 font-semibold text-xs uppercase">Tác giả</th>
                <th className="text-left py-3 px-4 text-gray-500 font-semibold text-xs uppercase">Môn học</th>
                <th className="text-left py-3 px-4 text-gray-500 font-semibold text-xs uppercase">Lớp</th>
                <th className="text-left py-3 px-4 text-gray-500 font-semibold text-xs uppercase">Số trang</th>
                <th className="text-left py-3 px-4 text-gray-500 font-semibold text-xs uppercase">Trạng thái</th>
                <th className="text-left py-3 px-4 text-gray-500 font-semibold text-xs uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{book.title}</td>
                  <td className="py-3 px-4 text-gray-500">{book.author || '-'}</td>
                  <td className="py-3 px-4">
                    {book.category && <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{book.category}</span>}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{book.grade || '-'}</td>
                  <td className="py-3 px-4 text-gray-500">{book.number_of_pages || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${book.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {book.is_active ? 'Đang hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(book)} className="w-7 h-7 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer">
                        <i className="ri-edit-line text-xs"></i>
                      </button>
                      <button onClick={() => handleDelete(book.id)} className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 cursor-pointer">
                        <i className="ri-delete-bin-line text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
