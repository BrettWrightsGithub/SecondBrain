import React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from '../avatar';

describe('Avatar Component', () => {
  it('renders avatar with image successfully', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    
    const img = screen.getByAltText('User avatar');
    expect(img).toBeInTheDocument();
  });

  it('shows fallback when image fails to load', () => {
    render(
      <Avatar>
        <AvatarImage src="invalid-url.jpg" alt="Invalid avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    
    const fallback = screen.getByText('JD');
    const img = screen.getByAltText('Invalid avatar');
    
    // Simulate image load failure
    img.dispatchEvent(new Event('error'));
    
    expect(fallback).toBeVisible();
  });

  it('applies custom className to Avatar', () => {
    render(
      <Avatar className="custom-class">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    
    const avatar = screen.getByText('JD').closest('div');
    expect(avatar).toHaveClass('custom-class');
  });

  it('renders avatar without image', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    
    const fallback = screen.getByText('JD');
    expect(fallback).toBeInTheDocument();
  });

  it('handles empty alt text appropriately', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', '');
  });
});
