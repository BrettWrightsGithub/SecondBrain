import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPage from '../page';
import { Message, LogEntry } from '@/types/chat';

// Mock fetch
global.fetch = jest.fn();

describe('ChatPage', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders initial message and components', () => {
    render(<ChatPage />);
    
    // Check for initial message
    expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
    
    // Check for chat input
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('handles sending a message', async () => {
    const mockResponse: Message = {
      id: '2',
      content: 'I am here to help!',
      role: 'assistant',
      timestamp: new Date(),
    };

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: mockResponse.content }),
      })
    );

    render(<ChatPage />);
    
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    
    // Check if user message appears
    expect(screen.getByText('Hello')).toBeInTheDocument();
    
    // Wait for assistant response
    await waitFor(() => {
      expect(screen.getByText('I am here to help!')).toBeInTheDocument();
    });
  });

  it('handles error during message sending', async () => {
    const errorMessage = 'Network error';
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage))
    );

    render(<ChatPage />);
    
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    
    // Check if error appears in logs
    await waitFor(() => {
      const errorLog = screen.getByText(`Error: ${errorMessage}`);
      expect(errorLog).toBeInTheDocument();
    });
  });

  it('disables input while streaming', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Response' }),
      }), 100))
    );

    render(<ChatPage />);
    
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    
    // Input should be disabled while streaming
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
    
    // Wait for response
    await waitFor(() => {
      expect(input).not.toBeDisabled();
      expect(sendButton).not.toBeDisabled();
    });
  });

  it('updates logs when receiving server logs', async () => {
    const serverLogs: LogEntry[] = [
      {
        timestamp: new Date(),
        message: 'Processing request',
        type: 'info',
      },
      {
        timestamp: new Date(),
        message: 'Thinking...',
        type: 'thinking',
      },
    ];

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          message: 'Response',
          logs: serverLogs,
        }),
      })
    );

    render(<ChatPage />);
    
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    
    // Check if server logs appear
    await waitFor(() => {
      expect(screen.getByText('Processing request')).toBeInTheDocument();
      expect(screen.getByText('Thinking...')).toBeInTheDocument();
    });
  });
});
