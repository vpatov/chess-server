-- CREATE DATABASE IF NOT EXISTS chess_server;
DROP TABLE users;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username varchar(64) NOT NULL,
    salt CHAR(20) NOT NULL,
    hashed_password CHAR(64) NOT NULL
);

CREATE INDEX username_index ON users
(
    username
);

