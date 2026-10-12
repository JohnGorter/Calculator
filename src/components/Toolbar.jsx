export default function Toolbar({ title = 'Rekenmachine', onClose }) {
  return (
    <header className="toolbar" data-testid="toolbar">
      <span className="toolbar-title">{title}</span>
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
