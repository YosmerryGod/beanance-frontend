/* Segmented control: inset tray + raised selected pill. */
export default function Tabs({ items, value, onChange, label, className = "" }) {
  return (
    <div className={`ds-tabs ${className}`.trim()} role="tablist" aria-label={label}>
      {items.map((item) => {
        const id = typeof item === "string" ? item : item.id;
        const text = typeof item === "string" ? item : item.label;
        const selected = value === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={selected ? "selected" : ""}
            onClick={() => onChange(id)}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}
