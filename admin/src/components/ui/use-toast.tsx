import * as React from "react";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: "default" | "destructive";
};

type ToastContextValue = {
  toasts: ToastItem[];
  addToast: (opts: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 5000;

function ToastStateProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = React.useCallback((opts: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID?.() ?? String(Date.now());
    setToasts((prev) => [...prev, { ...opts, id }]);
  }, []);

  const value = React.useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      <ToastProvider>
        <Toaster />
        {children}
      </ToastProvider>
    </ToastContext.Provider>
  );
}

function Toaster() {
  const { toasts, removeToast } = React.useContext(ToastContext)!;
  return (
    <>
      <ToastViewport />
      {toasts.map((t) => (
        <Toast
          key={t.id}
          variant={t.variant}
          open
          duration={TOAST_DURATION}
          onOpenChange={(open) => {
            if (!open) removeToast(t.id);
          }}
        >
          <ToastTitle>{t.title}</ToastTitle>
          {t.description ? (
            <ToastDescription>{t.description}</ToastDescription>
          ) : null}
          <ToastClose />
        </Toast>
      ))}
    </>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastStateProvider");
  const { addToast } = ctx;
  return {
    toast: {
      success: (title: string, description?: string) =>
        addToast({ title, description, variant: "default" }),
      error: (title: string, description?: string) =>
        addToast({ title, description, variant: "destructive" }),
    },
  };
}

export { ToastStateProvider };
