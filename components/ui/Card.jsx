export default function Card({ as: Tag = "div", className = "", children, ...props }) {
  return <Tag className={`ds-card ${className}`.trim()} {...props}>{children}</Tag>;
}
