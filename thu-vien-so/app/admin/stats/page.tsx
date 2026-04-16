'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stat {
  id: number;
  label: string;
  value: string;
  icon: string;
  order_index: number;
  is_active: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5931/api';

const iconOptions = [
  'ri-book-2-line', 'ri-user-star-line', 'ri-file-text-line', 'ri-award-line',
  'ri-user-line', 'ri-book-open-line', 'ri-star-line', 'ri-heart-line',
  'ri-lightbulb-line', 'ri-calendar-line', 'ri-time-line', 'ri-eye-line'
];

export default function AdminStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    icon: 'ri-star-line',
    order_index: 0,
    is_active: true
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingStat ? `${API_URL}/stats/${editingStat.id}` : `${API_URL}/stats`;
    const method = editingStat ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setShowForm(false);
      setEditingStat(null);
      resetForm();
      fetchStats();
    } catch (error) {
      console.error('Failed to save stat:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa stat này?')) return;
    try {
      await fetch(`${API_URL}/stats/${id}`, { method: 'DELETE' });
      fetchStats();
    } catch (error) {
      console.error('Failed to delete stat:', error);
    }
  };

  const handleEdit = (stat: Stat) => {
    setEditingStat(stat);
    setFormData({
      label: stat.label,
      value: stat.value,
      icon: stat.icon,
      order_index: stat.order_index,
      is_active: stat.is_active
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      label: '',
      value: '',
      icon: 'ri-star-line',
      order_index: 0,
      is_active: true
    });
  };

  const handleAddNew = () => {
    setEditingStat(null);
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Thống kê</h1>
            <p className="text-gray-500 mt-1">Chỉnh sửa các con số hiển thị ở Stats Section</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              ← Quay lại Dashboard
            </Link>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Thêm Thống kê
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingStat ? 'Chỉnh sửa Thống kê' : 'Thêm Thống kê mới'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={e => setFormData({...formData, label: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Bài giảng video"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={e => setFormData({...formData, value: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: 1,200+"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={formData.icon}
                  onChange={e => setFormData({...formData, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={e => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Hiển thị</span>
                </label>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editingStat ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : stats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Chưa có thống kê nào</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(stat => (
              <div key={stat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <i className={`${stat.icon} text-xl text-white`}></i>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${stat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {stat.is_active ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(stat)}
                    className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(stat.id)}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
