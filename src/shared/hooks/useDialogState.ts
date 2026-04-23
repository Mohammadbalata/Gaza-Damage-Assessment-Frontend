import { useCallback, useState } from "react";

export interface UseDialogStateReturn<T> {
  isOpen: boolean;
  data: T | null;
  open: (item?: T) => void;
  close: () => void;
}

/**
 * Manages open/close state for a dialog together with the item that opened it.
 *
 * Replaces the repeated pair of `const [open, setOpen] = useState(false)` +
 * `const [selectedItem, setSelectedItem] = useState(null)` across the
 * application's dialog sites (see audit §3, pattern 4).
 *
 * @example
 *   const commentsDialog = useDialogState<Application>();
 *   commentsDialog.open(app);   // opens and stores `app` on `data`
 *   commentsDialog.close();     // closes and clears `data`
 */
export function useDialogState<T = unknown>(): UseDialogStateReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((item?: T) => {
    if (item !== undefined) setData(item);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return { isOpen, data, open, close };
}

export default useDialogState;
