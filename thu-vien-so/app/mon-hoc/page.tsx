'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubjectGrid from './SubjectGrid';

export default function MonHocPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <div className="bg-gradient-to-r from-blue-700 to-green-600 py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-white mb-3">Môn học</h1>
            <p className="text-blue-100 text-lg">Khám phá kho bài giảng phong phú theo từng môn học</p>
          </div>
        </div>
        <SubjectGrid />
      </main>
      <Footer />
    </div>
  );
}
