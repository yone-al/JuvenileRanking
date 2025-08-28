/**
 * トースト通知コンポーネント
 */
import { type Toast } from "../types";

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  removeToast,
}) => {
  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300
              animate-slide-in cursor-pointer min-w-[250px] max-w-[400px]
              ${toast.type === "success" ? "bg-green-500 text-white" : ""}
              ${toast.type === "error" ? "bg-red-500 text-white" : ""}
              ${toast.type === "info" ? "bg-blue-500 text-white" : ""}
              hover:opacity-90
            `}
            onClick={() => removeToast(toast.id)}
          >
            <div className="flex items-center">
              <span className="mr-2 text-lg">
                {toast.type === "success" && "✓"}
                {toast.type === "error" && "✕"}
                {toast.type === "info" && "ℹ"}
              </span>
              <span className="flex-1">{toast.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
