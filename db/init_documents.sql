-- Document management database schema
-- This file initializes the PostgreSQL database with tables for document tracking

-- Create documents table to track uploaded files
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    file_id VARCHAR(64) UNIQUE NOT NULL,           -- SHA256 hash from your workflow
    file_name VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,                -- pdf, docx, txt
    file_size INTEGER NOT NULL,                    -- File size in bytes
    file_path VARCHAR(1000) NOT NULL,              -- Local file storage path
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processing_status VARCHAR(50) DEFAULT 'uploaded', -- uploaded, processing, completed, failed
    chunks_created INTEGER DEFAULT 0,              -- Number of chunks created
    vector_count INTEGER DEFAULT 0,                -- Number of vectors stored in Qdrant
    error_message TEXT,                            -- Store any processing errors
    metadata JSONB,                                -- Additional metadata as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_file_id ON documents(file_id);
CREATE INDEX IF NOT EXISTS idx_documents_upload_time ON documents(upload_time);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(processing_status);

-- Create document_chunks table to track individual chunks
CREATE TABLE IF NOT EXISTS document_chunks (
    id SERIAL PRIMARY KEY,
    file_id VARCHAR(64) NOT NULL,                  -- References documents.file_id
    chunk_index INTEGER NOT NULL,                  -- Order of chunk in document
    chunk_text TEXT NOT NULL,                      -- The actual chunk content
    chunk_context TEXT,                            -- Context from your LLM processing
    qdrant_point_id VARCHAR(100),                  -- Qdrant point ID for this chunk
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES documents(file_id) ON DELETE CASCADE
);

-- Create indexes for chunks
CREATE INDEX IF NOT EXISTS idx_chunks_file_id ON document_chunks(file_id);
CREATE INDEX IF NOT EXISTS idx_chunks_index ON document_chunks(chunk_index);

-- Create upload_sessions table to track upload progress
CREATE TABLE IF NOT EXISTS upload_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    file_id VARCHAR(64),                           -- Links to documents.file_id
    status VARCHAR(50) DEFAULT 'started',          -- started, uploading, processing, completed, failed
    progress_percentage INTEGER DEFAULT 0,
    current_step VARCHAR(100),                     -- Current processing step
    total_steps INTEGER DEFAULT 0,
    error_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_modtime 
    BEFORE UPDATE ON documents 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_upload_sessions_modtime 
    BEFORE UPDATE ON upload_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Insert initial data or sample records if needed
-- (Uncomment below if you want sample data)
/*
INSERT INTO documents (file_id, file_name, file_type, file_size, file_path, processing_status) VALUES 
('sample123', 'example.pdf', 'pdf', 1024000, '/uploads/example.pdf', 'completed')
ON CONFLICT (file_id) DO NOTHING;
*/

-- Grant permissions to n8n user
GRANT ALL PRIVILEGES ON TABLE documents TO pdfai;
GRANT ALL PRIVILEGES ON TABLE document_chunks TO pdfai;
GRANT ALL PRIVILEGES ON TABLE upload_sessions TO pdfai;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO pdfai; 