import { toast } from "react-hot-toast";
import React from "react";

export function useToast() {
  return {
    toast: {
      success: (message: string) => {
        toast.success(message);
      },
      error: (message: string) => {
        toast.error(message);
      },
      custom: ({
        title,
        description,
      }: {
        title: string;
        description?: string;
      }) => {
        toast(
          <div className="flex flex-col gap-1">
            <h3 className="font-medium">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        );
      },
    },
  };
}
