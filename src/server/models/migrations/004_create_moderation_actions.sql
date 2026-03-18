CREATE TABLE IF NOT EXISTS moderation_actions (
  id BIGSERIAL PRIMARY KEY,
  item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  admin_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  action_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT moderation_actions_type_check CHECK (action_type IN ('remove'))
);

CREATE INDEX IF NOT EXISTS moderation_actions_item_id_idx
  ON moderation_actions (item_id);

CREATE INDEX IF NOT EXISTS moderation_actions_admin_user_id_idx
  ON moderation_actions (admin_user_id);
