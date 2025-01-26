# SecondBrain

SecondBrain is your AI-powered knowledge assistant that helps you organize, search, and interact with your personal knowledge base using natural language.

## Features

- 🧠 Natural language interaction with your knowledge base
- 📝 Document processing and semantic search
- 🤖 Multiple AI model support (OpenAI, Anthropic, Ollama)
- 🔍 Advanced search capabilities
- 📱 Modern, responsive UI
- 🌙 Dark mode support

## Prerequisites

- Node.js 18+
- npm 8+
- Ollama (optional, for local AI models)

## Project Structure

```
SecondBrain/
├── frontend/          # Next.js frontend application
├── backend/           # Backend API server
└── scripts/          # Utility scripts
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/second-brain.git
cd second-brain
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# In frontend/.env.local
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your API keys

# In backend/.env
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

4. Start the development servers:

```bash
# Start everything (frontend, backend, and Ollama if installed)
npm run dev:all

# Or start individual components:
npm run dev:frontend    # Start frontend only
npm run dev:backend     # Start backend only
npm run ollama:start    # Start Ollama server
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Ollama Integration

SecondBrain supports local AI models through Ollama. To use Ollama:

1. Install Ollama:
```bash
curl https://ollama.ai/install.sh | sh
```

2. Start Ollama and pull required models:
```bash
npm run ollama:start
```

3. Check Ollama status:
```bash
npm run ollama:status
```

Available Ollama commands:
- `npm run ollama:start` - Start Ollama and pull required models
- `npm run ollama:stop` - Stop Ollama
- `npm run ollama:restart` - Restart Ollama
- `npm run ollama:status` - Check Ollama status and list models

## Development

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start the production server
- `npm run lint` - Run linting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
