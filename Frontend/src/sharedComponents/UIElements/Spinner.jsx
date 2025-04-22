export default function Spinner({ asOverlay = false }) {
    return (
      <div
        className={`${
          asOverlay
            ? "absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-xl z-50"
            : "flex items-center justify-center"
        }`}
      >
        <svg
          className="animate-spin text-blue-500"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="6"
            className="opacity-25"
          />
          <path
            d="M60 32C60 18.7452 49.2548 8 36 8"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="opacity-75"
          />
        </svg>
      </div>
    );
  }
  