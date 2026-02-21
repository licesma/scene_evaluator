import { useEffect } from "react";

export interface UseKeyboardControlProps {
  handleSave: () => Promise<void>;
  updateDropdownState: (index: number) => void;
  onNextVideo: () => void;
}

export function useKeyboardControl(props: UseKeyboardControlProps) {
  const { handleSave, updateDropdownState, onNextVideo } = props;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "TEXTAREA" ||
          (target.tagName === "INPUT" &&
            [
              "text",
              "search",
              "password",
              "email",
              "number",
              "url",
              "tel",
            ].includes((target as HTMLInputElement).type)) ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.repeat) return;

      // Enter triggers save and next
      if (e.key === "Enter") {
        handleSave();
        onNextVideo();
        e.preventDefault();
        return;
      }

      // 'n' moves to next video
      if (e.key.toLowerCase() === "n") {
        onNextVideo();
        e.preventDefault();
        return;
      }

      // Number keys: control status (model tab) or pose (poses tab)
      const idx = parseInt(e.key, 10);
      if (!Number.isNaN(idx) && idx >= 1 && idx <= 5) {
        updateDropdownState(idx);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, onNextVideo]);
}
