import { createContext, useCallback, useState } from "react";

export const AppContext = createContext({
  useAppMenu() {
    const [reveal, setReveal] = useState(false);
    const toggleMenu = useCallback(
      (state?: boolean) => {
        setReveal((current) => state ?? !current);
      },
      [setReveal],
    );
    return {
      menu: reveal,
      toggleMenu,
    };
  },
});
