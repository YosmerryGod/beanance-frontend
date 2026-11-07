export default function Button({ variant = "primary", className = "", type = "button", children, ...props }) {
  return (
    <button type={type} className={`ds-btn ds-btn--${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
