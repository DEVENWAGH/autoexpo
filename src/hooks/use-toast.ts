import { toast } from "react-hot-toast";

export function useToast() {
  return {
    toast: {
      success: (message: string) => {
        toast.success(message);
      },
      error: (message: string) => {
        toast.error(message);
      },
      custom: ({ title, description }: { title: string, description?: string }) => {
        toast(title + (description ? `\n${description}` : ""));
      },
    },
  };
}
