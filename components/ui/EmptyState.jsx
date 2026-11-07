export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      {description ? <p className="muted">{description}</p> : null}
      {action}
    </div>
  );
}
