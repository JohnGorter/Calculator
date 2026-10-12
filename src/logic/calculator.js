// Pure rekenlogica zonder React-afhankelijkheden, eenvoudig te testen.

const MAX_DIGITS = 16;

export const initialState = () => ({
  display: '0',
  stored: null, // { value: string, op: string } of null
  waitingForOperand: false, // volgende cijfer start een nieuw getal
  justEvaluated: false, // laatste actie was een berekening; cijfer start nieuw getal
  error: null,
});

export const formatNumber = (n) => {
  if (!Number.isFinite(n)) return null;
  if (Object.is(n, -0)) return '0';
  // Afronden om floating point ruis zoals 0.1 + 0.2 te verbergen
  const rounded = Number(n.toPrecision(15));
  const abs = Math.abs(rounded);
  if (abs !== 0 && (abs >= 1e15 || abs < 1e-9)) {
    return rounded.toExponential(9).replace(/\.?0+e/, 'e');
  }
  return String(rounded);
};

export const compute = (a, op, b) => {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷':
      if (b === 0) return { error: 'Kan niet delen door nul' };
      return a / b;
    default: return b;
  }
};

const errorState = (message) => ({ ...initialState(), error: message });

const resultState = (state, formatted, extra = {}) => {
  if (formatted === null) return errorState('Resultaat te groot');
  return { ...state, display: formatted, justEvaluated: true, waitingForOperand: false, ...extra };
};

const evaluate = (state) => {
  if (!state.stored) return state;
  const result = compute(Number(state.stored.value), state.stored.op, Number(state.display));
  if (typeof result === 'object' && result !== null) return errorState(result.error);
  return resultState(state, formatNumber(result), { stored: null });
};

export const inputDigit = (state, digit) => {
  if (state.error) state = initialState();
  if (state.waitingForOperand || state.justEvaluated) {
    return { ...state, display: digit, waitingForOperand: false, justEvaluated: false };
  }
  // Voorloopnul (ook bij negatief getal, bijv. -0) wordt vervangen door het cijfer
  if (state.display === '0') return { ...state, display: digit };
  if (state.display === '-0') return { ...state, display: '-' + digit };
  const digitCount = state.display.replace(/[-.]/g, '').length;
  if (digitCount >= MAX_DIGITS) return state;
  return { ...state, display: state.display + digit };
};

export const inputDecimal = (state) => {
  if (state.error) state = initialState();
  if (state.waitingForOperand || state.justEvaluated) {
    return { ...state, display: '0.', waitingForOperand: false, justEvaluated: false };
  }
  if (state.display.includes('.')) return state;
  return { ...state, display: state.display + '.' };
};

export const toggleSign = (state) => {
  if (state.error || state.display === '0') return state;
  const display = state.display.startsWith('-') ? state.display.slice(1) : '-' + state.display;
  return { ...state, display };
};

// Windows-gedrag: bij + en − is het percentage een deel van het opgeslagen getal
// (200 + 2 % = 204). Bij × en ÷, of zonder bewerking, is het gewoon delen door 100.
export const percent = (state) => {
  if (state.error) return state;
  const v = Number(state.display);
  const additive = state.stored && (state.stored.op === '+' || state.stored.op === '-');
  const result = additive
    ? Number(state.stored.value) * v / 100
    : v / 100;
  return resultState(state, formatNumber(result));
};

export const sqrt = (state) => {
  if (state.error) return state;
  const v = Number(state.display);
  if (v < 0) return errorState('Ongeldige invoer');
  return resultState(state, formatNumber(Math.sqrt(v)));
};

export const reciprocal = (state) => {
  if (state.error) return state;
  const v = Number(state.display);
  if (v === 0) return errorState('Kan niet delen door nul');
  return resultState(state, formatNumber(1 / v));
};

export const square = (state) => {
  if (state.error) return state;
  return resultState(state, formatNumber(Number(state.display) ** 2));
};

export const setOperator = (state, op) => {
  if (state.error) state = initialState();
  // Operator wijzigen zonder nieuw getal ingevoerd
  if (state.stored && state.waitingForOperand) {
    return { ...state, stored: { value: state.stored.value, op } };
  }
  // Ketenberekening: bijv. 2 + 3 × -> eerst 5 tonen
  let base = state;
  if (state.stored) {
    base = evaluate(state);
    if (base.error) return base;
  }
  return {
    ...base,
    stored: { value: base.display, op },
    waitingForOperand: true,
    justEvaluated: false,
  };
};

export const equals = (state) => {
  if (state.error || !state.stored) return state;
  return evaluate(state);
};

export const clearEntry = (state) => {
  if (state.error) return initialState();
  return { ...state, display: '0' };
};

export const clearAll = () => initialState();

export const backspace = (state) => {
  if (state.error) return initialState();
  if (state.waitingForOperand || state.justEvaluated) return state;
  const next = state.display.slice(0, -1);
  if (next === '' || next === '-') return { ...state, display: '0' };
  return { ...state, display: next };
};
