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
* kết bạn nhận tin kết bạn (realtime), Gửi tin nhắn 1 - 1 (realtime) 
* Người dùng tìm kiếm bạn bè (thêm thành công tạo hộp thoại)
* Người dùng thêm, sửa Reaction (realtime).
* Người dùng sửa, thu hồi Chat (realtime).
* Người dùng trích lời (reply)
* Chat nối với nhau nếu 1 người chat liên tục
* User typing hiện đang gõ  
* User tạo nhóm thêm thành viên, chat nhóm
* Giao diện mobile riêng. Theme cho ứng dụng.

### issues
* Rev Infinity scroll

#### Chức năng đang làm
* Chat option, kick, out group, (tạo bình chọn), mute user
* Activiti panel

### Chức năng Frontend sẽ có ...
* custumize conversation item
* Ngày trên chat
* wellcome khi login lần đầu
* xác thực sử dụng socket.
* Tìm user online / offline
* Ghim hộp thọai,
* User gửi otp đăng nhập
* Đăng nhập đa nền tảng, gửi mail
* User online theo thời gần nhất (lần cuối online)
* User nhắn tin khi ko kết bạn theo setting
* User chat có file & gif ảnh 
* User upload avatar 
* User edit profile
* User 
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






