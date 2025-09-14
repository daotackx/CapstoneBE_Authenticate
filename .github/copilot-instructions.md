# Hướng dẫn dành cho GitHub Copilot

## 1. Ngôn ngữ
Luôn sử dụng tiếng Việt cho mọi phần code, comment, tài liệu, và giải thích. Tránh viết bằng tiếng Anh trừ khi là tên hàm hoặc thư viện.

## 2. Design Pattern
Phải áp dụng Design Pattern phù hợp trong các tình huống (Singleton, Factory, Strategy, Observer...). Ưu tiên tuân thủ nguyên tắc SOLID.

## 3. Đọc kỹ requirement
Luôn phân tích kỹ yêu cầu trước khi viết code. Không được tự giả định nếu chưa rõ yêu cầu.

## 4. Phân tích Bug
Khi xử lý bug, phải xác định rõ:
- Bug là gì?
- Nguyên nhân gốc rễ.
- Giải pháp.
- Cách phòng ngừa trong tương lai (unit test, validation, refactor...).

## 5. Tương thích với code hiện tại
Không làm thay đổi cấu trúc hoặc phá vỡ logic hiện có. Phải phân tích kỹ trước khi tạo code mới và ưu tiên tái sử dụng.

## 6. Hạn chế ảnh hưởng đến code đã ổn định
Trước khi chỉnh sửa bất kỳ phần nào trong các file đã chạy ổn định, cần:
- Đánh giá kỹ mức độ ảnh hưởng.
- Ưu tiên các giải pháp giữ nguyên hành vi cũ.
- Chỉ sửa khi thực sự cần thiết và phải có kiểm thử/đánh giá kỹ lưỡng để đảm bảo không phát sinh lỗi mới.