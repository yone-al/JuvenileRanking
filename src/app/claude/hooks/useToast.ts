/**
 * トースト通知を管理するカスタムフック
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { Toast, ToastType } from "../types";
import { TOAST_DURATION } from "../constants";

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // クリーンアップ
  useEffect(() => {
    const timersRef = toastTimers.current;

    return () => {
      // すべてのタイマーをクリア
      timersRef.forEach((timer) => clearTimeout(timer));
      timersRef.clear();
    };
  }, []);

  /**
   * トーストを表示
   */
  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Date.now();
      const newToast = { id, message, type };
      setToasts((prev) => [...prev, newToast]);

      // タイマーを設定して参照を保持
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
        toastTimers.current.delete(id);
      }, TOAST_DURATION);

      toastTimers.current.set(id, timer);
    },
    [],
  );

  /**
   * トーストを手動で削除
   */
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

    // タイマーが存在する場合はクリア
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  return { toasts, showToast, removeToast };
};
