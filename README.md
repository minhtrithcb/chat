## React Chat - Ứng dụng nhắn tin realtime - Frontend

Đây là phần Frontend của ứng dụng [React chat]("http://localhost:3000/"). Phần Frontend được viết bằng reactjs, socket.io.


### Cài đặt
* Clone git repo về chạy
```
npm install
```
* Khởi chạy server
```
npm start
```

### Chức năng Frontend Đã hoàn thiện

* Giao diện, Đăng nhập, đăng ký, trang chủ, profile, trang 404...
* Logic Đăng nhập, đăng ký, đăng xuất, kiểm lỗi form, protective Route. 
* kết bạn nhận tin kết bạn (realtime), Gửi tin nhắn (realtime)
* Người dùng tìm kiếm bạn bè (thêm thành công tạo hộp thoại)
* Người dùng thêm, sửa Reaction (realtime).
* Người sửa, thu hồi Chat (realtime).


#### Chức năng đang làm
 trích lời (reply),


### Chức năng Frontend sẻ có ...

* Ngày trên chat
* xác thực sử dụng socket.
* Tìm user online / offline
* Ghim hộp thọai,
* User gửi otp đăng nhập
* Đăng nhập đa nền tảng, gửi mail
* User online theo thời gần nhất (lần cuối online)
* User tạo nhóm thêm thành viên
* User gửi theo dõi, nhắn tin khi ko kết bạn theo setting
* User gọi & facetime
* User typing hiện đang gõ  
* User chat có file & gif ảnh 
* User upload avatar 
* User edit profile
* User tạo bình chọn
* User Tìm bạn theo tag ... 
* Notification msg read or not
* Setting (chặn tin từ người lại, hiện email, hiện thông báo)
* Giao diện mobile riêng. Theme cho ứng dụng.

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






