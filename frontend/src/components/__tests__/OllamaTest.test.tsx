import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OllamaTest } from '../OllamaTest';

// Mock UI components
jest.mock('../ui/button');
jest.mock('../ui/input');
jest.mock('../ui/card');

// Mock utils
jest.mock('../../lib/utils', () => ({
    cn: (...inputs: any[]) => inputs.filter(Boolean).join(' ')
}));

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Cleanup after each test
afterEach(() => {
    cleanup();
    mockFetch.mockClear();
});

describe('OllamaTest Component', () => {
    it('renders the initial state correctly', () => {
        expect.assertions(3);
        render(<OllamaTest />);
        
        expect(screen.getByRole('button', { name: /check connection/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /prompt/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    describe('Connection Check', () => {
        it('shows connected status when health check succeeds', async () => {
            expect.assertions(1);
            mockFetch.mockResolvedValueOnce({ ok: true });
            render(<OllamaTest />);

            const user = userEvent.setup();
            await user.click(screen.getByRole('button', { name: /check connection/i }));

            await waitFor(() => {
                expect(screen.getByText(/connected/i)).toBeInTheDocument();
            });
        });

        it('shows error status when health check fails', async () => {
            expect.assertions(1);
            mockFetch.mockResolvedValueOnce({ ok: false });
            render(<OllamaTest />);

            const user = userEvent.setup();
            await user.click(screen.getByRole('button', { name: /check connection/i }));

            await waitFor(() => {
                expect(screen.getByText(/connection error/i)).toBeInTheDocument();
            });
        });
    });

    describe('Prompt Submission', () => {
        const testPrompt = 'test prompt';
        const testResponse = 'test response';

        it('successfully sends prompt and displays response', async () => {
            expect.assertions(2);
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ response: testResponse })
            });

            render(<OllamaTest />);
            
            const user = userEvent.setup();
            const input = screen.getByRole('textbox', { name: /prompt/i });
            await user.type(input, testPrompt);
            await user.click(screen.getByRole('button', { name: /send/i }));

            await waitFor(() => {
                expect(screen.getByText(testResponse)).toBeInTheDocument();
            });

            expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: testPrompt }),
            });
        });

        it('handles empty prompt submission', async () => {
            expect.assertions(2);
            render(<OllamaTest />);
            
            const user = userEvent.setup();
            await user.click(screen.getByRole('button', { name: /send/i }));

            expect(screen.getByText(/please enter a prompt/i)).toBeInTheDocument();
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('handles API error response', async () => {
            expect.assertions(1);
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error'
            });

            render(<OllamaTest />);
            
            const user = userEvent.setup();
            const input = screen.getByRole('textbox', { name: /prompt/i });
            await user.type(input, testPrompt);
            await user.click(screen.getByRole('button', { name: /send/i }));

            await waitFor(() => {
                expect(screen.getByText(/error: failed to generate response/i)).toBeInTheDocument();
            });
        });

        it('handles network error', async () => {
            expect.assertions(1);
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            render(<OllamaTest />);
            
            const user = userEvent.setup();
            const input = screen.getByRole('textbox', { name: /prompt/i });
            await user.type(input, testPrompt);
            await user.click(screen.getByRole('button', { name: /send/i }));

            await waitFor(() => {
                expect(screen.getByText(/error: network error/i)).toBeInTheDocument();
            });
        });

        it('handles invalid response format', async () => {
            expect.assertions(1);
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ invalidKey: 'invalid response' })
            });

            render(<OllamaTest />);
            
            const user = userEvent.setup();
            const input = screen.getByRole('textbox', { name: /prompt/i });
            await user.type(input, testPrompt);
            await user.click(screen.getByRole('button', { name: /send/i }));

            await waitFor(() => {
                expect(screen.getByText(/error: invalid response format/i)).toBeInTheDocument();
            });
        });

        it('disables input and button while loading', async () => {
            expect.assertions(2);
            // Mock a slow response
            mockFetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));
            
            render(<OllamaTest />);
            
            const user = userEvent.setup();
            const input = screen.getByRole('textbox', { name: /prompt/i });
            await user.type(input, testPrompt);
            await user.click(screen.getByRole('button', { name: /send/i }));

            expect(input).toBeDisabled();
            expect(screen.getByRole('button', { name: /generating/i })).toBeDisabled();
        });
    });
});
