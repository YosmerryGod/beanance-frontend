export default function IconButton({ label, className = "", type = "button", children, ...props }) {
  return (
    <button type={type} aria-label={label} className={`ds-icon-btn ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
