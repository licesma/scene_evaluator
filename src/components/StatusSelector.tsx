import type { VideoMetadata } from "../types/VideoMetadata";
import * as React from "react";
import { VideoStatusRadio } from "./VideoStatusRadio";
import { Button } from "@/components/ui/button";
import { useMetadata } from "@/hooks/useMetadata";

interface StatusSelectorProps {
  name: string;
  metadata: VideoMetadata;
  onNextVideo: () => void;
}

export const StatusSelector = ({
  metadata,
  name,
  onNextVideo,
}: StatusSelectorProps) => {
  const [status, setStatus] = React.useState(metadata.status ?? "pending");
  const onStatusChange = (s: string) => setStatus(s);
  const { update } = useMetadata();

  const handleSave = async () => {
    try {
      if (status === "no_recon") {
        update(name, { ...metadata, status: status, pose: status });
      } else {
        update(name, { ...metadata, status: status });
      }
    } catch (error) {
      console.error("Error updating video metadata:", error);
    }
  };

  // Available statuses in the same order as the radio options
  const statusOptions = React.useMemo(
    () => ["no_recon", "pending", "object", "pose", "approved"],
    []
  );

  // Keybindings: 1-4 map to each status option
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keybinds while typing in text-like inputs/content editable
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
      // Enter triggers save
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
      const idx = parseInt(e.key, 10);
      if (!Number.isNaN(idx) && idx >= 1 && idx <= statusOptions.length) {
        setStatus(statusOptions[idx - 1]);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [statusOptions, handleSave, onNextVideo]);

  React.useEffect(() => {
    setStatus(metadata.status ?? "pending");
  }, [metadata]);

  React.useEffect(() => {
    console.log(name, metadata, status);
  });

  return name && metadata && status ? (
    <>
      <div style={{ marginBottom: "10px" }}>
        <div className="text-left">
          <b>Video:</b>
        </div>
        <div className="text-left">{name}</div>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <div className="text-left">
          <b>Prompt:</b>
        </div>
        <div className="text-left">{metadata.prompt}</div>
      </div>
      <div>
        <div className="text-left">
          <b>Status:</b>
        </div>
        <VideoStatusRadio
          videoStatus={status}
          onStatusChange={onStatusChange}
        />
      </div>
      <div className="flex">
        <Button onClick={handleSave}>Save</Button>
      </div>
    </>
  ) : null;
};
