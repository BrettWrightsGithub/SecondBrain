import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Toaster } from '../toaster';
import { useToast } from '../use-toast';

// Mock component to test toast functionality
function TestComponent() {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ title: 'Test Toast', description: 'Test Description' })}>
      Show Toast
    </button>
  );
}

describe('Toaster Component', () => {
  beforeEach(() => {
    // Clear any existing toasts
    document.body.innerHTML = '';
  });

  it('renders without crashing', () => {
    render(<Toaster />);
    expect(document.querySelector('[role="region"]')).toBeInTheDocument();
  });

  it('shows toast when triggered', async () => {
    render(
      <>
        <TestComponent />
        <Toaster />
      </>
    );

    const button = screen.getByText('Show Toast');
    fireEvent.click(button);

    // Wait for toast to appear
    const toast = await screen.findByRole('status');
    expect(toast).toBeInTheDocument();
    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('dismisses toast when close button is clicked', async () => {
    render(
      <>
        <TestComponent />
        <Toaster />
      </>
    );

    const button = screen.getByText('Show Toast');
    fireEvent.click(button);

    const toast = await screen.findByRole('status');
    const closeButton = toast.querySelector('button[aria-label="Close"]');
    expect(closeButton).toBeInTheDocument();

    if (closeButton) {
      fireEvent.click(closeButton);
    }

    // Wait for toast to disappear
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('handles multiple toasts', async () => {
    function MultipleToastTest() {
      const { toast } = useToast();
      return (
        <>
          <button onClick={() => toast({ title: 'Toast 1' })}>Show Toast 1</button>
          <button onClick={() => toast({ title: 'Toast 2' })}>Show Toast 2</button>
        </>
      );
    }

    render(
      <>
        <MultipleToastTest />
        <Toaster />
      </>
    );

    fireEvent.click(screen.getByText('Show Toast 1'));
    fireEvent.click(screen.getByText('Show Toast 2'));

    const toasts = await screen.findAllByRole('status');
    expect(toasts).toHaveLength(2);
    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
  });
});
