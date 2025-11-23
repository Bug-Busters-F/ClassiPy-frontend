import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

interface ToastErrorProps {
  error: string | null;
  onClear?: () => void;
}

const ToastError: React.FC<ToastErrorProps> = ({ error, onClear }) => {
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (error && !hasShownRef.current) {
      hasShownRef.current = true;
      toast.error(error);

      if (onClear) {
        onClear();
      }
    }
  }, [error]);

  return null;
};

export default ToastError;
