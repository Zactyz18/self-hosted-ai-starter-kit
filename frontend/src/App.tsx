import { useState } from 'react';
import { DocumentUploader } from './components/DocumentUploader';
import { DocumentList } from './components/DocumentList';
import { ChatWindow } from './components/ChatWindow';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <img src="/ISW.ico" alt="Initium Softworks" className="w-8 h-8" />
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-slate-900">RAG Document Assistant</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-500">
              Upload • Chat • Analyze
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Intelligent Document Analysis
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Chat with your documents using AI-powered insights. 
            Upload files and get instant, context-aware responses from our RAG system.
          </p>
        </div>

        {/* Chat Interface - Full Width at Top */}
        <div className="mb-12">
          <ChatWindow className="h-full" />
        </div>

        {/* Two Column Layout - Upload and Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section - Left */}
          <div>
            <DocumentUploader onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* Documents List - Right */}
          <div>
            <DocumentList 
              refreshTrigger={refreshTrigger} 
              onDeleteSuccess={handleDeleteSuccess} 
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo and Description */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/ISW.ico" alt="Initium Softworks" className="w-8 h-8" />
                <h3 className="text-xl font-bold text-white">RAG Document Assistant</h3>
              </div>
              <p className="text-slate-400 max-w-md">
                Powered by cutting-edge AI technology to help you analyze, understand, and extract insights from your documents.
              </p>
            </div>

            {/* Technology */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Powered By</h4>
              <div className="flex flex-wrap gap-4 text-slate-400">
                <span>OpenAI GPT-4</span>
                <span>Qdrant Vector DB</span>
                <span>n8n</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 mt-6 pt-4">
            <p className="text-slate-400 text-sm text-center">
              &copy; 2025 Initium Softworks LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
