import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import Toolbar from '../components/Toolbar.jsx';
import Calculator from '../components/Calculator.jsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  delete window.closed;
});

function setWindowClosed(value) {
  Object.defineProperty(window, 'closed', { configurable: true, get: () => value });
}

describe('Toolbar component', () => {
  it('toont de standaardtitel', () => {
    render(<Toolbar onClose={() => {}} />);
    expect(screen.getByText('Calculator')).toBeTruthy();
  });

  it('toont een sluitknop met toegankelijke naam', () => {
    render(<Toolbar onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'Sluiten' })).toBeTruthy();
  });

  it('roept onClose aan bij klik op de sluitknop', () => {
    const onClose = vi.fn();
    render(<Toolbar onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sluiten' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('Calculator met toolbar', () => {
  it('toont de toolbar bovenaan de rekenmachine', () => {
    render(<Calculator />);
    expect(screen.getByTestId('toolbar')).toBeTruthy();
  });

  it('roept window.close aan bij klik op Sluiten', () => {
    const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {});
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: 'Sluiten' }));
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('toont geen melding als het venster gesloten is', () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'close').mockImplementation(() => {});
    setWindowClosed(true);
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: 'Sluiten' }));
    act(() => { vi.advanceTimersByTime(200); });
    expect(screen.queryByRole('alert')).toBeNull();
    vi.useRealTimers();
  });

  it('toont een melding als de browser het sluiten blokkeert', () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'close').mockImplementation(() => {});
    setWindowClosed(false);
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: 'Sluiten' }));
    act(() => { vi.advanceTimersByTime(200); });
    expect(screen.getByRole('alert').textContent).toMatch(/Sluit het tabblad zelf/);
    vi.useRealTimers();
  });
});
