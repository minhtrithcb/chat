## React Chat - Ứng dụng nhắn tin realtime - Frontend

Đây là phần Frontend của ứng dụng [React chat]("http://localhost:3000/"). Phần Frontend được viết bằng reactjs, socket.io.

### Chức năng Frontend

* Giao diện ứng dụng, Đăng nhập, đăng ký , trang chủ, profile, cài đặt,...
* Auth JWT, xác thực sử dụng socket.
* Gửi tin nhắn, kết bạn, tìm kiếm bạn bè...
* Giao diện mobile riêng. Theme cho ứng dụng.

### Cài đặt
* Clone git repo về chạy
```
npm install
```
* Khởi chạy server
```
npm start
```

### Shit list (feature not implemented yet)
* Tìm user online / offline
* Ghim hộp thọai,
* User gửi otp đăng nhập
* Đăng nhập đa nền tảng, gửi mail
* User online theo thời gần nhất (lần cuối online)
* User tạo nhóm thêm thành viên
* User gửi theo dõi, nhắn tin khi ko kết bạn theo setting
* User post bài viết (mxh)
* User gọi & facetime
* User typing hiện đang gõ  
* User chat có file & gif ảnh 
* User upload avatar 
* User edit profile
* User send Reaction, edit msg, repost, hide msg, report msg, 
* User tạo bình chọn
* User Tìm bạn theo tag ... 
* Notification msg read or not
* Setting (chặn tin từ người lại, hiện email, hiện thông báo)


### Model
*   UserModel {
        hobby: ["id", ...],
        lang: "vn",
        gender: ["male", "female", "?"],
        working: [{"name", "true/đã"}],
        studing: [{"name", "true/đã"}],
    } 

*   HobbyModel {
        _id: "?",
        name: "Thời trang",
        color: "#fff",
        img: "?",
        des: "..."
    } 






