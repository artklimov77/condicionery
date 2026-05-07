-- =============================================
-- Nordic Air CMS — Supabase Setup SQL
-- =============================================
-- Выполните этот скрипт в Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → вставьте → Run
-- =============================================

-- 1. Создаём таблицу контента
CREATE TABLE IF NOT EXISTS content (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  type       TEXT DEFAULT 'text',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Автообновление updated_at при каждом изменении
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 2. Включаем Row Level Security (RLS)
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- 3. Публичная политика: любой посетитель сайта может ЧИТАТЬ контент
--    (нужно для frontend cms.js)
CREATE POLICY "Public read content"
  ON content
  FOR SELECT
  USING (true);

-- 4. Авторизованные пользователи могут ПИСАТЬ (INSERT, UPDATE, DELETE)
--    Только залогиненный администратор имеет доступ через admin panel
CREATE POLICY "Auth users write content"
  ON content
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- ГОТОВО! Таблица создана.
-- Следующий шаг: создайте Storage bucket.
-- =============================================
