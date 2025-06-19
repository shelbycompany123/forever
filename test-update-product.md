# Test Plan cho chức năng Update Product với ảnh

## Các chức năng đã hoàn thiện:

### Backend (productController.js):
1. ✅ Hoàn thiện function `updateProduct`
2. ✅ Xử lý upload ảnh mới lên Cloudinary
3. ✅ Giữ ảnh cũ nếu không thay đổi
4. ✅ Xử lý trường hợp xóa ảnh (giảm số lượng ảnh)
5. ✅ Xử lý trường hợp thêm ảnh mới

### Backend Route (productRoute.js):
1. ✅ Thêm middleware multer cho endpoint update
2. ✅ Thêm adminAuth middleware

### Frontend (UpdateProduct.jsx):
1. ✅ Sửa logic gửi FormData
2. ✅ Append ảnh đúng cách vào FormData
3. ✅ Hiển thị ảnh với UI/UX tốt hơn
4. ✅ Thêm chức năng thay đổi ảnh
5. ✅ Thêm chức năng xóa ảnh
6. ✅ Thêm chức năng thêm ảnh mới
7. ✅ Sử dụng token từ props
8. ✅ Sửa lỗi label price bị đảo ngược

## Test Cases cần kiểm tra:

### Test Case 1: Thay đổi ảnh hiện có
- Mở trang update product
- Click vào một ảnh hiện có
- Chọn ảnh mới
- Submit form
- Kiểm tra ảnh đã được cập nhật

### Test Case 2: Xóa ảnh
- Mở trang update product
- Click nút X để xóa một ảnh
- Submit form
- Kiểm tra ảnh đã bị xóa

### Test Case 3: Thêm ảnh mới
- Mở trang update product (sản phẩm có ít hơn 4 ảnh)
- Click vào nút "Thêm ảnh"
- Chọn ảnh mới
- Submit form
- Kiểm tra ảnh mới đã được thêm

### Test Case 4: Cập nhật thông tin khác
- Thay đổi tên, mô tả, giá, category
- Submit form
- Kiểm tra thông tin đã được cập nhật

### Test Case 5: Kết hợp nhiều thay đổi
- Thay đổi ảnh + thông tin sản phẩm
- Submit form
- Kiểm tra tất cả thay đổi

## Cách test:

1. Khởi động backend server
2. Khởi động admin frontend
3. Đăng nhập với tài khoản admin
4. Vào trang List Products
5. Click nút edit (SquarePen icon) của một sản phẩm
6. Thực hiện các test cases trên

## Lưu ý:
- Đảm bảo có token admin hợp lệ
- Đảm bảo Cloudinary đã được cấu hình đúng
- Kiểm tra console log để debug nếu có lỗi
