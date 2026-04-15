const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Story {
  id: number;
  title: string;
  author: string;
  category: string;
  total_pages: number;
  cover_image: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: number;
  story_id: number;
  page_number: number;
  content: string;
  image_url: string | null;
  created_at: string;
}

export interface Bookmark {
  id: number;
  user_id: string;
  story_id: number;
  page_number: number;
  created_at: string;
}

export interface Note {
  id: number;
  user_id: string;
  story_id: number;
  page_number: number;
  note_content: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string | null;
  role: 'admin' | 'teacher' | 'student';
  avatar: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  announcement_type: 'general' | 'urgent' | 'event';
  priority: number;
  publish_date: string;
  expiry_date: string | null;
  image_url: string | null;
  is_active: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
  created_by_name?: string;
}

export interface ContactInfo {
  id: number | null;
  address: string;
  phone: string;
  email: string;
  working_hours: string;
  map_iframe: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactSubmission {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ReferenceBook {
  id: number;
  title: string;
  author: string | null;
  description: string | null;
  category: string | null;
  subject_id: number | null;
  subject_name?: string | null;
  grade: string | null;
  number_of_pages: number | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  cover_image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Stories API
export async function getStories(category?: string): Promise<Story[]> {
  const url = category && category !== 'Tất cả' 
    ? `${API_BASE_URL}/stories?category=${encodeURIComponent(category)}`
    : `${API_BASE_URL}/stories`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch stories');
  return response.json();
}

export async function getStory(id: string): Promise<Story> {
  const response = await fetch(`${API_BASE_URL}/stories/${id}`);
  if (!response.ok) throw new Error('Failed to fetch story');
  return response.json();
}

export async function createStory(data: {
  title: string;
  author: string;
  category: string;
  total_pages: number;
  description?: string;
  cover_image?: string;
}, token?: string): Promise<Story> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/stories`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create story');
  }
  return response.json();
}

export async function updateStory(id: number, data: {
  title?: string;
  author?: string;
  category?: string;
  total_pages?: number;
  description?: string;
  cover_image?: string;
}, token?: string): Promise<Story> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update story');
  }
  return response.json();
}

export async function deleteStory(id: number, token?: string): Promise<void> {
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Failed to delete story');
}

// Exercises API
export interface Exercise {
  id: number;
  subject_id: number;
  title: string;
  description?: string;
  content?: string;
  file_url?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getExercises(subjectId?: string): Promise<Exercise[]> {
  const url = subjectId ? `${API_BASE_URL}/exercises?subject_id=${subjectId}` : `${API_BASE_URL}/exercises`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch exercises');
  return response.json();
}

export async function getExercise(id: string): Promise<Exercise> {
  const response = await fetch(`${API_BASE_URL}/exercises/${id}`);
  if (!response.ok) throw new Error('Failed to fetch exercise');
  return response.json();
}

export async function createExercise(data: {
  subject_id: number;
  title: string;
  description?: string;
  content?: string;
  file_url?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  order_index?: number;
  is_active?: boolean;
}, token?: string): Promise<Exercise> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/exercises`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create exercise');
  }
  return response.json();
}

export async function updateExercise(id: number, data: {
  subject_id?: number;
  title?: string;
  description?: string;
  content?: string;
  file_url?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  order_index?: number;
  is_active?: boolean;
}, token?: string): Promise<Exercise> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/exercises/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update exercise');
  }
  return response.json();
}

export async function deleteExercise(id: number, token?: string): Promise<void> {
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/exercises/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Failed to delete exercise');
}

// Tests API
export interface Test {
  id: number;
  subject_id: number;
  title: string;
  description?: string;
  file_url?: string;
  duration?: number;
  total_questions?: number;
  passing_score?: number;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getTests(subjectId?: string): Promise<Test[]> {
  const url = subjectId ? `${API_BASE_URL}/tests?subject_id=${subjectId}` : `${API_BASE_URL}/tests`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch tests');
  return response.json();
}

export async function getTest(id: string): Promise<Test> {
  const response = await fetch(`${API_BASE_URL}/tests/${id}`);
  if (!response.ok) throw new Error('Failed to fetch test');
  return response.json();
}

export async function createTest(data: {
  subject_id: number;
  title: string;
  description?: string;
  file_url?: string;
  duration?: number;
  total_questions?: number;
  passing_score?: number;
  order_index?: number;
  is_active?: boolean;
}, token?: string): Promise<Test> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/tests`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create test');
  }
  return response.json();
}

export async function updateTest(id: number, data: {
  subject_id?: number;
  title?: string;
  description?: string;
  file_url?: string;
  duration?: number;
  total_questions?: number;
  passing_score?: number;
  order_index?: number;
  is_active?: boolean;
}, token?: string): Promise<Test> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/tests/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update test');
  }
  return response.json();
}

export async function deleteTest(id: number, token?: string): Promise<void> {
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/tests/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Failed to delete test');
}

// Subjects API
export interface Subject {
  id: number;
  title: string;
  description?: string;
  grade_level?: string;
  teacher_id?: number;
  thumbnail?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getSubjects(): Promise<Subject[]> {
  const response = await fetch(`${API_BASE_URL}/subjects`);
  if (!response.ok) throw new Error('Failed to fetch subjects');
  return response.json();
}

export async function getSubject(id: string): Promise<Subject> {
  const response = await fetch(`${API_BASE_URL}/subjects/${id}`);
  if (!response.ok) throw new Error('Failed to fetch subject');
  return response.json();
}

export async function createSubject(data: {
  title: string;
  description?: string;
  grade_level?: string;
  thumbnail?: string;
}, token?: string): Promise<Subject> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/subjects`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create subject');
  }
  return response.json();
}

