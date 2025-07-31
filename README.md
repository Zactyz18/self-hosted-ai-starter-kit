# RAG Document Assistant

A complete self-hosted RAG (Retrieval-Augmented Generation) application that allows you to upload documents and ask intelligent questions about their content. Built with n8n for backend workflows, React for the frontend, and powered by OpenAI and Qdrant.

## Features

- **📄 Smart Document Upload**: Supports PDF, DOCX, and TXT files with automatic content extraction
- **🧠 Intelligent Chat**: Ask questions in natural language and get context-aware responses
- **🗂️ Document Management**: View, manage, and delete uploaded documents
- **🔍 Advanced RAG**: Powered by OpenAI embeddings and Qdrant vector database
- **🚀 Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **🐳 Docker Ready**: Complete containerized setup with docker-compose

## Architecture

The application consists of several components:

### Backend (n8n Workflows)
- **Document Upload & Ingestion**: Processes uploaded files, creates embeddings, and stores in vector database
- **List Documents**: Retrieves all uploaded documents with metadata
- **Delete Document**: Removes documents and all associated vector data
- **RAG Chat**: Handles chat queries with intelligent document retrieval

### Frontend (React + TypeScript)
- **Document Uploader**: Drag-and-drop interface for file uploads
- **Document List**: Displays uploaded documents with management options
- **Chat Window**: Real-time chat interface for querying documents
- **API Service**: Centralized API communication layer

### Infrastructure
- **n8n**: Workflow automation and API endpoints
- **Qdrant**: Vector database for document embeddings
- **PostgreSQL**: Metadata and workflow storage
- **OpenAI**: Text embeddings and chat completion

## Quick Start

### Prerequisites

- Docker and Docker Compose
- OpenAI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd self-hosted-ai-starter-kit
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=your-openai-api-key-here
   
   # Database Configuration
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your-secure-password
   POSTGRES_DB=n8n
   
   # n8n Configuration
   N8N_ENCRYPTION_KEY=your-encryption-key
   N8N_USER_MANAGEMENT_JWT_SECRET=your-jwt-secret
   ```

3. **Start the application**
   
   **For Production (optimized builds):**
   ```bash
   docker-compose up -d
   ```
   
   **For Development (with hot reloading):**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Access the applications**
   - **Frontend**: http://localhost:3000 - Main RAG application
   - **n8n**: http://localhost:5678 - Workflow management
   - **Qdrant**: http://localhost:6333 - Vector database dashboard

### Initial Setup

1. **Setup n8n workflows**
   - The workflows are automatically imported on first run
   - Access n8n at http://localhost:5678
   - Activate the four RAG workflows:
     - Document Upload & Ingestion
     - List Documents  
     - Delete Document
     - RAG Chat

2. **Configure credentials in n8n**
   - Add your OpenAI API key
   - Configure Qdrant connection (should work with defaults)

3. **Start using the application**
   - Go to http://localhost:3000
   - Upload your first document
   - Start asking questions!

## Usage

### Uploading Documents

1. Navigate to the main application at http://localhost:3000
2. Drag and drop files into the upload area or click to browse
3. Supported formats: PDF, DOCX, TXT (max 50MB)
4. Files are automatically processed and chunked for optimal RAG performance

### Asking Questions

1. Use the chat interface on the right side of the application
2. Ask specific questions about your uploaded documents
3. The AI will search through your documents and provide contextual answers
4. Each response shows how many documents were used for the answer

### Managing Documents

1. View all uploaded documents in the document list
2. See metadata including upload time, file type, and chunk count
3. Delete documents when no longer needed (removes all associated data)

## Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000 with hot reloading.

### Backend Development

The backend is managed through n8n workflows. To modify:

1. Access n8n at http://localhost:5678
2. Edit the existing workflows or create new ones
3. Test using the built-in n8n interface
4. Export updated workflows to `n8n/demo-data/workflows/`

### API Endpoints

The n8n workflows expose these webhook endpoints:

- `POST /webhook/upload-document` - Upload and process documents
- `GET /webhook/list-documents` - Get list of uploaded documents  
- `POST /webhook/delete-document` - Delete a document by file_id
- `POST /webhook/chat` - Send chat messages for RAG responses

## Troubleshooting

### Common Issues

1. **OpenAI API errors**: Verify your API key is correct and has sufficient credits
2. **Vector search not working**: Ensure Qdrant is running and collections are created
3. **File upload fails**: Check file size (max 50MB) and format (PDF/DOCX/TXT)
4. **n8n workflows not active**: Manually activate workflows in the n8n interface

### Logs

View logs for debugging:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs n8n
docker-compose logs frontend
docker-compose logs qdrant
```

### Reset Data

To completely reset the application:
```bash
docker-compose down -v
docker-compose up -d
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for embeddings and chat | Required |
| `POSTGRES_USER` | PostgreSQL username | postgres |
| `POSTGRES_PASSWORD` | PostgreSQL password | Required |
| `POSTGRES_DB` | PostgreSQL database name | n8n |
| `N8N_ENCRYPTION_KEY` | n8n encryption key | Required |
| `N8N_USER_MANAGEMENT_JWT_SECRET` | n8n JWT secret | Required |

### Customization

- **Frontend styling**: Edit Tailwind classes in React components
- **Workflow logic**: Modify n8n workflows through the web interface
- **Vector settings**: Adjust chunk size, overlap, and search parameters in workflows
- **UI behavior**: Customize React components in `frontend/src/components/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review n8n workflow configurations
3. Check Docker container logs
4. Open an issue with detailed information

## Acknowledgments

- Built with [n8n](https://n8n.io/) for workflow automation
- Powered by [OpenAI](https://openai.com/) for embeddings and chat
- Vector storage by [Qdrant](https://qdrant.tech/)
- Frontend built with [React](https://react.dev/) and [Tailwind CSS](https://tailwindcss.com/)
- Developed with [Vite](https://vitejs.dev/) for fast development
