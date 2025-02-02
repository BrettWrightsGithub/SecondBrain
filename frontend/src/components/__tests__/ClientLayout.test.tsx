import React from 'react';
import { render, screen } from '@testing-library/react';
import { ClientLayout } from '../ClientLayout';

// Mock child components
jest.mock('@/components/chat/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

jest.mock('@/components/navigation/nav-sidebar', () => ({
  NavSidebar: () => <div data-testid="mock-sidebar">Sidebar</div>
}));

jest.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="mock-toaster">Toaster</div>
}));

describe('ClientLayout', () => {
  it('renders all layout components', () => {
    render(
      <ClientLayout>
        <div>Test Content</div>
      </ClientLayout>
    );

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-toaster')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <ClientLayout>
        <div>Test Content</div>
      </ClientLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies correct base styling', () => {
    render(
      <ClientLayout>
        <div>Test Content</div>
      </ClientLayout>
    );

    const container = screen.getByText('Test Content').closest('div');
    expect(container).toHaveClass('min-h-screen', 'bg-background', 'font-sans', 'antialiased');
  });

  it('wraps content in ThemeProvider', () => {
    render(
      <ClientLayout>
        <div>Test Content</div>
      </ClientLayout>
    );

    // Check if theme provider attributes are present
    const html = document.documentElement;
    expect(html).toHaveAttribute('class', expect.stringContaining('light'));
  });
});
