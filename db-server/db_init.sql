DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username varchar(64) NOT NULL,
    salt CHAR(20) NOT NULL,
    hashed_password CHAR(64) NOT NULL
);

CREATE INDEX IF NOT EXISTS username_index ON users
(
    username
);

