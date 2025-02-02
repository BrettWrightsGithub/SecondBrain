import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/types/chat';

interface ChatState {
  messages: Message[];
  isPrivate: boolean;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  setIsPrivate: (isPrivate: boolean) => void;
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! How can I help you today? I'm currently in public mode using OpenAI. Toggle the privacy switch to use Ollama locally.",
    role: "assistant",
    sender: "AI Assistant",
    timestamp: new Date(),
  },
];

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: initialMessages,
      isPrivate: false,
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      updateLastMessage: (content) =>
        set((state) => ({
          messages: state.messages.map((msg, idx) =>
            idx === state.messages.length - 1 ? { ...msg, content } : msg
          ),
        })),
      setMessages: (messages) => set({ messages }),
      clearMessages: () => set({ messages: initialMessages }),
      setIsPrivate: (isPrivate) => set({ isPrivate }),
    }),
    {
      name: 'chat-storage',
    }
  )
);
