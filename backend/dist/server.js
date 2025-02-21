"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_1 = require("./middleware/error");
const ollama_routes_1 = __importDefault(require("./routes/ollama.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env.local') });
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || '0.0.0.0'; // Listen on all interfaces by default
// Middleware
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://192.168.1.4:3000', // Your local IP
    ],
    credentials: true,
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/ollama', ollama_routes_1.default);
app.use('/api/chat', chat_routes_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Error handling
app.use(error_1.errorHandler);
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});
