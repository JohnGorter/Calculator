import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Calculator from '../components/Calculator.jsx';

afterEach(cleanup);

const click = (label) => fireEvent.click(screen.getByRole('button', { name: label }));
const display = () => screen.getByTestId('display').textContent;

describe('Calculator component', () => {
  it('toont 0 bij start', () => {
    render(<Calculator />);
    expect(display()).toBe('0');
  });

  it('berekent 12 + 30 = 42 via knoppen', () => {
    render(<Calculator />);
    click('1'); click('2'); click('+'); click('3'); click('0'); click('=');
    expect(display()).toBe('42');
  });

  it('toont de foutmelding bij delen door nul', () => {
    render(<Calculator />);
    click('5'); click('÷'); click('0'); click('=');
    expect(display()).toBe('Kan niet delen door nul');
  });

  it('ondersteunt toetsenbordinvoer', () => {
    render(<Calculator />);
    fireEvent.keyDown(window, { key: '9' });
    fireEvent.keyDown(window, { key: '*' });
    fireEvent.keyDown(window, { key: '2' });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(display()).toBe('18');
  });

  it('Escape wist alles', () => {
    render(<Calculator />);
    click('7');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(display()).toBe('0');
  });

  it('wisselt het teken met ±', () => {
    render(<Calculator />);
    click('4'); click('±');
    expect(display()).toBe('-4');
  });
});
