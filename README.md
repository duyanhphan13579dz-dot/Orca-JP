# 🐋 O-Shachi (おシャチ) - Nền Tảng Học Tiếng Nhật Toàn Diện (Zero ➔ N5 ➔ N4 ➔ N3)

> *"Chinh phục tiếng Nhật từ số 0 đến N3 với sức mạnh cá voi sát thủ Shachi."*

**O-Shachi** là nền tảng học tiếng Nhật EdTech vận hành **100% tĩnh (Client-side Only, Zero-Backend, Không phụ thuộc API bên thứ ba, Offline-First)**. Toàn bộ tiến trình học tập, hàng nghìn thẻ nhớ và dữ liệu lớn được quản lý bền vững thông qua **IndexedDB**, bộ engine âm thanh sử dụng **Web Speech API** và bộ hiệu ứng tổng hợp âm **Web Audio API**.

---

## 🌟 Tính Năng Nổi Bật & 5 Phân Hệ Học Tập

### 1. 🔤 Bảng Chữ Cái & Nền Tảng Phát Âm (Zero ➔ N5)
- **Trọn bộ:** Hiragana, Katakana, Âm đục (Dakuon), Âm bán đục (Handakuon) và Âm ghép (Yoon).
- **Mẹo liên tưởng hình ảnh (Mnemonics):** Chú thích liên tưởng sinh động bằng tiếng Việt cho từng chữ cái.
- **Trình vẽ nét tương tác (Stroke Order):** Trực quan hóa từng nét vẽ bằng SVG.
- **Speed Game Romaji:** Game gõ phím phản xạ Romaji tính thời gian và điểm số.

### 2. 🈸 Thư Viện Kanji 3 Cấp Độ Theo Bộ Thủ (N5 - N4 - N3)
- Hệ thống lọc theo cấp độ: N5 (~100 chữ), N4 (~200 chữ), N3 (~350 chữ).
- Thông tin chuyên sâu:
  - **Âm Hán-Việt viết hoa** khai thác tối đa tư duy liên tưởng từ mượn.
  - Phân rã bộ thủ cấu thành & số nét viết.
  - Âm On (Onyomi) / Âm Kun (Kunyomi).
  - **Quy tắc chuyển âm Hán-Việt sang Onyomi**.
  - 2-3 từ ghép **Jukugo** kèm phiên âm Hiragana, Romaji và nghĩa tiếng Việt.
- **Bảng vẽ nét ảo (Virtual Canvas):** Luyện viết trực tiếp trên trình duyệt.

### 3. 📖 Ngữ Pháp Thực Chiến & So Sánh Sắc Thái (SOV ➔ N3)
- **N5:** Cấu trúc câu SOV cơ bản, tô màu trực quan thành phần câu (Chủ ngữ, Vị ngữ, Bổ ngữ, Trợ từ は, が, を, に, で...).
- **N4:** Biến đổi động từ (Thể khả năng, Bị động, Sai khiến, Điều kiện, Kính ngữ/Khiêm nhường ngữ cơ bản).
- **N3:** Các mẫu ngữ pháp biểu đạt sắc thái nâng cao.
- **Tính năng độc quyền "Nuance Comparator":** So sánh 2 mẫu ngữ pháp dễ nhầm lẫn cạnh nhau (ví dụ: `～わけではない` vs `～はずがない`), phân tích tâm lý người nói và ngữ cảnh sử dụng.

### 4. 📰 Trình Luyện Đọc Hiểu Tương Tác (Dokkai Reader N4 - N3)
- Tuyển tập các bài đọc ngắn định dạng chuẩn kỳ thi JLPT N4/N3.
- **Bật/Tắt Furigana toàn bài:** Linh hoạt theo nhu cầu đọc thử thách hay có hỗ trợ.
- **Instant Click-Lookup:** Nhấp vào bất kỳ từ vựng nào trong bài đọc để bung popup hiển thị cách đọc, âm Hán-Việt và nghĩa tiếng Việt ngay lập tức mà không cần chuyển trang.

### 5. 🧠 Cỗ Máy Ôn Tập SRS Spaced Repetition (SuperMemo-2)
- Thuật toán **SM-2** tùy biến chạy trên nền **IndexedDB**, xử lý hàng nghìn flashcard mượt mà không lo giới hạn bộ nhớ 5MB của localStorage.
- Hỗ trợ phím tắt bàn phím:
  - `1`: Quên / Ôn lại (Again)
  - `2`: Nhớ tạm (Good)
  - `3`: Thuần thục (Easy)
  - `Space`: Nghe phát âm từ vựng
- **Dashboard & Memory Matrix:** Thống kê tỷ lệ làm chủ theo cấp độ (N5/N4/N3) và dự báo ngày sẵn sàng thi JLPT.

