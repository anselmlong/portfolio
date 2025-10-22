-- Convert metadata column to JSONB and add a GIN index for efficient querying
ALTER TABLE "Document"
  ALTER COLUMN "metadata" TYPE jsonb USING "metadata"::jsonb;

-- Optional but recommended: create a GIN index for JSONB metadata filtering
CREATE INDEX IF NOT EXISTS document_metadata_gin ON "Document" USING GIN ("metadata");
