CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(btrim(title)) > 0 AND char_length(title) <= 80),
  author TEXT NOT NULL CHECK (char_length(btrim(author)) > 0 AND char_length(author) <= 60),
  pages INTEGER NOT NULL CHECK (pages >= 1 AND pages <= 5000),
  status TEXT NOT NULL DEFAULT 'To Read' CHECK (status IN ('To Read', 'Reading', 'Finished')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_books_user_created_at
  ON public.books (user_id, created_at DESC);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own books" ON public.books;
DROP POLICY IF EXISTS "Users can insert their own books" ON public.books;
DROP POLICY IF EXISTS "Users can update their own books" ON public.books;
DROP POLICY IF EXISTS "Users can delete their own books" ON public.books;

CREATE POLICY "Users can view their own books"
  ON public.books
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own books"
  ON public.books
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books"
  ON public.books
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books"
  ON public.books
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

