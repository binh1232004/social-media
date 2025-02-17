CREATE DATABASEE media;
use media;
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    given_name NVARCHAR(255),
    surname NVARCHAR(255),
    password VARCHAR(255), 
    birthday DATE,
    role ENUM('admin', 'member'),
    email VARCHAR(255) UNIQUE,
    gender ENUM('male', 'female'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_image_url VARCHAR(255),
    biography TEXT
);