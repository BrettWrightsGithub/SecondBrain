"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OLLAMA_BASE_URL = void 0;
// Remove trailing slash to prevent double slashes in URLs
exports.OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
