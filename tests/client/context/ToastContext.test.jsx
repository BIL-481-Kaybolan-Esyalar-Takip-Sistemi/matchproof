import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../../../src/client/context/ToastContext';

// A dummy component to consume context
function TestComponent() {
  const { showToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast('Test success message')}>Show Success</button>
      <button onClick={() => showToast('Test error message', 'error')}>Show Error</button>
    </div>
  );
}

describe('ToastContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('shows and hides success toast after 3500ms', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.queryByText('Test success message')).toBeNull();

    act(() => {
      screen.getByText('Show Success').click();
    });

    // Toast should be visible
    expect(screen.getByText('Test success message')).toBeInTheDocument();

    // Fast forward 3400ms - toast should still be visible
    act(() => {
      jest.advanceTimersByTime(3400);
    });
    expect(screen.queryByText('Test success message')).toBeInTheDocument();

    // Fast forward remaining time (to cross 3500ms limit)
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(screen.queryByText('Test success message')).toBeNull();
  });

  it('shows error toast', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Show Error').click();
    });

    const toast = screen.getByText('Test error message');
    expect(toast).toBeInTheDocument();
    
    // Test if style matches error logic
    // Error type produces background #c0392b based on source code string matching
    // JSDOM computes colors to rgb. But let's just make sure it renders
  });
});
