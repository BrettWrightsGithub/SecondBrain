import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavSidebar } from '../nav-sidebar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/'
  })
}));

describe('NavSidebar Component', () => {
  it('renders navigation links', () => {
    render(<NavSidebar />);
    
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Base')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('highlights active link based on current route', () => {
    render(<NavSidebar />);
    
    const activeLink = screen.getByRole('link', { name: /chat/i });
    expect(activeLink).toHaveClass('bg-accent');
  });

  it('renders collapsible button', () => {
    render(<NavSidebar />);
    
    const collapseButton = screen.getByRole('button', { name: /toggle sidebar/i });
    expect(collapseButton).toBeInTheDocument();
  });

  it('collapses and expands sidebar', () => {
    render(<NavSidebar />);
    
    const sidebar = screen.getByRole('navigation');
    const collapseButton = screen.getByRole('button', { name: /toggle sidebar/i });
    
    // Initial state - expanded
    expect(sidebar).toHaveClass('w-64');
    
    // Click to collapse
    fireEvent.click(collapseButton);
    expect(sidebar).toHaveClass('w-16');
    
    // Click to expand
    fireEvent.click(collapseButton);
    expect(sidebar).toHaveClass('w-64');
  });

  it('displays tooltips for icons in collapsed state', () => {
    render(<NavSidebar />);
    
    const collapseButton = screen.getByRole('button', { name: /toggle sidebar/i });
    fireEvent.click(collapseButton); // Collapse sidebar
    
    // Hover over Chat icon
    const chatLink = screen.getByTestId('chat-link');
    fireEvent.mouseEnter(chatLink);
    
    expect(screen.getByRole('tooltip', { name: /chat/i })).toBeInTheDocument();
  });

  it('renders user section at bottom', () => {
    render(<NavSidebar />);
    
    expect(screen.getByText(/user/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /user avatar/i })).toBeInTheDocument();
  });
});
