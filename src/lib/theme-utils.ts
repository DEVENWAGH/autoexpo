import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useThemeDetector() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = mounted && resolvedTheme === "dark";
  
  return { isDark, mounted };
}
