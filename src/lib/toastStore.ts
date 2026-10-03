export type ToastVariant = "error" | "success" | "info";

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

const TOAST_TTL_MS = 5000;

class ToastStore {
  private items: ToastItem[] = [];
  private listeners = new Set<() => void>();
  private nextId = 1;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.items;

  getServerSnapshot = () => this.items;

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  push(message: string, variant: ToastVariant) {
    const id = this.nextId++;
    this.items = [...this.items, { id, message, variant }];
    this.emit();

    setTimeout(() => this.dismiss(id), TOAST_TTL_MS);
  }

  dismiss(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
    this.emit();
  }
}

const toastStore = new ToastStore();

export const toast = {
  error: (message: string) => toastStore.push(message, "error"),
  success: (message: string) => toastStore.push(message, "success"),
  info: (message: string) => toastStore.push(message, "info"),
};

export function subscribeToasts(listener: () => void) {
  return toastStore.subscribe(listener);
}

export function getToastSnapshot() {
  return toastStore.getSnapshot();
}

export function dismissToast(id: number) {
  toastStore.dismiss(id);
}
