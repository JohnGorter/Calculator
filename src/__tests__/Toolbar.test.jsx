import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Toolbar from '../components/Toolbar.jsx';
import Calculator from '../components/Calculator.jsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Toolbar component', () => {
  it('toont de standaardtitel', () => {
    render(<Toolbar onClose={() => {}} />);
    expect(screen.getByText('Rekenmachine')).toBeTruthy();
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
});
