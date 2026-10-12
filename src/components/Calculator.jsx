import { useReducer, useEffect } from 'react';
import {
  initialState, inputDigit, inputDecimal, toggleSign, percent, sqrt,
  reciprocal, square, setOperator, equals, clearEntry, clearAll, backspace,
} from '../logic/calculator.js';
import Toolbar from './Toolbar.jsx';

const reducer = (state, action) => {
  switch (action.type) {
    case 'digit': return inputDigit(state, action.value);
    case 'decimal': return inputDecimal(state);
    case 'op': return setOperator(state, action.value);
    case 'equals': return equals(state);
    case 'sign': return toggleSign(state);
    case 'percent': return percent(state);
    case 'sqrt': return sqrt(state);
    case 'reciprocal': return reciprocal(state);
    case 'square': return square(state);
    case 'ce': return clearEntry(state);
    case 'c': return clearAll();
    case 'back': return backspace(state);
    default: return state;
  }
};

const BUTTONS = [
  { label: '%', action: { type: 'percent' }, kind: 'fn' },
  { label: 'CE', action: { type: 'ce' }, kind: 'fn' },
  { label: 'C', action: { type: 'c' }, kind: 'fn' },
  { label: '⌫', action: { type: 'back' }, kind: 'fn' },
  { label: '¹⁄ₓ', action: { type: 'reciprocal' }, kind: 'fn' },
  { label: 'x²', action: { type: 'square' }, kind: 'fn' },
  { label: '²√x', action: { type: 'sqrt' }, kind: 'fn' },
  { label: '÷', action: { type: 'op', value: '÷' }, kind: 'op' },
  { label: '7', action: { type: 'digit', value: '7' }, kind: 'num' },
  { label: '8', action: { type: 'digit', value: '8' }, kind: 'num' },
  { label: '9', action: { type: 'digit', value: '9' }, kind: 'num' },
  { label: '×', action: { type: 'op', value: '×' }, kind: 'op' },
  { label: '4', action: { type: 'digit', value: '4' }, kind: 'num' },
  { label: '5', action: { type: 'digit', value: '5' }, kind: 'num' },
  { label: '6', action: { type: 'digit', value: '6' }, kind: 'num' },
  { label: '−', action: { type: 'op', value: '-' }, kind: 'op' },
  { label: '1', action: { type: 'digit', value: '1' }, kind: 'num' },
  { label: '2', action: { type: 'digit', value: '2' }, kind: 'num' },
  { label: '3', action: { type: 'digit', value: '3' }, kind: 'num' },
  { label: '+', action: { type: 'op', value: '+' }, kind: 'op' },
  { label: '±', action: { type: 'sign' }, kind: 'num' },
  { label: '0', action: { type: 'digit', value: '0' }, kind: 'num' },
  { label: ',', action: { type: 'decimal' }, kind: 'num' },
  { label: '=', action: { type: 'equals' }, kind: 'eq' },
];

const KEY_MAP = {
  '0': { type: 'digit', value: '0' }, '1': { type: 'digit', value: '1' },
  '2': { type: 'digit', value: '2' }, '3': { type: 'digit', value: '3' },
  '4': { type: 'digit', value: '4' }, '5': { type: 'digit', value: '5' },
  '6': { type: 'digit', value: '6' }, '7': { type: 'digit', value: '7' },
  '8': { type: 'digit', value: '8' }, '9': { type: 'digit', value: '9' },
  '.': { type: 'decimal' }, ',': { type: 'decimal' },
  '+': { type: 'op', value: '+' }, '-': { type: 'op', value: '-' },
  '*': { type: 'op', value: '×' }, 'x': { type: 'op', value: '×' },
  '/': { type: 'op', value: '÷' },
  Enter: { type: 'equals' }, '=': { type: 'equals' },
  Backspace: { type: 'back' }, Escape: { type: 'c' }, Delete: { type: 'ce' },
  '%': { type: 'percent' },
};

export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => {
    const onKey = (e) => {
      const action = KEY_MAP[e.key];
      if (!action) return;
      e.preventDefault();
      dispatch(action);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const display = state.error ?? state.display;

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="calculator" role="application" aria-label="Rekenmachine">
      <Toolbar onClose={handleClose} />
      <div className="display" role="status" aria-live="polite" data-testid="display">
        {display}
      </div>
      <div className="keypad">
        {BUTTONS.map((b) => (
          <button
            key={b.label}
            type="button"
            className={`btn btn-${b.kind}`}
            onClick={() => dispatch(b.action)}
            aria-label={b.label}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
