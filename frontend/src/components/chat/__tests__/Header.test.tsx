import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';

describe('Header Component', () => {
  it('renders the header with title', () => {
    render(<Header />);
    expect(screen.getByText('SecondBrain')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(<Header />);
    const themeButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeButton).toBeInTheDocument();
  });

  it('renders settings button', () => {
    render(<Header />);
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    expect(settingsButton).toBeInTheDocument();
  });

  it('opens settings dialog when settings button is clicked', () => {
    render(<Header />);
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  it('renders user avatar', () => {
    render(<Header />);
    const avatar = screen.getByRole('img', { name: /user avatar/i });
    expect(avatar).toBeInTheDocument();
  });

  it('renders navigation menu button on mobile', () => {
    // Mock window.innerWidth
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
    expect(menuButton).toBeInTheDocument();
  });
});
