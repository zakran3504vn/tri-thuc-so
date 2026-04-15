'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import BookNotePanel from './NotePanel';

const bookData: Record<string, { title: string; author: string; cat: string; color: string; pages: { content: string; img?: string; pageTitle?: string }[] }> = {
  '1': {
    title: 'Toán Nâng Cao Lớp 5', author: 'NXB Giáo Dục', cat: 'Toán học', color: '#3b82f6',
    pages: [
      { pageTitle: 'Chương 1: Số Tự Nhiên', content: 'Số tự nhiên là tập hợp các số nguyên không âm: 0, 1, 2, 3, 4, 5... Trong toán học, tập hợp số tự nhiên được ký hiệu là ℕ. Các phép tính cơ bản trên số tự nhiên bao gồm: cộng, trừ, nhân, chia. Khi thực hiện phép chia, cần chú ý đến số dư và điều kiện chia hết.', img: 'https://readdy.ai/api/search-image?query=mathematics%20numbers%20equations%20clean%20white%20background%20blue%20accents%20educational%20textbook%20illustration%20minimal%20modern&width=560&height=280&seq=bk001&orientation=landscape' },
      { pageTitle: 'Bài 1: Phép Cộng và Trừ', content: 'Phép cộng hai số tự nhiên a và b cho kết quả là tổng a + b. Tính chất giao hoán: a + b = b + a. Tính chất kết hợp: (a + b) + c = a + (b + c). Phần tử trung lập: a + 0 = a. Phép trừ là phép tính ngược của phép cộng: a - b = c khi và chỉ khi c + b = a.', img: 'https://readdy.ai/api/search-image?query=addition%20subtraction%20math%20problems%20clean%20whiteboard%20blue%20chalk%20numbers%20educational%20illustration%20minimal&width=560&height=280&seq=bk002&orientation=landscape' },
      { pageTitle: 'Bài 2: Phép Nhân và Chia', content: 'Phép nhân là phép cộng lặp lại: a × b = a + a + ... + a (b lần). Tính chất giao hoán: a × b = b × a. Tính chất phân phối: a × (b + c) = a × b + a × c. Phép chia: a ÷ b = c khi b × c = a. Lưu ý: không được chia cho 0. Số dư trong phép chia: a = b × q + r, trong đó 0 ≤ r < b.', img: 'https://readdy.ai/api/search-image?query=multiplication%20division%20math%20table%20clean%20blue%20white%20educational%20illustration%20numbers%20grid%20minimal%20modern&width=560&height=280&seq=bk003&orientation=landscape' },
      { pageTitle: 'Chương 2: Phân Số', content: 'Phân số là số có dạng a/b trong đó a là tử số và b là mẫu số (b ≠ 0). Phân số tối giản là phân số mà tử và mẫu không có ước chung nào khác 1. Để rút gọn phân số, ta chia cả tử và mẫu cho ƯCLN của chúng. Hai phân số bằng nhau khi tích chéo bằng nhau: a/b = c/d khi a×d = b×c.', img: 'https://readdy.ai/api/search-image?query=fractions%20math%20pie%20chart%20visual%20representation%20blue%20white%20clean%20educational%20illustration%20minimal%20modern&width=560&height=280&seq=bk004&orientation=landscape' },
      { pageTitle: 'Bài 3: Cộng Trừ Phân Số', content: 'Để cộng hoặc trừ hai phân số, ta cần đưa về cùng mẫu số. Bước 1: Tìm BCNN của hai mẫu số. Bước 2: Quy đồng mẫu số. Bước 3: Cộng hoặc trừ tử số. Bước 4: Rút gọn kết quả nếu có thể. Ví dụ: 1/3 + 1/4 = 4/12 + 3/12 = 7/12.', img: 'https://readdy.ai/api/search-image?query=fraction%20addition%20subtraction%20visual%20blocks%20bars%20blue%20white%20clean%20educational%20math%20illustration%20minimal&width=560&height=280&seq=bk005&orientation=landscape' },
      { pageTitle: 'Chương 3: Hình Học', content: 'Hình học phẳng nghiên cứu các hình trong mặt phẳng. Các hình cơ bản: điểm, đường thẳng, đoạn thẳng, góc, tam giác, tứ giác, đường tròn. Chu vi hình chữ nhật: P = 2(a + b). Diện tích hình chữ nhật: S = a × b. Diện tích tam giác: S = (đáy × chiều cao) / 2. Diện tích hình tròn: S = π × r².', img: 'https://readdy.ai/api/search-image?query=geometry%20shapes%20triangle%20rectangle%20circle%20blue%20white%20clean%20educational%20math%20illustration%20minimal%20modern&width=560&height=280&seq=bk006&orientation=landscape' },
    ]
  },
  '2': {
    title: 'Tiếng Anh Giao Tiếp Cơ Bản', author: 'NXB Trẻ', cat: 'Tiếng Anh', color: '#0d9488',
    pages: [
      { pageTitle: 'Unit 1: Greetings', content: 'Greetings are the first step in communication. Common greetings: "Hello!", "Hi!", "Good morning!", "Good afternoon!", "Good evening!". When meeting someone for the first time: "Nice to meet you!" Response: "Nice to meet you too!". Formal greetings: "How do you do?" Informal: "How are you?" / "How\'s it going?"', img: 'https://readdy.ai/api/search-image?query=English%20greetings%20people%20waving%20hello%20speech%20bubbles%20colorful%20friendly%20illustration%20teal%20white%20clean&width=560&height=280&seq=bk007&orientation=landscape' },
      { pageTitle: 'Unit 2: Introducing Yourself', content: 'Self-introduction is essential in daily communication. Structure: Name → Age → Nationality → Occupation → Hobbies. Example: "My name is Minh. I am 12 years old. I am Vietnamese. I am a student. I like reading books and playing football." Practice this structure with your own information!', img: 'https://readdy.ai/api/search-image?query=self%20introduction%20English%20learning%20person%20speaking%20confident%20teal%20white%20clean%20illustration%20minimal%20modern&width=560&height=280&seq=bk008&orientation=landscape' },
      { pageTitle: 'Unit 3: Numbers & Time', content: 'Cardinal numbers: one, two, three... ten, eleven, twelve... twenty, thirty... one hundred. Ordinal numbers: first, second, third, fourth... Telling time: "What time is it?" "It\'s three o\'clock." "It\'s half past four." "It\'s quarter to six." Days of the week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.', img: 'https://readdy.ai/api/search-image?query=numbers%20time%20clock%20calendar%20English%20learning%20teal%20white%20clean%20illustration%20minimal%20modern%20educational&width=560&height=280&seq=bk009&orientation=landscape' },
      { pageTitle: 'Unit 4: Family & Friends', content: 'Family vocabulary: father, mother, brother, sister, grandfather, grandmother, uncle, aunt, cousin. Describing family: "I have a big family." "My father is a doctor." "My mother is a teacher." Friendship: "She is my best friend." "We go to school together." "He is kind and helpful."', img: 'https://readdy.ai/api/search-image?query=family%20friends%20English%20vocabulary%20illustration%20teal%20white%20clean%20minimal%20modern%20educational%20warm&width=560&height=280&seq=bk010&orientation=landscape' },
    ]
  },
  '3': {
    title: 'Ngữ Văn Nâng Cao Lớp 6', author: 'NXB Giáo Dục', cat: 'Ngữ văn', color: '#16a34a',
    pages: [
      { pageTitle: 'Phần 1: Văn Học Dân Gian', content: 'Văn học dân gian là kho tàng văn hóa tinh thần vô giá của dân tộc, được truyền miệng qua nhiều thế hệ. Các thể loại chính: thần thoại, truyền thuyết, cổ tích, ngụ ngôn, truyện cười, ca dao, tục ngữ, câu đố. Đặc điểm: tính tập thể, tính truyền miệng, tính dị bản, gắn liền với sinh hoạt cộng đồng.', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20folk%20literature%20traditional%20stories%20illustration%20green%20white%20clean%20minimal%20modern%20educational%20warm&width=560&height=280&seq=bk011&orientation=landscape' },
      { pageTitle: 'Bài 1: Truyện Cổ Tích', content: 'Truyện cổ tích là thể loại tự sự dân gian kể về số phận của các nhân vật trong xã hội. Đặc điểm: có yếu tố thần kỳ, kết thúc có hậu, phản ánh ước mơ của nhân dân về công bằng xã hội. Phân loại: cổ tích thần kỳ (Tấm Cám, Thạch Sanh), cổ tích sinh hoạt (Cây tre trăm đốt), cổ tích loài vật.', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20fairy%20tale%20illustration%20Tam%20Cam%20traditional%20green%20white%20clean%20minimal%20modern%20educational&width=560&height=280&seq=bk012&orientation=landscape' },
      { pageTitle: 'Phần 2: Tập Làm Văn', content: 'Văn miêu tả là thể loại văn dùng ngôn ngữ để tái hiện sự vật, con người, cảnh vật một cách sinh động. Các bước viết văn miêu tả: Quan sát kỹ đối tượng → Lập dàn ý → Viết bài → Đọc lại và sửa chữa. Sử dụng các biện pháp tu từ: so sánh, nhân hóa, ẩn dụ để bài văn thêm sinh động.', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20writing%20composition%20essay%20illustration%20green%20white%20clean%20minimal%20modern%20educational%20pen%20paper&width=560&height=280&seq=bk013&orientation=landscape' },
    ]
  },
  '4': {
    title: 'Khoa Học Tự Nhiên Lớp 7', author: 'NXB Giáo Dục', cat: 'Khoa học', color: '#6366f1',
    pages: [
      { pageTitle: 'Chương 1: Tế Bào - Đơn Vị Cơ Bản', content: 'Tế bào là đơn vị cơ bản cấu tạo nên mọi sinh vật. Tế bào nhân sơ (prokaryote): không có màng nhân, ví dụ vi khuẩn. Tế bào nhân thực (eukaryote): có màng nhân, ví dụ tế bào động vật và thực vật. Các bào quan chính: nhân tế bào, ty thể, lục lạp (ở thực vật), ribosome, lưới nội chất.', img: 'https://readdy.ai/api/search-image?query=cell%20biology%20diagram%20illustration%20indigo%20white%20clean%20minimal%20modern%20educational%20science%20microscope&width=560&height=280&seq=bk014&orientation=landscape' },
      { pageTitle: 'Chương 2: Vật Chất và Năng Lượng', content: 'Vật chất tồn tại ở ba trạng thái: rắn, lỏng, khí. Sự chuyển đổi trạng thái: nóng chảy, đông đặc, bay hơi, ngưng tụ, thăng hoa. Năng lượng là khả năng thực hiện công. Các dạng năng lượng: cơ năng, nhiệt năng, điện năng, quang năng, hóa năng. Định luật bảo toàn năng lượng: năng lượng không tự sinh ra hay mất đi, chỉ chuyển hóa từ dạng này sang dạng khác.', img: 'https://readdy.ai/api/search-image?query=matter%20energy%20states%20physics%20chemistry%20illustration%20indigo%20white%20clean%20minimal%20modern%20educational%20science&width=560&height=280&seq=bk015&orientation=landscape' },
      { pageTitle: 'Chương 3: Trái Đất và Bầu Trời', content: 'Trái Đất là hành tinh thứ ba trong Hệ Mặt Trời, cách Mặt Trời khoảng 150 triệu km. Cấu trúc Trái Đất: vỏ, manti, nhân ngoài (lỏng), nhân trong (rắn). Trái Đất tự quay quanh trục trong 24 giờ (ngày đêm) và quay quanh Mặt Trời trong 365,25 ngày (năm). Mặt Trăng là vệ tinh tự nhiên duy nhất của Trái Đất.', img: 'https://readdy.ai/api/search-image?query=earth%20solar%20system%20space%20science%20illustration%20indigo%20white%20clean%20minimal%20modern%20educational%20planets&width=560&height=280&seq=bk016&orientation=landscape' },
    ]
  },
  '5': {
    title: 'Lịch Sử Việt Nam Cận Đại', author: 'NXB Giáo Dục', cat: 'Lịch sử', color: '#d97706',
    pages: [
      { pageTitle: 'Chương 1: Việt Nam Thế Kỷ XIX', content: 'Thế kỷ XIX là giai đoạn đầy biến động của lịch sử Việt Nam. Triều Nguyễn (1802-1945) là triều đại phong kiến cuối cùng. Năm 1858, thực dân Pháp nổ súng tấn công Đà Nẵng, mở đầu cuộc xâm lược Việt Nam. Năm 1862, Hiệp ước Nhâm Tuất được ký kết, nhường ba tỉnh miền Đông Nam Kỳ cho Pháp.', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20history%2019th%20century%20traditional%20illustration%20amber%20golden%20white%20clean%20minimal%20modern%20educational&width=560&height=280&seq=bk017&orientation=landscape' },
      { pageTitle: 'Chương 2: Phong Trào Yêu Nước', content: 'Phong trào Cần Vương (1885-1896) do vua Hàm Nghi phát động, kêu gọi nhân dân giúp vua đánh Pháp. Các cuộc khởi nghĩa tiêu biểu: Bãi Sậy (Nguyễn Thiện Thuật), Hương Khê (Phan Đình Phùng), Ba Đình (Đinh Công Tráng). Phong trào Đông Du (1905-1909) do Phan Bội Châu lãnh đạo, đưa thanh niên sang Nhật học.', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20patriotic%20movement%20history%20illustration%20amber%20golden%20white%20clean%20minimal%20modern%20educational%20heroes&width=560&height=280&seq=bk018&orientation=landscape' },
    ]
  },
  '6': {
    title: 'Toán Tư Duy Lớp 4', author: 'NXB Kim Đồng', cat: 'Toán học', color: '#3b82f6',
    pages: [
      { pageTitle: 'Phần 1: Tư Duy Logic', content: 'Tư duy logic là khả năng suy luận có hệ thống và chính xác. Trong toán học, tư duy logic giúp chúng ta giải quyết các bài toán phức tạp một cách có phương pháp. Các dạng bài tư duy: điền số vào ô trống, tìm quy luật dãy số, bài toán có lời văn, câu đố toán học. Luyện tập thường xuyên sẽ giúp não bộ phát triển tốt hơn.', img: 'https://readdy.ai/api/search-image?query=logical%20thinking%20math%20puzzle%20children%20colorful%20blue%20white%20clean%20minimal%20modern%20educational%20illustration&width=560&height=280&seq=bk019&orientation=landscape' },
      { pageTitle: 'Phần 2: Dãy Số và Quy Luật', content: 'Dãy số là một chuỗi các số được sắp xếp theo một quy luật nhất định. Dãy số cộng: mỗi số hơn số trước một lượng cố định. Ví dụ: 2, 5, 8, 11, 14... (cộng thêm 3). Dãy số nhân: mỗi số bằng số trước nhân với một hệ số cố định. Ví dụ: 2, 4, 8, 16, 32... (nhân 2). Tìm quy luật và điền số tiếp theo.', img: 'https://readdy.ai/api/search-image?query=number%20sequence%20pattern%20math%20children%20colorful%20blue%20white%20clean%20minimal%20modern%20educational%20illustration%20puzzle&width=560&height=280&seq=bk020&orientation=landscape' },
    ]
  },
};

const defaultBook = bookData['1'];

interface Props { bookId: string; }

function PageContent({ page, pageNum, total, cat, color }: { page: { content: string; img?: string; pageTitle?: string }; pageNum: number; total: number; cat: string; color: string }) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, #fefefe 0%, #f8f9ff 100%)' }}>
      {page.img && (
        <div className="relative flex-shrink-0" style={{ height: '38%' }}>
          <img src={page.img} alt={`Trang ${pageNum}`} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, #f8f9ff 100%)' }}></div>
        </div>
      )}
      <div className="flex-1 px-7 py-4 flex flex-col justify-between overflow-hidden">
        {page.pageTitle && (
          <h3 className="font-bold text-sm mb-2" style={{ color }}>{page.pageTitle}</h3>
        )}
        <p className="text-gray-700 leading-relaxed overflow-hidden flex-1" style={{ fontFamily: '"Georgia", "Times New Roman", serif', fontSize: '0.88rem', lineHeight: '1.8', display: '-webkit-box', WebkitLineClamp: page.img ? 6 : 11, WebkitBoxOrient: 'vertical' as const }}>
          {page.content}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: `${color}22` }}>
          <span className="text-xs font-medium" style={{ color }}>{cat}</span>
          <span className="text-xs text-gray-400">{pageNum} / {total}</span>
        </div>
      </div>
    </div>
  );
}

export default function BookFlipReader({ bookId }: Props) {
  const book = bookData[bookId] || defaultBook;
  const totalPages = book.pages.length;

  const [spreadIndex, setSpreadIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<'next' | 'prev'>('next');
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragSide, setDragSide] = useState<'left' | 'right'>('right');
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePage, setMobilePage] = useState(0);
  const [showTOC, setShowTOC] = useState(false);
  const [sliderVal, setSliderVal] = useState(0);
  const [bookmarkPage, setBookmarkPage] = useState<number | null>(null);
  const [showBookmarkToast, setShowBookmarkToast] = useState(false);
  const [bookmarkToastMsg, setBookmarkToastMsg] = useState('');
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [noteCount, setNoteCount] = useState(0);

  const dragStartX = useRef(0);
  const bookRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const storageKey = `bookmark_book_${bookId}`;
  const notesKey = `notes_book_${bookId}`;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      const savedPage = parseInt(saved, 10);
      setBookmarkPage(savedPage);
    }
  }, [storageKey]);

  useEffect(() => {
    const raw = localStorage.getItem(notesKey);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<number, string>;
      setNoteCount(Object.values(parsed).filter(v => v.trim()).length);
    }
  }, [notesKey, showNotePanel]);

  const showToast = (msg: string) => {
    setBookmarkToastMsg(msg);
    setShowBookmarkToast(true);
    setTimeout(() => setShowBookmarkToast(false), 2500);
  };

  const currentPageNum = isMobile ? mobilePage : spreadIndex * 2;

  const handleBookmark = () => {
    if (bookmarkPage === currentPageNum) {
      localStorage.removeItem(storageKey);
      setBookmarkPage(null);
      showToast('Đã xóa đánh dấu trang');
    } else {
      localStorage.setItem(storageKey, String(currentPageNum));
      setBookmarkPage(currentPageNum);
      showToast(`Đã đánh dấu trang ${currentPageNum + 1}`);
    }
  };

  const handleGoToBookmark = () => {
    if (bookmarkPage === null) return;
    if (isMobile) {
      setMobilePage(bookmarkPage);
    } else {
      const spread = Math.floor(bookmarkPage / 2);
      setSpreadIndex(spread);
      setSliderVal(spread);
    }
    showToast(`Đã chuyển đến trang đã đánh dấu`);
  };

  const totalSpreads = Math.ceil(totalPages / 2);
  const leftPageIndex = spreadIndex * 2;
  const rightPageIndex = spreadIndex * 2 + 1;
  const canNext = spreadIndex < totalSpreads - 1;
  const canPrev = spreadIndex > 0;

  const playPageSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const bufferSize = ctx.sampleRate * 0.18;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate;
        data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 28) * 0.35;
        if (i % 3 === 0) data[i] *= 1.4;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2800;
      filter.Q.value = 0.7;
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.9, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start();
    } catch {}
  }, []);

  const goToSpread = useCallback((dir: 'next' | 'prev') => {
    if (isFlipping) return;
    if (dir === 'next' && !canNext) return;
    if (dir === 'prev' && !canPrev) return;
    setFlipDir(dir);
    setIsFlipping(true);
    playPageSound();
    setTimeout(() => {
      setSpreadIndex(s => dir === 'next' ? s + 1 : s - 1);
      setSliderVal(dir === 'next' ? spreadIndex + 1 : spreadIndex - 1);
      setIsFlipping(false);
      setDragX(0);
    }, 600);
  }, [isFlipping, canNext, canPrev, spreadIndex, playPageSound]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToSpread('next');
      if (e.key === 'ArrowLeft') goToSpread('prev');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goToSpread]);

  const getClientX = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) return e.touches[0]?.clientX ?? 0;
    return e.clientX;
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, side: 'left' | 'right') => {
    if (isFlipping) return;
    if (side === 'right' && !canNext) return;
    if (side === 'left' && !canPrev) return;
    setIsDragging(true);
    setDragSide(side);
    dragStartX.current = getClientX(e);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isFlipping) return;
    const cx = getClientX(e);
    const delta = cx - dragStartX.current;
    const bookW = bookRef.current?.offsetWidth ?? 800;
    const halfW = bookW / 2;
    if (dragSide === 'right') {
      setDragX(Math.min(0, Math.max(-halfW, delta)));
    } else {
      setDragX(Math.max(0, Math.min(halfW, delta)));
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const bookW = bookRef.current?.offsetWidth ?? 800;
    const halfW = bookW / 2;
    const threshold = halfW * 0.5;
    if (dragSide === 'right' && Math.abs(dragX) > threshold) {
      goToSpread('next');
    } else if (dragSide === 'left' && dragX > threshold) {
      goToSpread('prev');
    } else {
      setDragX(0);
    }
  };

  const getFlipAngle = () => {
    if (isFlipping) return flipDir === 'next' ? -180 : 180;
    if (isDragging) {
      const bookW = bookRef.current?.offsetWidth ?? 800;
      const halfW = bookW / 2;
      return (dragX / halfW) * 180;
    }
    return 0;
  };

  const flipAngle = getFlipAngle();
  const flipProgress = Math.abs(flipAngle) / 180;
  const shadowOpacity = flipProgress * 0.5;
  const isBookmarkedCurrentPage = bookmarkPage === currentPageNum;

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)' }}>
        {showNotePanel && (
          <BookNotePanel bookId={bookId} pageIndex={currentPageNum} color={book.color} onClose={() => setShowNotePanel(false)} />
        )}
        {showBookmarkToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg transition-all">
            {bookmarkToastMsg}
          </div>
        )}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Link href="/sach-tham-khao" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 cursor-pointer text-gray-600">
              <i className="ri-arrow-left-line text-lg"></i>
            </Link>
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-tight">{book.title}</h1>
              <p className="text-xs text-gray-400">{book.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {bookmarkPage !== null && (
              <button onClick={handleGoToBookmark} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 cursor-pointer" title="Đến trang đã đánh dấu">
                <i className="ri-bookmark-fill text-blue-500 text-base"></i>
              </button>
            )}
            <button onClick={handleBookmark} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer">
              <i className={`${isBookmarkedCurrentPage ? 'ri-bookmark-fill' : 'ri-bookmark-line'} text-base`} style={{ color: isBookmarkedCurrentPage ? book.color : '#9ca3af' }}></i>
            </button>
            <button onClick={() => setShowNotePanel(true)} className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer">
              <i className="ri-sticky-note-line text-gray-400 text-base"></i>
              {noteCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-yellow-400 text-white text-xs rounded-full font-bold">{noteCount}</span>}
            </button>
            <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full ml-1">{mobilePage + 1}/{totalPages}</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col px-4 py-6">
          <div className="flex-1 rounded-2xl shadow-xl overflow-hidden border border-blue-100" style={{ minHeight: 480 }}>
            <PageContent page={book.pages[mobilePage]} pageNum={mobilePage + 1} total={totalPages} cat={book.cat} color={book.color} />
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button onClick={() => { if (mobilePage > 0) { setMobilePage(p => p - 1); playPageSound(); } }} disabled={mobilePage === 0} className="w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
              <i className="ri-arrow-left-s-line text-xl text-gray-600"></i>
            </button>
            <input type="range" min={0} max={totalPages - 1} value={mobilePage} onChange={e => { setMobilePage(Number(e.target.value)); playPageSound(); }} className="flex-1 cursor-pointer" style={{ accentColor: book.color }} />
            <button onClick={() => { if (mobilePage < totalPages - 1) { setMobilePage(p => p + 1); playPageSound(); } }} disabled={mobilePage === totalPages - 1} className="w-11 h-11 flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-white" style={{ background: book.color }}>
              <i className="ri-arrow-right-s-line text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%)` }}>
      {showNotePanel && (
        <BookNotePanel bookId={bookId} pageIndex={currentPageNum} color={book.color} onClose={() => setShowNotePanel(false)} />
      )}
      {showBookmarkToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-xl transition-all">
          {bookmarkToastMsg}
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-sm border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/sach-tham-khao" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors cursor-pointer text-white">
            <i className="ri-arrow-left-line text-lg"></i>
          </Link>
          <div>
            <h1 className="font-bold text-white text-sm leading-tight">{book.title}</h1>
            <p className="text-white/60 text-xs">{book.author} · {book.cat}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs hidden sm:block">Trang {spreadIndex * 2 + 1}–{Math.min(spreadIndex * 2 + 2, totalPages)} / {totalPages}</span>
          {bookmarkPage !== null && (
            <button onClick={handleGoToBookmark} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white text-xs transition-all cursor-pointer whitespace-nowrap" title="Đến trang đã đánh dấu">
              <i className="ri-bookmark-fill text-yellow-300 text-sm"></i>
              <span>Trang {bookmarkPage + 1}</span>
            </button>
          )}
          <button onClick={handleBookmark} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors cursor-pointer" title={isBookmarkedCurrentPage ? 'Xóa đánh dấu' : 'Đánh dấu trang này'}>
            <i className={`${isBookmarkedCurrentPage ? 'ri-bookmark-fill' : 'ri-bookmark-line'} text-lg`} style={{ color: isBookmarkedCurrentPage ? '#fbbf24' : 'white' }}></i>
          </button>
          <button onClick={() => setShowNotePanel(true)} className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors cursor-pointer text-white" title="Ghi chú trang này">
            <i className="ri-sticky-note-line text-lg"></i>
            {noteCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-yellow-400 text-white text-xs rounded-full font-bold">{noteCount}</span>}
          </button>
          <button onClick={() => setShowTOC(!showTOC)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors cursor-pointer text-white">
            <i className="ri-list-unordered text-lg"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative">
        {showTOC && (
          <div className="absolute left-6 top-4 z-50 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
            <h3 className="font-bold text-gray-800 text-sm mb-3">Mục lục</h3>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {Array.from({ length: totalSpreads }).map((_, i) => (
                <button key={i} onClick={() => { setSpreadIndex(i); setSliderVal(i); setShowTOC(false); playPageSound(); }} className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${spreadIndex === i ? 'text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`} style={spreadIndex === i ? { background: book.color } : {}}>
                  {book.pages[i * 2]?.pageTitle || `Trang ${i * 2 + 1}–${Math.min(i * 2 + 2, totalPages)}`}
                </button>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => goToSpread('prev')} disabled={!canPrev || isFlipping} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed border border-white/20">
          <i className="ri-arrow-left-s-line text-2xl text-white"></i>
        </button>

        <div className="relative" style={{ perspective: '2000px', perspectiveOrigin: 'center center' }}>
          <div
            ref={bookRef}
            className="relative flex select-none"
            style={{ width: 'min(900px, 90vw)', height: 'min(540px, 58vw)', minHeight: 400 }}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 20px 40px rgba(0,0,0,0.4)' }}></div>

            <div className="relative flex-1 rounded-l-2xl overflow-hidden cursor-w-resize" style={{ background: 'linear-gradient(135deg, #fefefe 0%, #f8f9ff 100%)' }} onMouseDown={e => handleDragStart(e, 'left')} onTouchStart={e => handleDragStart(e, 'left')}>
              {leftPageIndex < totalPages ? (
                <PageContent page={book.pages[leftPageIndex]} pageNum={leftPageIndex + 1} total={totalPages} cat={book.cat} color={book.color} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-3" style={{ background: `${book.color}22` }}>
                      <i className="ri-book-open-line text-3xl" style={{ color: book.color }}></i>
                    </div>
                    <p className="text-sm font-medium" style={{ color: book.color }}>Hết sách</p>
                  </div>
                </div>
              )}
              {bookmarkPage === leftPageIndex && (
                <div className="absolute top-0 right-4 z-10">
                  <div className="w-6 h-10 flex items-start justify-center pt-1" style={{ background: '#fbbf24', clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
                    <i className="ri-bookmark-fill text-white text-xs"></i>
                  </div>
                </div>
              )}
              <div className="absolute inset-y-0 right-0 w-8" style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.06))' }}></div>
              {isDragging && dragSide === 'left' && (
                <div className="absolute inset-0 pointer-events-none" style={{ background: `rgba(0,0,0,${shadowOpacity * 0.15})` }}></div>
              )}
            </div>

            <div className="w-px flex-shrink-0 relative z-10" style={{ background: `linear-gradient(to bottom, ${book.color}88, ${book.color}, ${book.color}88)`, boxShadow: '0 0 12px rgba(0,0,0,0.4), -2px 0 8px rgba(0,0,0,0.2), 2px 0 8px rgba(0,0,0,0.2)' }}></div>

            <div className="relative flex-1 rounded-r-2xl overflow-hidden cursor-e-resize" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #fefefe 100%)' }} onMouseDown={e => handleDragStart(e, 'right')} onTouchStart={e => handleDragStart(e, 'right')}>
              {rightPageIndex < totalPages ? (
                <PageContent page={book.pages[rightPageIndex]} pageNum={rightPageIndex + 1} total={totalPages} cat={book.cat} color={book.color} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-3" style={{ background: `${book.color}22` }}>
                      <i className="ri-book-open-line text-3xl" style={{ color: book.color }}></i>
                    </div>
                    <p className="text-sm font-medium" style={{ color: book.color }}>Hết sách</p>
                  </div>
                </div>
              )}
              {bookmarkPage === rightPageIndex && (
                <div className="absolute top-0 right-4 z-10">
                  <div className="w-6 h-10 flex items-start justify-center pt-1" style={{ background: '#fbbf24', clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
                    <i className="ri-bookmark-fill text-white text-xs"></i>
                  </div>
                </div>
              )}
              <div className="absolute inset-y-0 left-0 w-8" style={{ background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.06))' }}></div>
              {isDragging && dragSide === 'right' && (
                <div className="absolute inset-0 pointer-events-none" style={{ background: `rgba(0,0,0,${shadowOpacity * 0.15})` }}></div>
              )}
            </div>

            {(isFlipping || (isDragging && Math.abs(dragX) > 5)) && (
              <div
                className="absolute top-0 bottom-0 z-20 overflow-hidden"
                style={{
                  width: '50%',
                  left: (isFlipping ? flipDir === 'next' : dragSide === 'right') ? '50%' : '0%',
                  transformOrigin: (isFlipping ? flipDir === 'next' : dragSide === 'right') ? 'left center' : 'right center',
                  transform: `perspective(2000px) rotateY(${flipAngle}deg)`,
                  transition: isFlipping ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none',
                  borderRadius: (isFlipping ? flipDir === 'next' : dragSide === 'right') ? '0 12px 12px 0' : '12px 0 0 12px',
                  boxShadow: `${flipAngle < 0 ? '-' : ''}${Math.abs(flipAngle) * 0.3}px 0 ${Math.abs(flipAngle) * 0.5}px rgba(0,0,0,${shadowOpacity * 0.6})`,
                  background: 'linear-gradient(135deg, #fefefe 0%, #f8f9ff 100%)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {flipAngle > -90 && flipAngle < 90 ? (
                  (isFlipping ? flipDir === 'next' : dragSide === 'right') && rightPageIndex < totalPages ? (
                    <PageContent page={book.pages[rightPageIndex]} pageNum={rightPageIndex + 1} total={totalPages} cat={book.cat} color={book.color} />
                  ) : leftPageIndex < totalPages ? (
                    <PageContent page={book.pages[leftPageIndex]} pageNum={leftPageIndex + 1} total={totalPages} cat={book.cat} color={book.color} />
                  ) : null
                ) : (
                  (isFlipping ? flipDir === 'next' : dragSide === 'right') ? (
                    rightPageIndex + 2 < totalPages ? <PageContent page={book.pages[rightPageIndex + 2]} pageNum={rightPageIndex + 3} total={totalPages} cat={book.cat} color={book.color} /> : null
                  ) : (
                    leftPageIndex - 2 >= 0 ? <PageContent page={book.pages[leftPageIndex - 2]} pageNum={leftPageIndex - 1} total={totalPages} cat={book.cat} color={book.color} /> : null
                  )
                )}
                <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(${(isFlipping ? flipDir === 'next' : dragSide === 'right') ? 'to right' : 'to left'}, rgba(0,0,0,${shadowOpacity * 0.25}), transparent 60%)` }}></div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-6 rounded-b-2xl pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.15), transparent)', zIndex: 5 }}></div>
          </div>

          <div className="mt-6 flex items-center gap-4 px-2">
            <span className="text-white/50 text-xs whitespace-nowrap">Trang 1</span>
            <input type="range" min={0} max={totalSpreads - 1} value={sliderVal} onChange={e => { const v = Number(e.target.value); setSliderVal(v); setSpreadIndex(v); playPageSound(); }} className="flex-1 cursor-pointer" style={{ accentColor: book.color }} />
            <span className="text-white/50 text-xs whitespace-nowrap">Trang {totalPages}</span>
          </div>
          <p className="text-center text-white/40 text-xs mt-2">Kéo góc trang hoặc dùng phím ← → để lật · Nhấn <i className="ri-bookmark-line"></i> để đánh dấu trang</p>
        </div>

        <button onClick={() => goToSpread('next')} disabled={!canNext || isFlipping} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed border border-white/20">
          <i className="ri-arrow-right-s-line text-2xl text-white"></i>
        </button>
      </div>
    </div>
  );
}
