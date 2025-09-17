CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- id 대신 외부 노출용
    uuid UUID NOT NULL UNIQUE,
    -- UNIQUE: 이메일 중복 검사
    -- GET /api/users/check-email
    email TEXT NOT NULL UNIQUE,
    password_hashed TEXT NOT NULL
);

-- 회원가입
-- POST /api/users/signup { email, password }
-- 로그인
-- POST /api/users/signin { email, password }
CREATE INDEX idx_users_email_password_hashed ON users (email, password_hashed);

CREATE TABLE refresh_tokens (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    -- UNIQUE: 생성 및 갱신시 중복 검사
    token TEXT NOT NULL UNIQUE,
    issued_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ
);

ALTER TABLE refresh_tokens
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);

-- 리프레시 토큰 갱신
-- POST /api/refresh-tokens/refresh { refreshToken }
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens (token);

CREATE TABLE paddle_customers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- UNIQUE: user 1:1 매핑
    user_id BIGINT NOT NULL UNIQUE,
    -- UNIQUE: Paddle customer_id
    customer_id TEXT NOT NULL UNIQUE
);

ALTER TABLE paddle_customers
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);

CREATE INDEX idx_paddle_customers_user_id ON paddle_customers (user_id);