---

## 🎨 Thiết Kế & Nhận Diện Thương Hiệu (Orca Design System)

- **Linh vật Orca-kun (Pure SVG):** Tự động thích ứng biểu cảm theo ngữ cảnh học tập:
  - `OrcaIdle`: Chào đón, vẫy vây khi mở ứng dụng.
  - `OrcaStudying`: Đeo băng rôn Hachimaki và kính cận khi học Kanji/Ngữ pháp N5/N4.
  - `OrcaDeepDive`: Đeo kính lặn khi luyện đọc hiểu Dokkai N3.
  - `OrcaCelebration`: Đội vương miện vàng và bắn pháo hoa khi đạt chuỗi streak.
- **Bảng màu Deep Ocean Palette:**
  - Nền Dark Mode: *Midnight Abyss* (`#0B0F19`).
  - Nền Light Mode: *Iceberg White* (`#F8FAFC`).
  - Điểm nhấn: *Cyan Neon Wave* (`#06B6D4` / `#0EA5E9`).
  - Màu cấp bậc JLPT: N5 (Xanh ngọc lợt), N4 (Xanh đại dương), N3 (Tím biển sâu).
- **Hỗ trợ Dark / Light Mode** mượt mà.
- **Sao lưu & Phục hồi 1-Click:** Xuất/nhập toàn bộ tiến trình học tập ra file `o-shachi-progress.json`.

---

## 🛠️ Công Nghệ Kỹ Thuật (Tech Stack)

| Thành Phần | Công Nghệ Sử Dụng |
|---|---|
| **Core Framework** | React 19, TypeScript |
| **Bundler & Build Tool** | Vite 7, `vite-plugin-singlefile` |
| **Styling** | Tailwind CSS v4, Lucide React Icons |
| **Cơ Sở Dữ Liệu Client** | IndexedDB API thuần (Zero latency, hỗ trợ lưu trữ lớn) |
| **Audio Engine** | Web Speech API (`ja-JP`), Web Audio API Synthesizer (SFX) |
| **Hiệu Ứng Thưởng** | Canvas Confetti |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Yêu cầu hệ thống
- [Node.js](https://nodejs.org/) phiên bản 18+ trở lên.
- Quản lý gói: `npm`, `pnpm` hoặc `yarn`.

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Truy cập trình duyệt tại: `http://localhost:5173`

### 4. Build phiên bản tĩnh để deploy (Static Export)
```bash
npm run build
```
Thư mục `dist/` sẽ chứa file tĩnh độc lập (Single HTML file đóng gói toàn bộ CSS, JS, Assets) có thể chạy trực tiếp trên bất kỳ static host nào: **GitHub Pages**, **Vercel**, **Cloudflare Pages**, **Netlify**, hoặc mở trực tiếp trên trình duyệt offline!

---

## 📦 Cấu Trúc Thư Mục

```text
src/
├── assets/mascots/              # SVG Mascot Orca-kun đa biểu cảm
├── components/
│   ├── branding/                # Logo, MascotStatus
│   ├── common/                  # AudioButton, LevelBadge, LevelSelector, BackupModal
│   ├── kana/                    # KanaGrid, StrokePlayer, KanaSpeedGame
│   ├── kanji/                   # KanjiCard, VirtualCanvas, JukugoExplorer
│   ├── grammar/                 # SentenceBuilder, ParticleBadge, NuanceComparator, VerbConjugator
│   ├── reader/                  # DokkaiReader, FuriganaText, ClickLookupModal
│   ├── srs/                     # SRSFlashcardDeck, MemoryMatrix
│   └── layout/                  # BentoSidebar, HeaderStats
├── data/
│   ├── n5/                      # kanji.ts, grammar.ts, vocab.ts
│   ├── n4/                      # kanji.ts, grammar.ts, vocab.ts
│   ├── n3/                      # kanji.ts, grammar.ts, vocab.ts, readings.ts
│   └── kanaData.ts              # Bảng chữ cái Hiragana/Katakana đầy đủ
├── db/
│   └── indexdb.ts               # Lớp tương tác IndexedDB lưu SRS & UserStats
├── hooks/
│   ├── useSpeech.ts             # Web Speech API (tốc độ theo cấp độ N5/N4/N3)
│   ├── useSoundEffects.ts       # Bộ tạo âm thanh chuẩn Web Audio API
│   └── useSRSIndexedDB.ts       # Bộ điều phối SM-2 Spaced Repetition
└── types/
    └── index.ts                 # Type definitions TypeScript
```

---

## 📄 Bản Quyền & Giấy Phép
Dự án được xây dựng phục vụ cộng đồng học tiếng Nhật phi lợi nhuận. MIT License.
