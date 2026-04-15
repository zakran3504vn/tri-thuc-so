'use client';
import { useState, useEffect } from 'react';
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  getTests,
  createTest,
  updateTest,
  deleteTest,
  uploadImage,
  Subject,
  Lesson,
  Exercise,
  Test
} from '@/lib/api';

export default function AdminSubjects() {
  const [activeTab, setActiveTab] = useState<'subjects' | 'lessons' | 'exercises' | 'tests'>('subjects');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

  // Subjects state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectForm, setSubjectForm] = useState({
    title: '',
    description: '',
    grade_level: '',
    thumbnail: ''
  });
  const [subjectImageFile, setSubjectImageFile] = useState<File | null>(null);
  const [subjectImagePreview, setSubjectImagePreview] = useState('');

  // Lessons state
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState({
    subject_id: 0,
    title: '',
    description: '',
    content: '',
    video_url: '',
    week_number: undefined as number | undefined,
    order_index: 0,
    thumbnail: ''
  });
  const [lessonVideoFile, setLessonVideoFile] = useState<File | null>(null);
  const [lessonThumbnailFile, setLessonThumbnailFile] = useState<File | null>(null);
  const [lessonThumbnailPreview, setLessonThumbnailPreview] = useState('');

  // Exercises state
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [exerciseForm, setExerciseForm] = useState({
    subject_id: 0,
    title: '',
    description: '',
    content: '',
    file_url: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    order_index: 0
  });
  const [exerciseFile, setExerciseFile] = useState<File | null>(null);

  // Tests state
  const [tests, setTests] = useState<Test[]>([]);
  const [showTestForm, setShowTestForm] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [testForm, setTestForm] = useState({
    subject_id: 0,
    title: '',
    description: '',
    file_url: '',
    duration: undefined as number | undefined,
    total_questions: undefined as number | undefined,
    passing_score: undefined as number | undefined,
    order_index: 0
  });
  const [testFile, setTestFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      if (activeTab === 'lessons') fetchLessons(selectedSubjectId);
      if (activeTab === 'exercises') fetchExercises(selectedSubjectId);
      if (activeTab === 'tests') fetchTests(selectedSubjectId);
    }
  }, [selectedSubjectId, activeTab]);

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    }
  };

  const fetchLessons = async (subjectId: number) => {
    try {
      const data = await getLessons(subjectId.toString());
      setLessons(data);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    }
  };

  const fetchExercises = async (subjectId: number) => {
    try {
      const data = await getExercises(subjectId.toString());
      setExercises(data);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
    }
  };

  const fetchTests = async (subjectId: number) => {
    try {
      const data = await getTests(subjectId.toString());
      setTests(data);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    }
  };

  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let thumbnail = subjectForm.thumbnail;
      
      // Upload image if a new file is selected
      if (subjectImageFile) {
        const formData = new FormData();
        formData.append('image', subjectImageFile);
        const uploadResponse = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          thumbnail = uploadData.imageUrl;
        }
      }

      if (editingSubject) {
        await updateSubject(editingSubject.id, { ...subjectForm, thumbnail, is_active: editingSubject.is_active });
      } else {
        await createSubject({ ...subjectForm, thumbnail });
      }
      setShowSubjectForm(false);
      setEditingSubject(null);
      setSubjectForm({ title: '', description: '', grade_level: '', thumbnail: '' });
      setSubjectImageFile(null);
      setSubjectImagePreview('');
      fetchSubjects();
    } catch (error) {
      console.error('Failed to save subject:', error);
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let videoUrl = lessonForm.video_url;
      let thumbnail = lessonForm.thumbnail;

      // Upload video if a new file is selected
      if (lessonVideoFile) {
        const formData = new FormData();
        formData.append('video', lessonVideoFile);
        const uploadResponse = await fetch('http://localhost:3001/api/upload-video', {
          method: 'POST',
          body: formData,
        });
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          videoUrl = uploadData.videoUrl;
        }
      }

      // Upload thumbnail if a new file is selected
      if (lessonThumbnailFile) {
        const formData = new FormData();
        formData.append('image', lessonThumbnailFile);
        const uploadResponse = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          thumbnail = uploadData.imageUrl;
        }
      }

      if (editingLesson) {
        await updateLesson(editingLesson.id, { ...lessonForm, video_url: videoUrl, thumbnail, is_active: editingLesson.is_active });
      } else {
        await createLesson({ ...lessonForm, video_url: videoUrl, thumbnail, is_active: true });
      }
      setShowLessonForm(false);
      setEditingLesson(null);
      setLessonForm({ subject_id: 0, title: '', description: '', content: '', video_url: '', week_number: undefined, order_index: 0, thumbnail: '' });
      setLessonVideoFile(null);
      setLessonThumbnailFile(null);
      setLessonThumbnailPreview('');
      if (selectedSubjectId) fetchLessons(selectedSubjectId);
    } catch (error) {
      console.error('Failed to save lesson:', error);
    }
  };

  const handleExerciseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let fileUrl = exerciseForm.file_url;

      // Upload file if a new file is selected
      if (exerciseFile) {
        const formData = new FormData();
        formData.append('file', exerciseFile);
        const uploadResponse = await fetch('http://localhost:3001/api/upload-exercise', {
          method: 'POST',
          body: formData,
        });
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          fileUrl = uploadData.fileUrl;
        }
      }

      if (editingExercise) {
        await updateExercise(editingExercise.id, { ...exerciseForm, file_url: fileUrl, is_active: editingExercise.is_active });
      } else {
        await createExercise({ ...exerciseForm, file_url: fileUrl, is_active: true });
      }
      setShowExerciseForm(false);
      setEditingExercise(null);
      setExerciseForm({ subject_id: 0, title: '', description: '', content: '', file_url: '', difficulty: 'medium', order_index: 0 });
      setExerciseFile(null);
      if (selectedSubjectId) fetchExercises(selectedSubjectId);
    } catch (error) {
      console.error('Failed to save exercise:', error);
    }
  };

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let fileUrl = testForm.file_url;

      // Upload file if a new file is selected
      if (testFile) {
        const formData = new FormData();
        formData.append('file', testFile);
        const uploadResponse = await fetch('http://localhost:3001/api/upload-test', {
          method: 'POST',
          body: formData,
        });
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          fileUrl = uploadData.fileUrl;
        }
      }

      if (editingTest) {
        await updateTest(editingTest.id, { ...testForm, file_url: fileUrl, is_active: editingTest.is_active });
      } else {
        await createTest({ ...testForm, file_url: fileUrl, is_active: true });
      }
      setShowTestForm(false);
      setEditingTest(null);
      setTestForm({ subject_id: 0, title: '', description: '', file_url: '', duration: undefined, total_questions: undefined, passing_score: undefined, order_index: 0 });
      setTestFile(null);
      if (selectedSubjectId) fetchTests(selectedSubjectId);
    } catch (error) {
      console.error('Failed to save test:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900">Quản lý môn học</h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingSubject(null);
              setSubjectForm({ title: '', description: '', grade_level: '', thumbnail: '' });
              setSubjectImageFile(null);
              setSubjectImagePreview('');
              setShowSubjectForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></span>
            Thêm môn học
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100">
        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-4 py-2 text-sm font-semibold cursor-pointer ${activeTab === 'subjects' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Môn học
        </button>
        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2 text-sm font-semibold cursor-pointer ${activeTab === 'lessons' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Bài giảng
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          className={`px-4 py-2 text-sm font-semibold cursor-pointer ${activeTab === 'exercises' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Bài tập
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2 text-sm font-semibold cursor-pointer ${activeTab === 'tests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Đề kiểm tra
        </button>
      </div>

      {/* Subjects Tab */}
      {activeTab === 'subjects' && (
        <>
          {showSubjectForm && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-4">{editingSubject ? 'Cập nhật môn học' : 'Thêm môn học mới'}</h4>
              <form onSubmit={handleSubjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên môn học *</label>
                  <input
                    type="text"
                    value={subjectForm.title}
                    onChange={e => setSubjectForm({ ...subjectForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={subjectForm.description}
                    onChange={e => setSubjectForm({ ...subjectForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khối lớp</label>
                  <input
                    type="text"
                    value={subjectForm.grade_level}
                    onChange={e => setSubjectForm({ ...subjectForm, grade_level: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh bìa</label>
                  <div className="space-y-2">
                    {subjectImagePreview && (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                        <img src={subjectImagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setSubjectImageFile(null);
                            setSubjectImagePreview('');
                            setSubjectForm({ ...subjectForm, thumbnail: '' });
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSubjectImageFile(file);
                          setSubjectImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 cursor-pointer">
                    {editingSubject ? 'Cập nhật' : 'Thêm'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubjectForm(false);
                      setEditingSubject(null);
                      setSubjectForm({ title: '', description: '', grade_level: '', thumbnail: '' });
                      setSubjectImageFile(null);
                      setSubjectImagePreview('');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <i className="ri-book-line text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">Chưa có môn học nào</p>
                <p className="text-gray-400 text-sm mt-2">Nhấn "Thêm môn học" để tạo môn học mới</p>
              </div>
            ) : (
              subjects.map((subject) => (
              <div key={subject.id} className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {subject.thumbnail && (
                      <img src={subject.thumbnail.startsWith('http') ? subject.thumbnail : `http://localhost:3001${subject.thumbnail}`} alt={subject.title} className="w-10 h-10 rounded-xl object-cover" />
                    )}
                    {!subject.thumbnail && (
                      <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                        <i className="ri-book-2-line text-white"></i>
                      </div>
                    )}
                    <span className="font-bold text-gray-800">{subject.title}</span>
                  </div>
                </div>
                {subject.grade_level && (
                  <div className="text-xs text-gray-500 mb-3">{subject.grade_level}</div>
                )}
                {subject.description && (
                  <div className="text-xs text-gray-400 mb-3 line-clamp-2">{subject.description}</div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingSubject(subject);
                      setSubjectForm({
                        title: subject.title,
                        description: subject.description || '',
                        grade_level: subject.grade_level || '',
                        thumbnail: subject.thumbnail || ''
                      });
                      setSubjectImagePreview(subject.thumbnail && subject.thumbnail.startsWith('http') ? subject.thumbnail : subject.thumbnail ? `http://localhost:3001${subject.thumbnail}` : '');
                      setShowSubjectForm(true);
                    }}
                    className="flex-1 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 cursor-pointer whitespace-nowrap"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
                        deleteSubject(subject.id).then(fetchSubjects);
                      }
                    }}
                    className="flex-1 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 cursor-pointer whitespace-nowrap"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
            )}
          </div>
        </>
      )}

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn môn học</label>
            <select
              value={selectedSubjectId || ''}
              onChange={e => setSelectedSubjectId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn môn học</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          {selectedSubjectId && (
            <>
              {showLessonForm && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-4">{editingLesson ? 'Cập nhật bài giảng' : 'Thêm bài giảng mới'}</h4>
                  <form onSubmit={handleLessonSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                      <input
                        type="text"
                        value={lessonForm.title}
                        onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        value={lessonForm.description}
                        onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tuần học</label>
                      <input
                        type="number"
                        value={lessonForm.week_number || ''}
                        onChange={e => setLessonForm({ ...lessonForm, week_number: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                      <textarea
                        value={lessonForm.content}
                        onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL Video</label>
                      <input
                        type="text"
                        value={lessonForm.video_url}
                        onChange={e => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Video</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLessonVideoFile(file);
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh thumbnail</label>
                      <div className="space-y-2">
                        {lessonThumbnailPreview && (
                          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                            <img src={lessonThumbnailPreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setLessonThumbnailFile(null);
                                setLessonThumbnailPreview('');
                                setLessonForm({ ...lessonForm, thumbnail: '' });
                              }}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setLessonThumbnailFile(file);
                              setLessonThumbnailPreview(URL.createObjectURL(file));
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 cursor-pointer">
                        {editingLesson ? 'Cập nhật' : 'Thêm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowLessonForm(false);
                          setEditingLesson(null);
                          setLessonForm({ subject_id: 0, title: '', description: '', content: '', video_url: '', week_number: null, order_index: 0, thumbnail: '' });
                          setLessonVideoFile(null);
                          setLessonThumbnailFile(null);
                          setLessonThumbnailPreview('');
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <button
                onClick={() => {
                  setEditingLesson(null);
                  setLessonForm({ subject_id: selectedSubjectId, title: '', description: '', content: '', video_url: '', week_number: undefined, order_index: 0, thumbnail: '' });
                  setLessonVideoFile(null);
                  setLessonThumbnailFile(null);
                  setLessonThumbnailPreview('');
                  setShowLessonForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer mb-6"
              >
                <span className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></span>
                Thêm bài giảng
              </button>

              <div className="space-y-3">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        {lesson.week_number && (
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 mr-2">
                            Tuần {lesson.week_number}
                          </span>
                        )}
                        <h4 className="font-semibold text-gray-800">{lesson.title}</h4>
                        {lesson.description && (
                          <p className="text-xs text-gray-400 mt-1">{lesson.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingLesson(lesson);
                            setLessonForm({
                              subject_id: lesson.subject_id,
                              title: lesson.title,
                              description: lesson.description || '',
                              content: lesson.content || '',
                              video_url: lesson.video_url || '',
                              week_number: lesson.week_number,
                              order_index: lesson.order_index,
                              thumbnail: lesson.thumbnail || ''
                            });
                            setLessonThumbnailPreview(lesson.thumbnail && lesson.thumbnail.startsWith('http') ? lesson.thumbnail : lesson.thumbnail ? `http://localhost:3001${lesson.thumbnail}` : '');
                            setShowLessonForm(true);
                          }}
                          className="px-3 py-1.5 bg-yellow-50 text-yellow-600 text-xs font-semibold rounded-lg hover:bg-yellow-100 cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Bạn có chắc chắn muốn xóa bài giảng này?')) {
                              deleteLesson(lesson.id).then(() => fetchLessons(selectedSubjectId));
                            }
                          }}
                          className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Exercises Tab */}
      {activeTab === 'exercises' && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn môn học</label>
            <select
              value={selectedSubjectId || ''}
              onChange={e => setSelectedSubjectId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn môn học</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          {selectedSubjectId && (
            <>
              {showExerciseForm && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-4">{editingExercise ? 'Cập nhật bài tập' : 'Thêm bài tập mới'}</h4>
                  <form onSubmit={handleExerciseSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                      <input
                        type="text"
                        value={exerciseForm.title}
                        onChange={e => setExerciseForm({ ...exerciseForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        value={exerciseForm.description}
                        onChange={e => setExerciseForm({ ...exerciseForm, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Độ khó</label>
                      <select
                        value={exerciseForm.difficulty}
                        onChange={e => setExerciseForm({ ...exerciseForm, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="easy">Dễ</option>
                        <option value="medium">Trung bình</option>
                        <option value="hard">Khó</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                      <textarea
                        value={exerciseForm.content}
                        onChange={e => setExerciseForm({ ...exerciseForm, content: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload file bài tập</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setExerciseFile(file);
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {exerciseForm.file_url && (
                        <p className="text-xs text-gray-500 mt-1">File hiện tại: {exerciseForm.file_url.split('/').pop()}</p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 cursor-pointer">
                        {editingExercise ? 'Cập nhật' : 'Thêm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowExerciseForm(false);
                          setEditingExercise(null);
                          setExerciseForm({ subject_id: 0, title: '', description: '', content: '', file_url: '', difficulty: 'medium', order_index: 0 });
                          setExerciseFile(null);
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <button
                onClick={() => {
                  setEditingExercise(null);
                  setExerciseForm({ subject_id: selectedSubjectId, title: '', description: '', content: '', file_url: '', difficulty: 'medium', order_index: 0 });
                  setExerciseFile(null);
                  setShowExerciseForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer mb-6"
              >
                <span className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></span>
                Thêm bài tập
              </button>

              <div className="space-y-3">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full mr-2 ${
                          exercise.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {exercise.difficulty === 'easy' ? 'Dễ' : exercise.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                        </span>
                        <h4 className="font-semibold text-gray-800">{exercise.title}</h4>
                        {exercise.description && (
                          <p className="text-xs text-gray-400 mt-1">{exercise.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingExercise(exercise);
                            setExerciseForm({
                              subject_id: exercise.subject_id,
                              title: exercise.title,
                              description: exercise.description || '',
                              content: exercise.content || '',
                              file_url: exercise.file_url || '',
                              difficulty: exercise.difficulty,
                              order_index: exercise.order_index
                            });
                            setShowExerciseForm(true);
                          }}
                          className="px-3 py-1.5 bg-yellow-50 text-yellow-600 text-xs font-semibold rounded-lg hover:bg-yellow-100 cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
                              deleteExercise(exercise.id).then(() => fetchExercises(selectedSubjectId));
                            }
                          }}
                          className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Tests Tab */}
      {activeTab === 'tests' && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn môn học</label>
            <select
              value={selectedSubjectId || ''}
              onChange={e => setSelectedSubjectId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn môn học</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          {selectedSubjectId && (
            <>
              {showTestForm && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-4">{editingTest ? 'Cập nhật đề kiểm tra' : 'Thêm đề kiểm tra mới'}</h4>
                  <form onSubmit={handleTestSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                      <input
                        type="text"
                        value={testForm.title}
                        onChange={e => setTestForm({ ...testForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        value={testForm.description}
                        onChange={e => setTestForm({ ...testForm, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
                        <input
                          type="number"
                          value={testForm.duration || ''}
                          onChange={e => setTestForm({ ...testForm, duration: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số câu hỏi</label>
                        <input
                          type="number"
                          value={testForm.total_questions || ''}
                          onChange={e => setTestForm({ ...testForm, total_questions: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đạt</label>
                        <input
                          type="number"
                          value={testForm.passing_score || ''}
                          onChange={e => setTestForm({ ...testForm, passing_score: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload file đề kiểm tra</label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setTestFile(file);
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {testForm.file_url && (
                          <p className="text-xs text-gray-500 mt-1">File hiện tại: {testForm.file_url.split('/').pop()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 cursor-pointer">
                        {editingTest ? 'Cập nhật' : 'Thêm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowTestForm(false);
                          setEditingTest(null);
                          setTestForm({ subject_id: 0, title: '', description: '', file_url: '', duration: undefined, total_questions: undefined, passing_score: undefined, order_index: 0 });
                          setTestFile(null);
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <button
                onClick={() => {
                  setEditingTest(null);
                  setTestForm({ subject_id: selectedSubjectId, title: '', description: '', file_url: '', duration: undefined, total_questions: undefined, passing_score: undefined, order_index: 0 });
                  setTestFile(null);
                  setShowTestForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer mb-6"
              >
                <span className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></span>
                Thêm đề kiểm tra
              </button>

              <div className="space-y-3">
                {tests.map((test) => (
                  <div key={test.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{test.title}</h4>
                        {test.description && (
                          <p className="text-xs text-gray-400 mt-1">{test.description}</p>
                        )}
                        <div className="flex gap-3 mt-2 text-xs text-gray-500">
                          {test.duration && <span>{test.duration} phút</span>}
                          {test.total_questions && <span>{test.total_questions} câu</span>}
                          {test.passing_score && <span>Đạt: {test.passing_score}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTest(test);
                            setTestForm({
                              subject_id: test.subject_id,
                              title: test.title,
                              description: test.description || '',
                              file_url: test.file_url || '',
                              duration: test.duration,
                              total_questions: test.total_questions,
                              passing_score: test.passing_score,
                              order_index: test.order_index
                            });
                            setShowTestForm(true);
                          }}
                          className="px-3 py-1.5 bg-yellow-50 text-yellow-600 text-xs font-semibold rounded-lg hover:bg-yellow-100 cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Bạn có chắc chắn muốn xóa đề kiểm tra này?')) {
                              deleteTest(test.id).then(() => fetchTests(selectedSubjectId));
                            }
                          }}
                          className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
