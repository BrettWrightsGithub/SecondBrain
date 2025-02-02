import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../theme-provider';

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div>Test Content</div>
      </ThemeProvider>
    );
    
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('applies theme attributes to html element', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <div>Test Content</div>
      </ThemeProvider>
    );
    
    // Check if the html element has the data-theme attribute
    const html = document.documentElement;
    expect(html).toHaveAttribute('class', expect.stringContaining('dark'));
  });

  it('handles system theme preference', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div>Test Content</div>
      </ThemeProvider>
    );
    
    const html = document.documentElement;
    expect(html).toHaveAttribute('class', expect.stringContaining('system'));
  });
});
