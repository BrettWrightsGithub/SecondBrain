import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OllamaSettings } from '../OllamaSettings';
import { ollamaApi } from '../../../api/ollama';

// Mock the ollamaApi
jest.mock('../../../api/ollama', () => ({
    ollamaApi: {
        getModels: jest.fn(),
        getSettings: jest.fn(),
        getHealth: jest.fn(),
        updateSettings: jest.fn(),
    },
}));

describe('OllamaSettings', () => {
    const mockModels = [
        { name: 'model1', size: 1000 },
        { name: 'model2', size: 2000 },
    ];

    const mockSettings = {
        selectedModel: 'model1',
        baseUrl: 'http://localhost:11434',
    };

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Setup default mock implementations
        (ollamaApi.getModels as jest.Mock).mockResolvedValue(mockModels);
        (ollamaApi.getSettings as jest.Mock).mockResolvedValue(mockSettings);
        (ollamaApi.getHealth as jest.Mock).mockResolvedValue(true);
    });

    it('loads and displays settings correctly', async () => {
        render(<OllamaSettings />);

        // Check loading state
        expect(screen.getByText('Loading settings...')).toBeInTheDocument();

        // Wait for data to load
        await waitFor(() => {
            expect(screen.queryByText('Loading settings...')).not.toBeInTheDocument();
        });

        // Check if base URL input is populated
        const baseUrlInput = screen.getByLabelText('Base URL') as HTMLInputElement;
        expect(baseUrlInput.value).toBe(mockSettings.baseUrl);

        // Check if model select is populated
        const modelSelect = screen.getByRole('combobox');
        expect(modelSelect).toHaveTextContent(mockSettings.selectedModel);
    });

    it('handles API errors gracefully', async () => {
        // Mock API error
        (ollamaApi.getModels as jest.Mock).mockRejectedValue(new Error('API Error'));

        render(<OllamaSettings />);

        await waitFor(() => {
            expect(screen.getByText('Failed to load settings')).toBeInTheDocument();
        });
    });

    it('saves settings successfully', async () => {
        (ollamaApi.updateSettings as jest.Mock).mockResolvedValue(undefined);

        render(<OllamaSettings />);

        // Wait for initial load
        await waitFor(() => {
            expect(screen.queryByText('Loading settings...')).not.toBeInTheDocument();
        });

        // Update base URL
        const baseUrlInput = screen.getByLabelText('Base URL');
        await userEvent.clear(baseUrlInput);
        await userEvent.type(baseUrlInput, 'http://new-url:11434');

        // Click save button
        const saveButton = screen.getByText('Save Changes');
        await userEvent.click(saveButton);

        // Verify success message
        await waitFor(() => {
            expect(screen.getByText('Settings saved successfully')).toBeInTheDocument();
        });

        // Verify API was called with correct data
        expect(ollamaApi.updateSettings).toHaveBeenCalledWith(expect.objectContaining({
            baseUrl: 'http://new-url:11434',
        }));
    });

    it('handles save errors gracefully', async () => {
        // Mock save error
        (ollamaApi.updateSettings as jest.Mock).mockRejectedValue(new Error('Save Error'));

        render(<OllamaSettings />);

        // Wait for initial load
        await waitFor(() => {
            expect(screen.queryByText('Loading settings...')).not.toBeInTheDocument();
        });

        // Click save button
        const saveButton = screen.getByText('Save Changes');
        await userEvent.click(saveButton);

        // Verify error message
        await waitFor(() => {
            expect(screen.getByText('Failed to save settings')).toBeInTheDocument();
        });
    });

    it('disables save button while loading or saving', async () => {
        render(<OllamaSettings />);

        // Check button is disabled during initial load
        const saveButton = screen.getByText('Save Changes');
        expect(saveButton).toBeDisabled();

        // Wait for load to complete
        await waitFor(() => {
            expect(screen.queryByText('Loading settings...')).not.toBeInTheDocument();
        });

        // Check button is enabled after load
        expect(saveButton).toBeEnabled();

        // Click save and check button is disabled during save
        await userEvent.click(saveButton);
        expect(saveButton).toBeDisabled();
    });
});
