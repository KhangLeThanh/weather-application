import React, { useEffect } from "react";

function useClickOutsideEvent(
  innerRef: React.RefObject<HTMLElement | null>,
  onClickOutside: () => void
): void {
  useEffect(() => {
    const handleClickOutside = (event: Event): void => {
      if (!innerRef.current?.contains(event.target as Node)) {
        onClickOutside();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [innerRef, onClickOutside]);
}

export default useClickOutsideEvent;
