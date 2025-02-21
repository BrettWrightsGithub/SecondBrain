"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const ollama_routes_1 = __importDefault(require("./routes/ollama.routes"));
const error_1 = require("./middleware/error");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/chat', chat_routes_1.default);
app.use('/api/ollama', ollama_routes_1.default);
app.use(error_1.errorHandler);
