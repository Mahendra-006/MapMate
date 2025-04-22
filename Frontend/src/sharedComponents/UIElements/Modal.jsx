import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 w-full max-w-xl animate-fade-in-up relative"
          onClick={(e) => e.stopPropagation()}
        >
        <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
            >
            <X size={24} />
        </button>
          {children}
        </div>
      </div>
    </>,
    document.getElementById("modal-root")
  );
}
