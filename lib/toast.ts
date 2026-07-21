export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toast: ToastMessage) => void;

class ToastManager {
  private listeners: ToastListener[] = [];

  public subscribe(listener: ToastListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public notify(toast: Omit<ToastMessage, 'id'>) {
    const fullToast: ToastMessage = {
      ...toast,
      id: Math.random().toString(36).substring(2, 9),
      duration: toast.duration || 4000,
    };
    this.listeners.forEach((l) => l(fullToast));
  }

  public success(title: string, description?: string) {
    this.notify({ title, description, type: 'success' });
  }

  public error(title: string, description?: string) {
    this.notify({ title, description, type: 'error' });
  }

  public info(title: string, description?: string) {
    this.notify({ title, description, type: 'info' });
  }

  public warning(title: string, description?: string) {
    this.notify({ title, description, type: 'warning' });
  }
}

export const toast = new ToastManager();
