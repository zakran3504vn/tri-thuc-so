'use client';

export default function AdminUsers() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-6">Quản lý người dùng</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">
            {['Người dùng','Email','Vai trò','Ngày tham gia','Trạng thái'].map(h => <th key={h} className="text-left py-3 px-4 text-gray-500 font-semibold text-xs uppercase">{h}</th>)}
          </tr></thead>
          <tbody>
            {[['Nguyễn Văn An','an.nguyen@gmail.com','Học sinh','01/09/2025','Hoạt động'],['Trần Thị Bình','binh.tran@gmail.com','Giáo viên','15/08/2025','Hoạt động'],['Lê Minh Cường','cuong.le@gmail.com','Học sinh','20/09/2025','Hoạt động'],['Phạm Thu Dung','dung.pham@gmail.com','Phụ huynh','10/10/2025','Không hoạt động']].map(([name,email,role,date,status], i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white text-xs font-bold">{String(name)[0]}</div>
                    <span className="font-medium text-gray-800">{name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500">{email}</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{role}</span></td>
                <td className="py-3 px-4 text-gray-500">{date}</td>
                <td className="py-3 px-4"><span className={`px-2 py-1 text-xs rounded-full font-medium ${status === 'Hoạt động' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
