import type { VideoMetadata } from "../types/VideoMetadata";
import * as React from "react";
import { VideoStatusRadio } from "./VideoStatusRadio";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoInfoProps {
  name: string;
  data: VideoMetadata;
  updateAllMetadata: (name: string, patch: Partial<VideoMetadata>) => void;
  onNextVideo: () => void;
}

export const VideoInfo = ({
  data,
  name,
  updateAllMetadata,
  onNextVideo,
}: VideoInfoProps) => {
  const [status, setStatus] = React.useState(data.status);
  const onStatusChange = (s: string) => setStatus(s);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/video/metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video: name,
          metadata: {
            // Send the entire metadata plus the current status selection
            ...data,
            status: status,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update metadata: ${response.statusText}`);
      }

      const result = await response.json();
      updateAllMetadata(name, { status });
      toast(result.message);
      //displayModal(result.message);
    } catch (error) {
      console.error("Error updating video metadata:", error);
    }
  };

  // Available statuses in the same order as the radio options
  const statusOptions = React.useMemo(
    () => ["pending", "object", "pose", "approved"],
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
    console.log("Status:", status);
  });
  React.useEffect(() => {
    setStatus(data.status);
  }, [data]);

  React.useEffect(() => {
    console.log("grecia");
  });
  return name && data && status ? (
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
        <div className="text-left">{data.prompt}</div>
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
