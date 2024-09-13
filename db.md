Bảng Users:
    id (INT, primary key): ID của người dùng.

    username (VARCHAR, unique): Tên người dùng, phải duy nhất.

    password (VARCHAR): Mật khẩu người dùng (nên mã hóa).

    address (VARCHAR): Địa chỉ người dùng.

    birthday (DATE): Ngày sinh của người dùng.

    is_admin (BOOLEAN): Xác định xem người dùng có phải là quản trị viên hay không.

    email (VARCHAR, unique): Email của người dùng, phải duy nhất.

    gender (ENUM): Giới tính của người dùng (có thể là 'Nam', 'Nữ', 'Khác').

    created_at (TIMESTAMP): Thời gian tạo tài khoản.

    profile_image_url (VARCHAR): Đường dẫn đến ảnh đại diện của người dùng.

    biography (TEXT): Mô tả ngắn gọn về người dùng.

Bảng Groups:
	id (INT, primary key): ID của nhóm.
    
    created_at (TIMESTAMP): Thời gian tạo nhóm.
    
    title (VARCHAR): Tên nhóm.
    
    description (TEXT): Mô tả về nhóm.
    
    regulation (TEXT): Quy định của nhóm (nếu có).

    mode (ENUM): Loại nhóm (public, private).

    group_picture_url (VARCHAR): Đường dẫn đến ảnh đại diện của nhóm.

Bảng Group_Message (Group [ n-n ] User): Nhắn tin

    id (INT, primary key): ID của tin nhắn nhóm.

    group_id (INT, foreign key, references Groups(id)): ID của nhóm.

    user_id (INT, foreign key, references Users(id)): ID của người gửi.

    content (TEXT): Nội dung tin nhắn.

    created_at (TIMESTAMP): Thời gian gửi tin nhắn.

Bảng Group_User (Group (n-n) User): Thành viên nhóm

    id (INT, primary key): ID của bảng.
	user_id (INT, foreign key, references Users(id)): ID của người dùng.

    group_id (INT, foreign key, references Groups(id)): ID của nhóm.

    role (ENUM): Vai trò của người dùng trong nhóm (có thể là 'Admin', 'Member').

Bảng Message (User [ n-n ] User): Nhắn tin

    id (INT, primary key): ID của tin nhắn.

    sender_id (INT, foreign key, references Users(id)): ID của người gửi.

    receiver_id (INT, foreign key, references Users(id)): ID của người nhận.

    content (TEXT): Nội dung tin nhắn.

    created_at (TIMESTAMP): Thời gian gửi tin nhắn.
Bảng Post:
    id (INT, primary key): ID của bài đăng.

    created_at (TIMESTAMP): Thời gian tạo bài đăng.

    user_id (INT, foreign key, references Users(id)): ID của người dùng tạo bài đăng.

    group_id (INT, foreign key, references Groups(id)): ID của nhóm. //NULL

    title (VARCHAR): Tiêu đề của bài đăng.

    content (TEXT): Nội dung của bài đăng.

    post_images_url (VARCHAR): Đường dẫn đến ảnh hoặc video (có thể lưu nhiều ảnh dưới dạng chuỗi JSON).

    upvote (INT): Số lượt thích cho bài đăng.

    downvote (INT): Số lượt không thích cho bài đăng.

    mode (ENUM): Loại bài đăng (public, private).
Bảng Comments:

    id (INT, primary key): ID của bình luận.

    post_id (INT, foreign key, references Posts(id)): ID của bài đăng.

    user_id (INT, foreign key, references Users(id)): ID của người dùng bình luận.

    content (TEXT): Nội dung bình luận.

    created_at (TIMESTAMP): Thời gian tạo bình luận.

Bảng Comment_Relationships://RECURSIVE QUERY

    id (INT, khóa chính)

    parent_comment_id (INT, khóa ngoại, tham chiếu Comments(id))

    child_comment_id (INT, khóa ngoại, tham chiếu Comments(id)) 

Bảng Followers:

    follower_id (INT, foreign key, references Users(id)): ID của người theo dõi.

    following_id (INT, foreign key, references Users(id)): ID của người được theo dõi.
