# SQLite Design

目标：定义本地离线能力需要的数据模型，支持定位采样、用户历史、调试查看、上传重试。

## 命名映射（旧 -> 新）
- `location_samples` -> `gps_points`
- `timeline_events` -> `user_history`
- `sync_queue` -> `upload_tasks`
- `app_kv` -> `app_state`

## 设计原则
1. 原始定位数据、历史展示数据、上传任务、运行状态分层存储。
2. 所有记录带 UTC 毫秒时间戳，便于排障与回放。
3. 高频查询字段必须建索引。
4. Debug 友好：关键链路都可被查询和打印。

## 表 1：`gps_points`
用途：保存原始定位点（source of truth）。

```sql
CREATE TABLE IF NOT EXISTS gps_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  accuracy REAL,
  altitude REAL,
  heading REAL,
  speed REAL,
  provider TEXT NOT NULL DEFAULT 'gps', -- gps | network | mock
  sample_level TEXT NOT NULL,           -- low | medium | high
  is_mock INTEGER NOT NULL DEFAULT 0,   -- 0/1
  captured_at INTEGER NOT NULL,         -- UTC ms
  created_at INTEGER NOT NULL           -- UTC ms
);
```

建议索引：
```sql
CREATE INDEX IF NOT EXISTS idx_gps_points_captured_at
ON gps_points(captured_at DESC);

CREATE INDEX IF NOT EXISTS idx_gps_points_user_time
ON gps_points(user_id, captured_at DESC);
```

## 表 2：`user_history`
用途：保存用户可读历史记录（由 `gps_points` 聚合而来，用于历史页展示）。

```sql
CREATE TABLE IF NOT EXISTS user_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  history_type TEXT NOT NULL,         -- move | stay | arrive | leave
  title TEXT,
  subtitle TEXT,
  start_lat REAL,
  start_lng REAL,
  end_lat REAL,
  end_lng REAL,
  started_at INTEGER NOT NULL,        -- UTC ms
  ended_at INTEGER,                   -- UTC ms
  distance_m REAL,
  duration_ms INTEGER,
  source_ids TEXT,                    -- JSON array: [gps_point_id...]
  meta TEXT,                          -- JSON string
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

建议索引：
```sql
CREATE INDEX IF NOT EXISTS idx_user_history_user_time
ON user_history(user_id, started_at DESC);
```

## 表 3：`upload_tasks`
用途：待上传任务队列，支持失败重试和退避。

```sql
CREATE TABLE IF NOT EXISTS upload_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_type TEXT NOT NULL,               -- gps_point | history_event | heartbeat
  ref_table TEXT,                        -- gps_points | user_history
  ref_id INTEGER,                        -- 对应本地记录 id
  payload TEXT NOT NULL,                 -- JSON string
  status TEXT NOT NULL DEFAULT 'pending',-- pending | sending | failed | done
  retry_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at INTEGER,
  last_error TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

建议索引：
```sql
CREATE INDEX IF NOT EXISTS idx_upload_tasks_status_retry
ON upload_tasks(status, next_retry_at);
```

## 表 4：`app_state`
用途：轻量运行状态与配置缓存（本地 kv）。

```sql
CREATE TABLE IF NOT EXISTS app_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
```

推荐 key：
- `last_sync_success_at`
- `current_sampling_level`
- `last_uploaded_gps_point_id`
- `mock_mode_enabled`
- `debug_panel_enabled`

## 状态流转建议
1. 采样成功 -> 写入 `gps_points`
2. 聚合任务 -> 生成/更新 `user_history`
3. 同时生成上报任务 -> 写入 `upload_tasks(pending)`
4. 上传任务执行 -> pending -> sending -> done/failed
5. 失败按 `retry_count` + `next_retry_at` 重试
6. 同步进度/档位状态写入 `app_state`

## 调试建议
- 每次入库与出队打印结构化日志（仅 dev）。
- 在 Me 页提供：
  - 最近 50 条 `gps_points`
  - 最近 20 条 `user_history`
  - `upload_tasks` 各状态计数
  - 一键清理测试数据（仅 dev）
