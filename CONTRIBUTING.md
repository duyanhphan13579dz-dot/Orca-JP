# 🤝 Đóng Góp Phát Triển Dự Án Orca JP

Cảm ơn bạn đã quan tâm đến việc đóng góp cho **Orca JP**! Dự án hướng tới một nền tảng học tiếng Nhật mã nguồn mở, vận hành 100% tĩnh (Client-side), tốc độ cao và thân thiện cho cộng đồng.

---

## 🛠️ Quy Trình Đóng Góp

1. **Fork** kho lưu trữ về tài khoản cá nhân.
2. Tạo branch mới cho tính năng hoặc sửa lỗi của bạn:
   ```bash
   git checkout -b feature/ten-tinh-nang
   # hoặc
   git checkout -b fix/ten-loi
   ```
3. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
4. Kiểm tra mã nguồn và build thử nghiệm:
   ```bash
   npm run build
   ```
5. Commit thay đổi theo chuẩn [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: ...` (Tính năng mới)
   - `fix: ...` (Sửa lỗi)
   - `docs: ...` (Tài liệu)
   - `refactor: ...` (Tối ưu hóa mã nguồn)
6. Push lên branch của bạn và tạo một **Pull Request (PR)** vào branch `main`.

---

## 📐 Tiêu Chuẩn Mã Nguồn

- **Zero-Backend:** Mọi tính năng mới phải chạy 100% Client-side, không dựa vào máy chủ bên ngoài hoặc API trả phí.
- **Offline-First:** Lưu trữ dữ liệu mới thông qua IndexedDB (`src/db/indexdb.ts`).
- **Data Chunking:** Dữ liệu mới (Kanji/Ngữ pháp/Từ vựng/Đọc hiểu) cần phân cấp theo từng thư mục `src/data/n5/`, `src/data/n4/`, `src/data/n3/`.
- **Aesthetics & UX:** Giữ đúng phong cách giao diện Deep Ocean Palette, font chữ `Noto Sans JP` kết hợp `Inter`, hỗ trợ đầy đủ Dark Mode / Light Mode.
