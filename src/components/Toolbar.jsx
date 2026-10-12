export default function Toolbar({ onClose }) {
  return (
    <header className="toolbar" data-testid="toolbar">
      <span className="toolbar-title">Rekenmachine</span>
      <button
        type="button"
        className="toolbar-close"
        onClick={onClose}
        aria-label="Sluiten"
        title="Sluiten"
      >
        ✕
      </button>
    </header>
  );
}