export async function updateSubject(id: number, data: {
  title?: string;
  description?: string;
  grade_level?: string;
  thumbnail?: string;
  is_active?: boolean;
}, token?: string): Promise<Subject> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update subject');
  }
  return response.json();
}

export async function deleteSubject(id: number, token?: string): Promise<void> {
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Failed to delete subject');
}

// Lessons API
export interface Lesson {
  id: number;
  subject_id: number;
  title: string;
  description?: string;
  video_url?: string;
  video_duration?: number;
  content?: string;
  week_number?: number;
  order_index: number;
  is_active: boolean;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
}

export async function getLessons(subjectId?: string): Promise<Lesson[]> {
  const url = subjectId ? `${API_BASE_URL}/lessons?subject_id=${subjectId}` : `${API_BASE_URL}/lessons`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch lessons');
  return response.json();
}

export async function getLesson(id: string): Promise<Lesson> {
  const response = await fetch(`${API_BASE_URL}/lessons/${id}`);
  if (!response.ok) throw new Error('Failed to fetch lesson');
  return response.json();
}

export async function createLesson(data: {
  subject_id: number;
  title: string;
  description?: string;
  video_url?: string;
  video_duration?: number;
  content?: string;
  week_number?: number;
  order_index?: number;
  thumbnail?: string;
  is_active?: boolean;
}, token?: string): Promise<Lesson> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/lessons`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create lesson');
  }
  return response.json();
}

export async function updateLesson(id: number, data: {
  subject_id?: number;
  title?: string;
  description?: string;
  video_url?: string;
  video_duration?: number;
  content?: string;
  week_number?: number;
  order_index?: number;
  thumbnail?: string;
  is_active?: boolean;
}, token?: string): Promise<Lesson> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update lesson');
  }
  return response.json();
}

export async function deleteLesson(id: number, token?: string): Promise<void> {
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Failed to delete lesson');
}

// Pages API
export async function getStoryPages(storyId: string): Promise<Page[]> {
  const response = await fetch(`${API_BASE_URL}/pages/story/${storyId}`);
  if (!response.ok) throw new Error('Failed to fetch pages');
  return response.json();
}

// Bookmarks API
export async function getBookmark(userId: string, storyId: string): Promise<Bookmark | null> {
  const response = await fetch(`${API_BASE_URL}/bookmarks?user_id=${userId}&story_id=${storyId}`);
  if (!response.ok) throw new Error('Failed to fetch bookmark');
  const data = await response.json();
  return data || null;
}

export async function saveBookmark(userId: string, storyId: string, pageNumber: number): Promise<Bookmark> {
  const response = await fetch(`${API_BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, story_id: parseInt(storyId), page_number: pageNumber }),
  });
  if (!response.ok) throw new Error('Failed to save bookmark');
  return response.json();
}

export async function deleteBookmark(userId: string, storyId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/bookmarks?user_id=${userId}&story_id=${storyId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete bookmark');
}

// Notes API
export async function getNotes(userId: string, storyId: string): Promise<Note[]> {
  const response = await fetch(`${API_BASE_URL}/notes?user_id=${userId}&story_id=${storyId}`);
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
}

export async function getPageNote(userId: string, storyId: string, pageNumber: number): Promise<Note | null> {
  const response = await fetch(`${API_BASE_URL}/notes/page?user_id=${userId}&story_id=${storyId}&page_number=${pageNumber}`);
  if (!response.ok) throw new Error('Failed to fetch note');
  const data = await response.json();
  return data || null;
}

export async function saveNote(userId: string, storyId: string, pageNumber: number, content: string): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      user_id: userId, 
      story_id: parseInt(storyId), 
      page_number: pageNumber, 
      note_content: content 
    }),
  });
  if (!response.ok) throw new Error('Failed to save note');
  return response.json();
}

export async function deleteNote(userId: string, storyId: string, pageNumber: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/notes?user_id=${userId}&story_id=${storyId}&page_number=${pageNumber}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete note');
}

// Auth API
export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  return response.json();
}

