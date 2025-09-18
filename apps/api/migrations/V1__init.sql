CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- 공개 고유키
    uuid UUID NOT NULL UNIQUE,
    -- Why unique: 이메일 중복 방지 및 조회
    email TEXT NOT NULL UNIQUE,
    password_hashed TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE refresh_tokens (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    -- Why unique: 중복 방지
    token TEXT NOT NULL UNIQUE,
    issued_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ
);

ALTER TABLE refresh_tokens
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);

-- Why: 리프레시 토큰 갱신
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens (token);

-- Reference: https://developer.paddle.com/api-reference/customers/overview
CREATE TABLE paddle_customers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- Why unique: user 1:1 매핑
    user_id BIGINT NOT NULL UNIQUE,
    -- Why unique: 고유 Paddle customer.id
    customer_id TEXT NOT NULL UNIQUE
);

ALTER TABLE paddle_customers
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);

CREATE INDEX idx_paddle_customers_user_id ON paddle_customers (user_id);
