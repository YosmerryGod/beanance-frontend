export default function Badge({ tone, className = "", children, ...props }) {
  const toneClass = tone ? `risk-tag risk-${tone}` : "";
  return <span className={`ds-badge ${toneClass} ${className}`.trim()} {...props}>{children}</span>;
}
