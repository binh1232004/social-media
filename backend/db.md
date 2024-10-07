# NOTE
1. DATE will be displayed as YYYY-MM-DD
2. FOREIGN KEY: group_id in post can be null
3. password(varchar(50)), username(nvarchar(255))  in user.
4. title(nvarchar(255)) in group 
# SCHEMA
Bảng user:
    id (INT, primary key): ID của người dùng. Đặt tự động tăng cao

    given_name (NVARCHAR)

    surname (NVARCHAR)

    password (VARCHAR): Mật khẩu người dùng (nên mã hóa).

    birthday (DATE): Ngày sinh của người dùng.

    role (ENUM): Vai trò của người dùng trong nhóm (có thể là 'admin', 'member'). 

    email (VARCHAR, unique): Email của người dùng, phải duy nhất.

    gender (ENUM): Giới tính của người dùng (có thể là 'male', 'female').

    created_at (TIMESTAMP): Thời gian tạo tài khoản. Đặt tự động

    profile_image_url (VARCHAR): Đường dẫn đến ảnh đại diện của người dùng. Có thể null được

    biography (TEXT): Mô tả ngắn gọn về người dùng. Có thể null được

Bảng group:
	id (INT, primary key): ID của nhóm.
    
    created_at (TIMESTAMP): Thời gian tạo nhóm.
    
    title (VARCHAR): Tên nhóm.
    
    description (TEXT): Mô tả về nhóm.
    
    regulation (TEXT): Quy định của nhóm (nếu có).

    mode (ENUM): Loại nhóm (public, private).

    group_image_url (VARCHAR): Đường dẫn đến ảnh đại diện của nhóm.

Bảng user_chat_group (Group [ n-n ] User): Nhắn tin

    group_id (INT, foreign key, references group(id)): ID của nhóm.

    user_id (INT, foreign key, references user(id)): ID của người gửi.

    message (TEXT): Nội dung tin nhắn.

    created_at (TIMESTAMP): Thời gian gửi tin nhắn.

Bảng group_has_user (Group (n-n) User): Thành viên nhóm

	user_id (INT, foreign key, references Users(id)): ID của người dùng.

    group_id (INT, foreign key, references Groups(id)): ID của nhóm.

    role (ENUM): Vai trò của người dùng trong nhóm (có thể là 'admin', 'member').

Bảng user_chat_user (User [ n-n ] User): Nhắn tin

    sender_id (INT, foreign key, references user(id)): ID của người gửi.

    receiver_id (INT, foreign key, references user(id)): ID của người nhận.

    message (TEXT): Nội dung tin nhắn.

    created_at (TIMESTAMP): Thời gian gửi tin nhắn.
Bảng post:
    id (INT, primary key): ID của bài đăng.

    created_at (TIMESTAMP): Thời gian tạo bài đăng.

    user_id (INT, foreign key, references user(id)): ID của người dùng tạo bài đăng.

    group_id (INT, foreign key, references group(id)): ID của nhóm. 

    description (TEXT): Tiêu đề của bài đăng.

    upvote (INT): Số lượt thích cho bài đăng.

    downvote (INT): Số lượt không thích cho bài đăng.

    mode (ENUM): Loại bài đăng (public, private).
Bảng image:
    post_id (INT, foreign key, references post(id)): ID của bài đăng. 
    post_image_url (VARCHAR)
Bảng comment:
    id (INT, primary key): ID của bình luận.

    post_id (INT, foreign key, references post(id)): ID của bài đăng.

    post_user_id (INT, foreign key, references post(user_id)): ID của người dùng bình luận.

    post_group_id (INT, foreign key, references post(group_id)): ID của nhóm bình luận.

    body (TEXT): Nội dung bình luận.

    created_at (TIMESTAMP): Thời gian tạo bình luận.

Bảng comment_has_comment:

    parent_comment_id (INT, khóa ngoại, tham chiếu comment(id))

    child_comment_id (INT, khóa ngoại, tham chiếu comment(id)) 


