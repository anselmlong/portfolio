-- Convert metadata columns used by LangChain's PGVector tables to JSONB
DO $$
BEGIN
  -- langchain_pg_embedding.metadata -> jsonb
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'langchain_pg_embedding' AND column_name = 'metadata'
  ) THEN
    EXECUTE 'ALTER TABLE "langchain_pg_embedding" ALTER COLUMN "metadata" TYPE jsonb USING "metadata"::jsonb';
  END IF;

  -- langchain_pg_embedding.cmetadata -> jsonb (newer versions use cmetadata)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'langchain_pg_embedding' AND column_name = 'cmetadata'
  ) THEN
    EXECUTE 'ALTER TABLE "langchain_pg_embedding" ALTER COLUMN "cmetadata" TYPE jsonb USING "cmetadata"::jsonb';
  END IF;

  -- Optional GIN indexes for faster metadata filtering
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'langchain_pg_embedding' AND column_name = 'metadata'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS langchain_pg_embedding_metadata_gin ON "langchain_pg_embedding" USING GIN ("metadata")';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'langchain_pg_embedding' AND column_name = 'cmetadata'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS langchain_pg_embedding_cmetadata_gin ON "langchain_pg_embedding" USING GIN ("cmetadata")';
  END IF;
END $$;
