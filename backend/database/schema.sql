CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  position VARCHAR(150) NOT NULL,
  department VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS kpis (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  score NUMERIC(5, 2) NOT NULL CHECK (score >= 0 AND score <= 100),
  review TEXT NOT NULL,
  CONSTRAINT fk_kpis_employee
    FOREIGN KEY (employee_id)
    REFERENCES employees (id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  sender VARCHAR(50) NOT NULL DEFAULT 'user',
  text TEXT NOT NULL,
  user_id INTEGER,
  user_name VARCHAR(150) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_kpis_employee_id ON kpis (employee_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages (created_at);
