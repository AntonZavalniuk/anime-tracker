import { toast as toastManager } from "@/components/ui/toast";

export const toast = {
  success: (title: string, description?: string) =>
    toastManager.add({ type: "success", title, description }),
  error: (title: string, description?: string) =>
    toastManager.add({ type: "error", title, description, timeout: 7000 }),
};
