// API Service Layer for RAG Document Management
// This handles all communication with n8n webhooks

interface Document {
  id: number;
  file_id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploadTime: string;
  lastUpdated: string;
  processingStatus: 'uploaded' | 'processing' | 'vectorizing' | 'completed' | 'failed' | 'vector_mismatch';
  statusDetails: string;
  chunksCreated: number;
  actualChunkCount: number;
  vectorCount: number;
  vectorsInQdrant: number;
  progressPercentage: number;
  isProcessing: boolean;
  isCompleted: boolean;
  hasFailed: boolean;
  hasVectorMismatch: boolean;
  canBeProcessed: boolean;
}

interface ChatMessage {
  success: boolean;
  message: string;
  meta: {
    documentsUsed: number;
    hasContext: boolean;
  };
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: any;
}

// Configuration - these will be the n8n webhook URLs
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/n8n/webhook';

const API_ENDPOINTS = {
  uploadDocument: `${API_BASE_URL}/upload-document`,
  processDocument: `${API_BASE_URL}/process-document`,
  documentStatus: `${API_BASE_URL}/document-status`,
  deleteDocument: `${API_BASE_URL}/delete-document`,
  chat: `${API_BASE_URL}/chat`,
};

// Upload a document (saves to local storage, returns immediately)
export const uploadDocument = async (file: File): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('data', file); // n8n expects 'data' field for $binary.data access

    const response = await fetch(API_ENDPOINTS.uploadDocument, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Processing happens automatically via scheduled n8n workflow
    // No need to manually trigger processing
    
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

// Note: Document processing happens automatically via n8n scheduled workflow
// No manual processing endpoint needed

// Get list of uploaded documents with processing status
export const getDocuments = async (): Promise<ApiResponse<Document[]>> => {
  try {
    const response = await fetch(API_ENDPOINTS.documentStatus, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();
    
    // Transform n8n response format to match frontend expectations
    const documents = Array.isArray(rawData) ? rawData : [];
    
    return {
      success: true,
      data: documents.map(doc => ({
        id: doc.id,
        file_id: doc.file_id,
        fileName: doc.file_name,
        fileType: doc.file_type,
        fileSize: doc.file_size,
        filePath: doc.file_path,
        uploadTime: doc.upload_time,
        lastUpdated: doc.updated_at,
        processingStatus: doc.processing_status || 'uploaded',
        statusDetails: doc.error_message || '',
        chunksCreated: doc.chunks_created || 0,
        actualChunkCount: doc.chunks_created || 0,
        vectorCount: doc.vector_count || 0,
        vectorsInQdrant: doc.vector_count || 0,
        progressPercentage: doc.processing_status === 'completed' ? 100 : 
                            doc.processing_status === 'processing' ? 50 : 0,
        isProcessing: doc.processing_status === 'processing',
        isCompleted: doc.processing_status === 'completed',
        hasFailed: doc.processing_status === 'failed',
        hasVectorMismatch: false,
        canBeProcessed: doc.processing_status === 'uploaded'
      }))
    };
  } catch (error) {
    console.error('Get documents error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch documents',
      data: [],
    };
  }
};

// Delete a document by file_id
export const deleteDocument = async (file_id: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.deleteDocument, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
};

// Send a chat message and get RAG response
export const sendMessage = async (message: string): Promise<ChatMessage> => {
  try {
    const response = await fetch(API_ENDPOINTS.chat, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Chat error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Chat failed',
      meta: {
        documentsUsed: 0,
        hasContext: false,
      },
    };
  }
};

// Export types for use in components
export type { Document, ChatMessage, ApiResponse }; 