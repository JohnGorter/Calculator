import { describe, it, expect } from 'vitest';
import {
  initialState, inputDigit, inputDecimal, toggleSign, percent, sqrt,
  reciprocal, square, setOperator, equals, clearEntry, clearAll, backspace, formatNumber,
} from '../logic/calculator.js';

const type = (state, keys) => keys.split('').reduce((s, k) => {
  if (k === '.') return inputDecimal(s);
  return inputDigit(s, k);
}, state);

describe('formatNumber', () => {
  it('rondt floating point ruis af', () => {
    expect(formatNumber(0.1 + 0.2)).toBe('0.3');
  });
  it('geeft 0 voor negatieve nul', () => {
    expect(formatNumber(-0)).toBe('0');
  });
  it('geeft null voor oneindig', () => {
    expect(formatNumber(Infinity)).toBeNull();
  });
  it('gebruikt exponentiële notatie voor zeer grote getallen', () => {
    expect(formatNumber(1e20)).toBe('1e+20');
  });
});

describe('invoer', () => {
  it('begint met 0 en vervangt de 0 door een cijfer', () => {
    expect(inputDigit(initialState(), '5').display).toBe('5');
  });
  it('voegt decimalen toe en voorkomt een tweede punt', () => {
    const s = type(initialState(), '1.2.3');
    expect(s.display).toBe('1.23');
  });
  it('begint met 0. na een decimaal teken', () => {
    expect(inputDecimal(initialState()).display).toBe('0.');
  });
  it('limiteert het aantal cijfers', () => {
    const s = type(initialState(), '1234567890123456789');
    expect(s.display.replace('.', '').length).toBe(16);
  });
  it('wisselt het teken', () => {
    expect(toggleSign(type(initialState(), '5')).display).toBe('-5');
    expect(toggleSign(toggleSign(type(initialState(), '5'))).display).toBe('5');
  });
  it('wisselt het teken niet bij 0', () => {
    expect(toggleSign(initialState()).display).toBe('0');
  });
  it('backspace verwijdert het laatste cijfer', () => {
    expect(backspace(type(initialState(), '123')).display).toBe('12');
  });
  it('backspace zet een enkel cijfer terug op 0', () => {
    expect(backspace(type(initialState(), '5')).display).toBe('0');
  });
});

describe('basisbewerkingen', () => {
  it('optellen', () => {
    let s = type(initialState(), '2');
    s = setOperator(s, '+');
    s = type(s, '3');
    expect(equals(s).display).toBe('5');
  });
  it('aftrekken', () => {
    let s = setOperator(type(initialState(), '9'), '-');
    s = type(s, '4');
    expect(equals(s).display).toBe('5');
  });
  it('vermenigvuldigen', () => {
    let s = setOperator(type(initialState(), '6'), '×');
    s = type(s, '7');
    expect(equals(s).display).toBe('42');
  });
  it('delen', () => {
    let s = setOperator(type(initialState(), '8'), '÷');
    s = type(s, '2');
    expect(equals(s).display).toBe('4');
  });
  it('delen door nul geeft een foutmelding', () => {
    let s = setOperator(type(initialState(), '8'), '÷');
    s = type(s, '0');
    expect(equals(s).error).toBe('Kan niet delen door nul');
  });
  it('kettingberekening evalueert de vorige bewerking', () => {
    let s = setOperator(type(initialState(), '2'), '+');
    s = type(s, '3');
    s = setOperator(s, '×');
    expect(s.display).toBe('5');
    s = type(s, '4');
    expect(equals(s).display).toBe('20');
  });
  it('operator wijzigen zonder nieuw getal', () => {
    let s = setOperator(type(initialState(), '2'), '+');
    s = setOperator(s, '×');
    s = type(s, '4');
    expect(equals(s).display).toBe('8');
  });
  it('is-gelijk na een berekening wist de operator', () => {
    let s = setOperator(type(initialState(), '2'), '+');
    s = type(s, '3');
    s = equals(s);
    expect(s.display).toBe('5');
    expect(s.stored).toBeNull();
  });
  it('een cijfer na = start een nieuwe berekening', () => {
    let s = setOperator(type(initialState(), '2'), '+');
    s = equals(type(s, '3'));
    s = type(s, '9');
    expect(s.display).toBe('9');
  });
  it('is-gelijk zonder operator verandert niets', () => {
    const s = type(initialState(), '7');
    expect(equals(s).display).toBe('7');
  });
});

describe('speciale functies', () => {
  it('procent', () => {
    expect(percent(type(initialState(), '50')).display).toBe('0.5');
  });
  it('vierkantswortel', () => {
    expect(sqrt(type(initialState(), '81')).display).toBe('9');
  });
  it('vierkantswortel van negatief getal geeft een fout', () => {
    expect(sqrt(toggleSign(type(initialState(), '4'))).error).toBe('Ongeldige invoer');
  });
  it('omgekeerde waarde', () => {
    expect(reciprocal(type(initialState(), '4')).display).toBe('0.25');
  });
  it('omgekeerde van 0 geeft een fout', () => {
    expect(reciprocal(initialState()).error).toBe('Kan niet delen door nul');
  });
  it('kwadraat', () => {
    expect(square(type(initialState(), '12')).display).toBe('144');
  });
});

describe('wissen', () => {
  it('CE wist alleen het huidige getal', () => {
    let s = setOperator(type(initialState(), '5'), '+');
    s = type(s, '3');
    s = clearEntry(s);
    expect(s.display).toBe('0');
    expect(s.stored).not.toBeNull();
  });
  it('C reset alles', () => {
    let s = setOperator(type(initialState(), '5'), '+');
    s = clearAll(s);
    expect(s).toEqual(initialState());
  });
  it('een fout wordt gewist door een cijfer in te voeren', () => {
    const err = { ...initialState(), error: 'x' };
    expect(inputDigit(err, '4').display).toBe('4');
    expect(inputDigit(err, '4').error).toBeNull();
  });
});

describe('procent in combinatie met een bewerking (Windows-gedrag)', () => {
  it('200 + 2 % = geeft 204 (percentage van het opgeslagen getal)', () => {
    let s = setOperator(type(initialState(), '200'), '+');
    s = percent(type(s, '2'));
    expect(s.display).toBe('4');
    expect(equals(s).display).toBe('204');
  });
  it('200 - 2 % = geeft 196', () => {
    let s = setOperator(type(initialState(), '200'), '-');
    s = percent(type(s, '2'));
    expect(equals(s).display).toBe('196');
  });
  it('200 × 2 % = geeft 4 (percentage als operand)', () => {
    let s = setOperator(type(initialState(), '200'), '×');
    s = percent(type(s, '2'));
    expect(equals(s).display).toBe('4');
  });
  it('procent zonder bewerking deelt door 100', () => {
    expect(percent(type(initialState(), '200')).display).toBe('2');
  });
});

describe('teken wisselen na decimaal teken en backspace', () => {
  it('0. → ± → ⌫ → 5 geeft 5 en niet -05', () => {
    let s = inputDecimal(initialState());
    s = toggleSign(s);
    s = backspace(s);
    s = inputDigit(s, '5');
    expect(s.display).toBe('-5');
  });
  it('geen voorloopnul na -0 bij cijferinvoer', () => {
    let s = inputDecimal(initialState());
    s = toggleSign(s);
    s = backspace(s);
    expect(s.display).toBe('-0');
    s = inputDigit(s, '7');
    expect(s.display).not.toMatch(/^-0\d/);
  });
});
