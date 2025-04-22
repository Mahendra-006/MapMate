import { Link } from 'react-router-dom';

export default function Button({
  children,
  to,
  type = "button",
  variant = "primary",
  onClick,
  disabled,
  className = ""
}) {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition duration-200";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    edting: "bg-yellow-500 text-white hover:bg-yellow-600",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
  };

  const finalClassName = `${baseStyles} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  if (to) {
    return (
      <Link to={to} className={finalClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
    >
      {children}
    </button>
  );
}