export async function register(data: {
  username: string;
  password: string;
  full_name: string;
  email?: string;
  role?: string;
}): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }
  return response.json();
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to get current user');
  return response.json();
}

// Announcements API
export async function getAnnouncements(type?: string, includeInactive?: boolean): Promise<Announcement[]> {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (includeInactive) params.append('include_inactive', 'true');
  
  const url = `${API_BASE_URL}/announcements${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch announcements');
  return response.json();
}

export async function getAnnouncement(id: number): Promise<Announcement> {
  const response = await fetch(`${API_BASE_URL}/announcements/${id}`);
  if (!response.ok) throw new Error('Failed to fetch announcement');
  return response.json();
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  announcement_type?: string;
  priority?: number;
  publish_date?: string;
  expiry_date?: string;
  image_url?: string;
  created_by?: number;
}, token: string): Promise<Announcement> {
  const response = await fetch(`${API_BASE_URL}/announcements`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create announcement');
  }
  return response.json();
}

export async function updateAnnouncement(id: number, data: {
  title?: string;
  content?: string;
  announcement_type?: string;
  priority?: number;
  publish_date?: string;
  expiry_date?: string;
  image_url?: string;
  is_active?: boolean;
}, token: string): Promise<Announcement> {
  const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update announcement');
  }
  return response.json();
}

export async function deleteAnnouncement(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete announcement');
}

export async function uploadImage(file: File): Promise<{ imageUrl: string; filename: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }

  return response.json();
}

export async function uploadFile(file: File): Promise<{ fileUrl: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload-file`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload file');
  }

  return response.json();
}

// Contact Info API
export async function getContactInfo(): Promise<ContactInfo> {
  const response = await fetch(`${API_BASE_URL}/contact-info`);
  if (!response.ok) throw new Error('Failed to fetch contact info');
  return response.json();
}

export async function createContactInfo(data: {
  address: string;
  phone: string;
  email: string;
  working_hours: string;
  map_iframe: string;
}): Promise<ContactInfo> {
  const response = await fetch(`${API_BASE_URL}/contact-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create contact info');
  }
  return response.json();
}

export async function updateContactInfo(id: number, data: {
  address: string;
  phone: string;
  email: string;
  working_hours: string;
  map_iframe: string;
}): Promise<ContactInfo> {
  const response = await fetch(`${API_BASE_URL}/contact-info/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update contact info');
  }
  return response.json();
}

// Contact Submissions API
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const response = await fetch(`${API_BASE_URL}/contact-submissions`);
  if (!response.ok) throw new Error('Failed to fetch contact submissions');
  return response.json();
}

export async function createContactSubmission(data: {
  full_name: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<ContactSubmission> {
  const response = await fetch(`${API_BASE_URL}/contact-submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create contact submission');
  }
  return response.json();
}

export async function markContactSubmissionAsRead(id: number): Promise<ContactSubmission> {
  const response = await fetch(`${API_BASE_URL}/contact-submissions/${id}/read`, {
    method: 'PUT',
  });
  if (!response.ok) throw new Error('Failed to mark submission as read');
  return response.json();
}

export async function deleteContactSubmission(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/contact-submissions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete contact submission');
}

// Reference Books API
export async function getReferenceBooks(filters?: {
  category?: string;
  subject_id?: string;
  grade?: string;
  min_pages?: string;
  max_pages?: string;
}): Promise<ReferenceBook[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.subject_id) params.append('subject_id', filters.subject_id);
  if (filters?.grade) params.append('grade', filters.grade);
  if (filters?.min_pages) params.append('min_pages', filters.min_pages);
  if (filters?.max_pages) params.append('max_pages', filters.max_pages);

  const url = `${API_BASE_URL}/reference-books${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch reference books');
  return response.json();
}

export async function getReferenceBook(id: string): Promise<ReferenceBook> {
  const response = await fetch(`${API_BASE_URL}/reference-books/${id}`);
  if (!response.ok) throw new Error('Failed to fetch reference book');
  return response.json();
}

export async function createReferenceBook(data: {
  title: string;
  author?: string;
  description?: string;
  category?: string;
  subject_id?: number;
  grade?: string;
  number_of_pages?: number;
  file_url: string;
  file_type?: string;
  file_size?: number;
  cover_image?: string;
}, token?: string): Promise<ReferenceBook> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/reference-books`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create reference book');
  }
  return response.json();
}

export async function updateReferenceBook(id: number, data: {
  title?: string;
  author?: string;
  description?: string;
  category?: string;
  subject_id?: number;
  grade?: string;
  number_of_pages?: number;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  cover_image?: string;
  is_active?: boolean;
}, token?: string): Promise<ReferenceBook> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/reference-books/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update reference book');
  }
  return response.json();
}

export async function deleteReferenceBook(id: number, token?: string): Promise<void> {
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/reference-books/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Failed to delete reference book');
}
