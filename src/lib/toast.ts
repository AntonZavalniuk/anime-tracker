import { toast as sonnerToast, type ExternalToast } from "sonner";

type ToastMessage = string | React.ReactNode;

export type PromiseData<ToastData = unknown> = Omit<
  ExternalToast,
  "description"
> & {
  loading?: ToastMessage;
  success?: ToastMessage | ((data: ToastData) => ToastMessage);
  error?: ToastMessage | ((error: unknown) => ToastMessage);
  description?: ToastMessage | ((data: unknown) => ToastMessage);
  finally?: () => void | Promise<void>;
};

export const toast = Object.assign(
  (message: ToastMessage, data?: ExternalToast) => sonnerToast(message, data),
  {
    success: (
      message: ToastMessage,
      descriptionOrData?: string | ExternalToast,
    ) => {
      const data: ExternalToast =
        typeof descriptionOrData === "string"
          ? { description: descriptionOrData }
          : (descriptionOrData ?? {});
      return sonnerToast.success(message, data);
    },
    error: (
      message: ToastMessage,
      descriptionOrData?: string | ExternalToast,
    ) => {
      const data: ExternalToast =
        typeof descriptionOrData === "string"
          ? { description: descriptionOrData }
          : (descriptionOrData ?? {});
      return sonnerToast.error(message, data);
    },
    info: (
      message: ToastMessage,
      descriptionOrData?: string | ExternalToast,
    ) => {
      const data: ExternalToast =
        typeof descriptionOrData === "string"
          ? { description: descriptionOrData }
          : (descriptionOrData ?? {});
      return sonnerToast.info(message, data);
    },
    warning: (
      message: ToastMessage,
      descriptionOrData?: string | ExternalToast,
    ) => {
      const data: ExternalToast =
        typeof descriptionOrData === "string"
          ? { description: descriptionOrData }
          : (descriptionOrData ?? {});
      return sonnerToast.warning(message, data);
    },
    loading: (message: ToastMessage, data?: ExternalToast) =>
      sonnerToast.loading(message, data),
    promise: <T>(
      promise: Promise<T> | (() => Promise<T>),
      data?: PromiseData<T>,
    ): Promise<T> => {
      const p = typeof promise === "function" ? promise() : promise;
      sonnerToast.promise(p, data as Parameters<typeof sonnerToast.promise>[1]);
      return p;
    },
    dismiss: sonnerToast.dismiss,
    custom: sonnerToast.custom,
  },
);

export type { ExternalToast };
