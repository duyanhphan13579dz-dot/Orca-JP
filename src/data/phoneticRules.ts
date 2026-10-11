export interface PhoneticRule {
  id: string;
  category: 'rhyme' | 'initial_consonant' | 'tone' | 'special';
  vietnamesePattern: string;
  japaneseOnyomi: string;
  explanation: string;
  examples: {
    hanViet: string;
    kanji: string;
    onyomi: string;
    meaning: string;
  }[];
}

export const PHONETIC_RULES: PhoneticRule[] = [
  // --- NHÓM 1: QUY TẮC BIẾN ĐỔI THEO VẦN (RHYME RULES) ---
  {
    id: 'pr-an',
    category: 'rhyme',
    vietnamesePattern: 'Vần -AN',
    japaneseOnyomi: 'AN / KAN / BAN',
    explanation: 'Các chữ Hán-Việt tận cùng bằng vần "-an" thường chuyển thành âm "AN" hoặc "KAN" trong tiếng Nhật.',
    examples: [
      { hanViet: 'AN', kanji: '安', onyomi: 'AN', meaning: 'An toàn, yên tĩnh' },
      { hanViet: 'GIAN', kanji: '間', onyomi: 'KAN / GEN', meaning: 'Khoảng cách, thời gian' },
      { hanViet: 'BẢN', kanji: '本', onyomi: 'HON / HAN', meaning: 'Gốc rễ, sách' },
      { hanViet: 'TOÁN', kanji: '算', onyomi: 'SAN', meaning: 'Tính toán' },
    ],
  },
  {
    id: 'pr-ang-uong',
    category: 'rhyme',
    vietnamesePattern: 'Vần -ANG / -ƯƠNG',
    japaneseOnyomi: 'OU / KOU / RYOU / SHOU',
    explanation: 'Hầu hết các từ Hán-Việt có vần "-ang" hoặc "-ương" đều kéo dài thành âm đôi "-OU" (kéo dài thành trường âm).',
    examples: [
      { hanViet: 'QUANG', kanji: '光', onyomi: 'KOU', meaning: 'Ánh sáng' },
      { hanViet: 'TRƯỜNG', kanji: '長', onyomi: 'CHOU', meaning: 'Dài, trưởng' },
      { hanViet: 'LƯƠNG', kanji: '良', onyomi: 'RYOU', meaning: 'Tốt lành' },
      { hanViet: 'THƯƠNG', kanji: '商', onyomi: 'SHOU', meaning: 'Buôn bán' },
      { hanViet: 'HOÀNG', kanji: '黄', onyomi: 'KOU / OU', meaning: 'Màu vàng' },
    ],
  },
  {
    id: 'pr-at-at',
    category: 'rhyme',
    vietnamesePattern: 'Vần -ÂT',
    japaneseOnyomi: 'ITSU / ICHI / SHITSU',
    explanation: 'Vần "-ât" trong Hán-Việt chuyển thành ngắt âm "ITSU" hoặc "ICHI".',
    examples: [
      { hanViet: 'NHẬT', kanji: '日', onyomi: 'NICHI / JITSU', meaning: 'Mặt trời, ngày' },
      { hanViet: 'NHẤT', kanji: '一', onyomi: 'ICHI / ITSU', meaning: 'Số một' },
      { hanViet: 'THẤT', kanji: '失', onyomi: 'SHITSU', meaning: 'Mất mát, thất bại' },
      { hanViet: 'TẤT', kanji: '必', onyomi: 'HITSU', meaning: 'Tất yếu, chắc chắn' },
      { hanViet: 'PHẬT', kanji: '仏', onyomi: 'BUTSU', meaning: 'Đức Phật' },
    ],
  },
  {
    id: 'pr-uyet',
    category: 'rhyme',
    vietnamesePattern: 'Vần -UYỆT',
    japaneseOnyomi: 'ETSU / KETSU / ZETSU',
    explanation: 'Vần "-uyệt" chuyển thành âm ngắt kết thúc bằng "ETSU".',
    examples: [
      { hanViet: 'NGUYỆT', kanji: '月', onyomi: 'GETSU / GATSU', meaning: 'Mặt trăng, tháng' },
      { hanViet: 'QUYẾT', kanji: '決', onyomi: 'KETSU', meaning: 'Quyết định' },
      { hanViet: 'TUYỆT', kanji: '絶', onyomi: 'ZETSU', meaning: 'Tuyệt đối, cắt đứt' },
      { hanViet: 'DUYỆT', kanji: '閲', onyomi: 'ETSU', meaning: 'Xem xét, duyệt' },
    ],
  },
  {
    id: 'pr-anh-inh',
    category: 'rhyme',
    vietnamesePattern: 'Vần -ANH / -INH',
    japaneseOnyomi: 'EI / SEI / SHOU',
    explanation: 'Vần "-anh" và "-inh" thường chuyển thành trường âm "EI" hoặc "SEI".',
    examples: [
      { hanViet: 'ANH', kanji: '英', onyomi: 'EI', meaning: 'Anh hùng, nước Anh' },
      { hanViet: 'THANH', kanji: '青', onyomi: 'SEI / SHOU', meaning: 'Màu xanh' },
      { hanViet: 'SINH', kanji: '生', onyomi: 'SEI / SHOU', meaning: 'Sinh ra, sống' },
      { hanViet: 'MINH', kanji: '明', onyomi: 'MEI / MYOU', meaning: 'Sáng sủa' },
      { hanViet: 'TINH', kanji: '精', onyomi: 'SEI / SHOU', meaning: 'Tinh thần, tinh hoa' },
    ],
  },
  {
    id: 'pr-ich',
    category: 'rhyme',
    vietnamesePattern: 'Vần -ÍCH / -ỊCH',
    japaneseOnyomi: 'EKI / TEKI / SEKI',
    explanation: 'Vần "-ích / -ịch" chuyển sang đuôi "EKI" hoặc "EKI/TEKI".',
    examples: [
      { hanViet: 'ÍCH', kanji: '益', onyomi: 'EKI', meaning: 'Lợi ích' },
      { hanViet: 'DỊCH', kanji: '役', onyomi: 'EKI / YAKU', meaning: 'Vai trò, chức vụ' },
      { hanViet: 'TÍCH', kanji: '積', onyomi: 'SEKI', meaning: 'Tích lũy' },
      { hanViet: 'THÍCH', kanji: '適', onyomi: 'TEKI', meaning: 'Thích hợp' },
    ],
  },
  {
    id: 'pr-ieu-eu',
    category: 'rhyme',
    vietnamesePattern: 'Vần -IÊU / -ÊU',
    japaneseOnyomi: 'YOU / KYOU / CHOU',
    explanation: 'Vần "-iêu / -êu" chuyển thành trường âm kết thúc bằng "OU".',
    examples: [
      { hanViet: 'TRIỆU / CHIÊU', kanji: '召', onyomi: 'SHOU', meaning: 'Mời, triệu tập' },
      { hanViet: 'KIỀU', kanji: '橋', onyomi: 'KYOU', meaning: 'Cây cầu' },
      { hanViet: 'ĐIỂU', kanji: '鳥', onyomi: 'CHOU', meaning: 'Con chim' },
      { hanViet: 'BIỂU', kanji: '表', onyomi: 'HYOU', meaning: 'Biểu hiện, mặt ngoài' },
      { hanViet: 'TIÊU', kanji: '消', onyomi: 'SHOU', meaning: 'Biến mất, tiêu trừ' },
    ],
  },
  {
    id: 'pr-ong-ung',
    category: 'rhyme',
    vietnamesePattern: 'Vần -ÔNG / -UNG',
    japaneseOnyomi: 'OU / KOU / CHUU / DOU',
    explanation: 'Vần "-ông / -ung" chuyển thành trường âm "-OU" hoặc "-UU".',
    examples: [
      { hanViet: 'CÔNG', kanji: '工', onyomi: 'KOU / KU', meaning: 'Công việc, thợ' },
      { hanViet: 'ĐỒNG', kanji: '同', onyomi: 'DOU', meaning: 'Cùng nhau, giống nhau' },
      { hanViet: 'TRUNG', kanji: '中', onyomi: 'CHUU', meaning: 'Ở giữa, bên trong' },
      { hanViet: 'THÔNG', kanji: '通', onyomi: 'TSUU', meaning: 'Thông qua, đi lại' },
      { hanViet: 'KHÔNG', kanji: '空', onyomi: 'KUU', meaning: 'Bầu trời, trống rỗng' },
    ],
  },
  {
    id: 'pr-ac',
    category: 'rhyme',
    vietnamesePattern: 'Vần -AC / -ẠC',
    japaneseOnyomi: 'AKU / GAKU / RAKU',
    explanation: 'Vần "-ac" chuyển thành ngắt âm "-AKU".',
    examples: [
      { hanViet: 'LẠC', kanji: '楽', onyomi: 'RAKU / GAKU', meaning: 'Vui vẻ, âm nhạc' },
      { hanViet: 'ÁC', kanji: '悪', onyomi: 'AKU', meaning: 'Xấu, ác độc' },
      { hanViet: 'HỌC', kanji: '学', onyomi: 'GAKU', meaning: 'Học tập' },
      { hanViet: 'TÁC', kanji: '作', onyomi: 'SAKU', meaning: 'Chế tạo, sáng tác' },
    ],
  },
  {
    id: 'pr-ap',
    category: 'rhyme',
    vietnamesePattern: 'Vần -AP / -ẬP',
    japaneseOnyomi: 'OU / KOU / SHUU',
    explanation: 'Các chữ tận cùng là "-ap / -ập" xưa kia có âm môi, sang Onyomi hiện đại biến thành trường âm "-OU" hoặc âm ngắn "-UU".',
    examples: [
      { hanViet: 'TẬP', kanji: '集', onyomi: 'SHUU', meaning: 'Tập hợp' },
      { hanViet: 'HỢP', kanji: '合', onyomi: 'GOU / GAT', meaning: 'Hợp lại, vừa vặn' },
      { hanViet: 'PHÁP', kanji: '法', onyomi: 'HOU', meaning: 'Phương pháp, luật pháp' },
      { hanViet: 'CẤP', kanji: '急', onyomi: 'KYUU', meaning: 'Khẩn cấp, nhanh vội' },
    ],
  },
  {
    id: 'pr-am',
    category: 'rhyme',
    vietnamesePattern: 'Vần -AM / -ÂM',
    japaneseOnyomi: 'AN / SAN / SHIN / JIN',
    explanation: 'Âm kết thúc bằng "-am / -âm" trong tiếng Nhật chuyển thành phụ âm mũi "-N".',
    examples: [
      { hanViet: 'TÂM', kanji: '心', onyomi: 'SHIN', meaning: 'Trái tim, tâm trí' },
      { hanViet: 'THAM', kanji: '参', onyomi: 'SAN', meaning: 'Tham gia' },
      { hanViet: 'ÂM', kanji: '音', onyomi: 'ON / IN', meaning: 'Âm thanh' },
      { hanViet: 'LÂM', kanji: '林', onyomi: 'RIN', meaning: 'Rừng cây nhỏ' },
    ],
  },
  {
    id: 'pr-uc',
    category: 'rhyme',
    vietnamesePattern: 'Vần -ÚC / -ỤC',
    japaneseOnyomi: 'UKU / SHOKU / BOKU',
    explanation: 'Vần "-úc / -ục" chuyển thành ngắt âm đuôi "-UKU".',
    examples: [
      { hanViet: 'PHÚC', kanji: '福', onyomi: 'FUKU', meaning: 'Hạnh phúc, phúc lành' },
      { hanViet: 'MỤC', kanji: '目', onyomi: 'MOKU / BOKU', meaning: 'Mắt, hạng mục' },
      { hanViet: 'PHỤC', kanji: '服', onyomi: 'FUKU', meaning: 'Quần áo, phục tùng' },
      { hanViet: 'THÚC', kanji: '束', onyomi: 'SOKU', meaning: 'Bó, ràng buộc' },
    ],
  },

  // --- NHÓM 2: QUY TẮC BIẾN ĐỔI THEO PHỤ ÂM ĐẦU (INITIAL CONSONANTS) ---
  {
    id: 'pr-init-d',
    category: 'initial_consonant',
    vietnamesePattern: 'Phụ âm đầu Đ-',
    japaneseOnyomi: 'T- / D- (TA, TE, TO, DA, DE, DO)',
    explanation: 'Chữ cái Hán-Việt bắt đầu bằng "Đ" luôn chuyển thành hàng T hoặc hàng D trong tiếng Nhật.',
    examples: [
      { hanViet: 'ĐẠI', kanji: '大', onyomi: 'DAI / TAI', meaning: 'To lớn' },
      { hanViet: 'ĐỊA', kanji: '地', onyomi: 'CHI / JI', meaning: 'Đất đai' },
      { hanViet: 'ĐỒNG', kanji: '同', onyomi: 'DOU', meaning: 'Giống nhau' },
      { hanViet: 'ĐIỆN', kanji: '電', onyomi: 'DEN', meaning: 'Điện lực' },
    ],
  },
  {
    id: 'pr-init-b',
    category: 'initial_consonant',
    vietnamesePattern: 'Phụ âm đầu B-',
    japaneseOnyomi: 'H- / B- / F- (HA, HI, FU, HE, HO)',
    explanation: 'Hầu hết các âm bắt đầu bằng "B" trong Hán-Việt tương ứng với hàng "H" hoặc "B/F" trong tiếng Nhật.',
    examples: [
      { hanViet: 'BÌNH', kanji: '平', onyomi: 'HEI / BYOU', meaning: 'Bằng phẳng, hòa bình' },
      { hanViet: 'BẤT', kanji: '不', onyomi: 'FU / BUTSU', meaning: 'Không, bất biến' },
      { hanViet: 'BỆNH', kanji: '病', onyomi: 'BYOU', meaning: 'Ốm đau, căn bệnh' },
      { hanViet: 'BẠCH', kanji: '白', onyomi: 'HAKU / BYAKU', meaning: 'Màu trắng' },
    ],
  },
  {
    id: 'pr-init-gi',
    category: 'initial_consonant',
    vietnamesePattern: 'Phụ âm đầu GI-',
    japaneseOnyomi: 'K- / G- (KA, KI, KU, KE, KO)',
    explanation: 'Chữ cái bắt đầu bằng "GI" thường biến đổi thành âm hàng "K" hoặc âm đục "G".',
    examples: [
      { hanViet: 'GIÁO', kanji: '教', onyomi: 'KOU', meaning: 'Dạy dỗ' },
      { hanViet: 'GIẢI', kanji: '解', onyomi: 'KAI / GE', meaning: 'Giải thích, cởi bỏ' },
      { hanViet: 'GIẢM', kanji: '減', onyomi: 'GEN', meaning: 'Giảm bớt' },
      { hanViet: 'GIÁ', kanji: '価', onyomi: 'KA', meaning: 'Giá cả, giá trị' },
    ],
  },
  {
    id: 'pr-init-tr',
    category: 'initial_consonant',
    vietnamesePattern: 'Phụ âm đầu TR-',
    japaneseOnyomi: 'CH- / J- (CHA, CHU, CHO, JUU)',
    explanation: 'Phụ âm uốn lưỡi "TR" trong tiếng Việt chuyển sang hàng "CH" hoặc "J" trong Onyomi.',
    examples: [
      { hanViet: 'TRUNG', kanji: '中', onyomi: 'CHUU', meaning: 'Ở giữa, trung tâm' },
      { hanViet: 'TRƯỜNG', kanji: '長', onyomi: 'CHOU', meaning: 'Dài, lãnh đạo' },
      { hanViet: 'TRỌNG', kanji: '重', onyomi: 'JUU / CHOU', meaning: 'Nặng, kính trọng' },
      { hanViet: 'TRI', kanji: '知', onyomi: 'CHI', meaning: 'Hiểu biết, tri thức' },
    ],
  },
  {
    id: 'pr-init-ph',
    category: 'initial_consonant',
    vietnamesePattern: 'Phụ âm đầu PH-',
    japaneseOnyomi: 'H- / F- (FU, HOU, HATSU)',
    explanation: 'Phụ âm "PH" trong Hán-Việt tương ứng với hàng "H / F" trong tiếng Nhật.',
    examples: [
      { hanViet: 'PHÁT', kanji: '発', onyomi: 'HATSU / HOTSU', meaning: 'Phát triển, xuất phát' },
      { hanViet: 'PHONG', kanji: '風', onyomi: 'FUU', meaning: 'Gió, phong cách' },
      { hanViet: 'PHÂN', kanji: '分', onyomi: 'FUN / BUN', meaning: 'Phân chia, phút' },
      { hanViet: 'PHÒNG', kanji: '防', onyomi: 'BOU', meaning: 'Phòng ngừa' },
    ],
  },
  {
    id: 'pr-init-v',
    category: 'initial_consonant',
    vietnamesePattern: 'Phụ âm đầu V-',
    japaneseOnyomi: 'M- / B- / W- (MAN, BUN, WA)',
    explanation: 'Chữ "V" trong tiếng Việt gốc là môi-răng, thường tương ứng với âm môi M hoặc B trong Onyomi.',
    examples: [
      { hanViet: 'VẠN', kanji: '万', onyomi: 'MAN / BAN', meaning: 'Mười nghìn' },
      { hanViet: 'VĂN', kanji: '文', onyomi: 'BUN / MON', meaning: 'Văn hóa, câu chữ' },
      { hanViet: 'VẤN', kanji: '問', onyomi: 'MON', meaning: 'Hỏi han, vấn đề' },
      { hanViet: 'VỊ', kanji: '味', onyomi: 'MI', meaning: 'Mùi vị' },
    ],
  },
  {
    id: 'pr-init-th',
    category: 'initial_consonant',
    vietnamesePattern: 'Phụ âm đầu TH-',
    japaneseOnyomi: 'S- / SH- / T- (SEI, SHOU, TAI)',
    explanation: 'Phụ âm "TH" thường phân nhánh thành hàng S/SH hoặc T.',
    examples: [
      { hanViet: 'THIÊN', kanji: '天', onyomi: 'TEN', meaning: 'Trời' },
      { hanViet: 'THƯ', kanji: '書', onyomi: 'SHO', meaning: 'Viết, sách' },
      { hanViet: 'THỜI', kanji: '時', onyomi: 'JI', meaning: 'Thời gian' },
      { hanViet: 'THỦY', kanji: '水', onyomi: 'SUI', meaning: 'Nước' },
    ],
  },
  {
    id: 'pr-init-ng',
    category: 'initial_consonant',
    vietnamesePattern: 'Phụ âm đầu NG- / NGH-',
    japaneseOnyomi: 'G- (GA, GI, GU, GE, GO)',
    explanation: 'Phụ âm ngạc mềm "NG" thường bảo lưu thành âm đục hàng "G" trong tiếng Nhật.',
    examples: [
      { hanViet: 'NGÔN', kanji: '言', onyomi: 'GEN / GON', meaning: 'Lời nói' },
      { hanViet: 'NGỮ', kanji: '語', onyomi: 'GO', meaning: 'Ngôn ngữ' },
      { hanViet: 'NGUYÊN', kanji: '元', onyomi: 'GEN / GAN', meaning: 'Nguyên vẹn, gốc' },
      { hanViet: 'NGHỆ', kanji: '芸', onyomi: 'GEI', meaning: 'Nghệ thuật' },
    ],
  },

  // --- NHÓM 3: QUY TẮC THANH ĐIỆU (TONE RULES) ---
  {
    id: 'pr-tone-nang-hoi',
    category: 'tone',
    vietnamesePattern: 'Thanh Nặng (.) & Ngã (~)',
    japaneseOnyomi: 'Âm đục (Dakuon - G, Z, D, B)',
    explanation: 'Quy luật âm sắc học: Tiếng Việt mang thanh Nặng hoặc Ngã thường tương ứng với âm Đục (có dấu Tenten) trong tiếng Nhật.',
    examples: [
      { hanViet: 'ĐỘNG', kanji: '動', onyomi: 'DOU', meaning: 'Hoạt động, chuyển động' },
      { hanViet: 'BẠI', kanji: '敗', onyomi: 'HAI / BAI', meaning: 'Thất bại' },
      { hanViet: 'NGHĨA', kanji: '義', onyomi: 'GI', meaning: 'Ý nghĩa, chính nghĩa' },
      { hanViet: 'HỌA', kanji: '画', onyomi: 'GA / KAKU', meaning: 'Bức họa, kế hoạch' },
    ],
  },
];
