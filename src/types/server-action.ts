// types/server-action.ts

interface ActionSuccess<T = void> {
  // Default T ke void
  success: true;
  data?: T; // Jadikan data opsional
  message?: string;
}

interface ActionError {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: string;
  };
}

export type ServerActionReturn<T = void> = ActionSuccess<T> | ActionError; // Default juga di sini
