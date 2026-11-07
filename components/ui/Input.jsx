export default function Input({ icon, className = "", ...props }) {
  return (
    <label className={`ds-input ds-input--row ${className}`.trim()}>
      {icon}
      <input {...props} />
    </label>
  );
}
