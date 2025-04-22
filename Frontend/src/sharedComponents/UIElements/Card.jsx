export default function Card({ children, className }) {
  return (
    <div className={`rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 ${className}`}>
      {children}
    </div>
  );
}
  