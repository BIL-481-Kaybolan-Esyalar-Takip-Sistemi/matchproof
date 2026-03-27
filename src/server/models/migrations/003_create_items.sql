CREATE TABLE IF NOT EXISTS items (
  id BIGSERIAL PRIMARY KEY,
  owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type VARCHAR(10) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(150) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  image_path TEXT,
  is_private BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT items_type_check CHECK (item_type IN ('lost', 'found')),
  CONSTRAINT items_status_check CHECK (status IN ('open', 'claimed', 'resolved', 'removed'))
);

CREATE INDEX IF NOT EXISTS items_owner_id_idx
  ON items (owner_id);

CREATE INDEX IF NOT EXISTS items_category_idx
  ON items (category);

CREATE INDEX IF NOT EXISTS items_status_idx
  ON items (status);
