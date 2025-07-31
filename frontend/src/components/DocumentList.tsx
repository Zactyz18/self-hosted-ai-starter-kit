import React, { useState, useEffect } from 'react';
import { getDocuments, deleteDocument, type Document } from '../services/api';

interface DocumentListProps {
  refreshTrigger: number;
  onDeleteSuccess: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ refreshTrigger, onDeleteSuccess }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await getDocuments();
      
      if (result.success && result.data) {
        setDocuments(result.data);
      } else {
        setError(result.error || 'Failed to fetch documents');
        setDocuments([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (file_id: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(file_id);
    
    try {
      const result = await deleteDocument(file_id);
      
      if (result.success) {
        // Remove the document from the local state
        setDocuments(prev => prev.filter(doc => doc.file_id !== file_id));
        onDeleteSuccess();
      } else {
        alert(`Failed to delete document: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Failed to delete document: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'vectorizing': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'vector_mismatch': return 'text-purple-600 bg-purple-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'uploaded': return 'Uploaded';
      case 'processing': return 'Processing';
      case 'vectorizing': return 'Vectorizing';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
      case 'vector_mismatch': return 'Vector Mismatch';
      default: return status;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 18h12V6l-4-4H4v16zm8-14l2 2h-2V4z"/>
        </svg>
      );
    } else if (fileType.includes('text')) {
      return (
        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4h12v12H4V4zm2 2v8h8V6H6z"/>
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4h12v12H4V4zm2 2v8h8V6H6z"/>
        </svg>
      );
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-[#4EACFA] border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-slate-600">Loading documents...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Error Loading Documents</h3>
            <p className="text-slate-500 mb-4">{error}</p>
            <button
              onClick={fetchDocuments}
              className="px-4 py-2 bg-[#4EACFA] text-white rounded-md hover:bg-[#3A9BF0] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Uploaded Documents</h2>
          <button
            onClick={fetchDocuments}
            className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
          >
            Refresh
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No documents uploaded</h3>
            <p className="text-slate-500">Upload your first document to get started with RAG queries.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.file_id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {getFileIcon(doc.fileType)}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-900 truncate">
                      {doc.fileName}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-slate-500">
                      <span>{formatDate(doc.uploadTime)}</span>
                      <span>•</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>•</span>
                      <span>{doc.chunksCreated} chunks</span>
                      <span>•</span>
                      <span className="capitalize">
                        {doc.fileType.split('/')[1]?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.processingStatus)}`}>
                        {formatStatus(doc.processingStatus)}
                      </span>
                      {doc.isProcessing && (
                        <div className="w-4 h-4 border-2 border-[#4EACFA] border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {doc.progressPercentage > 0 && (
                        <span className="text-xs text-slate-500">
                          {doc.progressPercentage}%
                        </span>
                      )}
                    </div>
                    {doc.statusDetails && (
                      <div className="mt-1 text-xs text-slate-400">
                        {doc.statusDetails}
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(doc.file_id, doc.fileName)}
                  disabled={deletingId === doc.file_id}
                  className={`
                    p-2 rounded-md transition-colors
                    ${deletingId === doc.file_id
                      ? 'bg-slate-100 cursor-not-allowed'
                      : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                    }
                  `}
                  title="Delete document"
                >
                  {deletingId === doc.file_id ? (
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {documents.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200 text-sm text-slate-500 text-center">
            {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded • {' '}
            {documents.reduce((sum, doc) => sum + doc.chunksCreated, 0)} total chunks • {' '}
            {documents.reduce((sum, doc) => sum + doc.vectorCount, 0)} vectors
          </div>
        )}
      </div>
    </div>
  );
}; 