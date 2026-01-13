import type { VideoMetadata } from "../types/VideoMetadata";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useMetadata } from "@/hooks/useMetadata";
import { PoseRadio } from "./PoseRadio";

interface PoseSelectorProps {
  name: string;
  metadata: VideoMetadata;
  onNextVideo: () => void;
}

export const PoseSelector = ({
  metadata,
  name,
  onNextVideo,
}: PoseSelectorProps) => {
  const [pose, setPose] = React.useState(
    metadata?.pose ? metadata.pose : "pending"
  );
  const onPoseChange = (s: string) => setPose(s);
  const { update } = useMetadata();

  const handleSave = async () => {
    try {
      update(name, { ...metadata, pose: pose });
    } catch (error) {
      console.error("Error updating video metadata:", error);
    }
  };
  // Available statuses in the same order as the radio options
  const poseOptions = React.useMemo(
    () => ["no_recon", "pending", "wrong", "almost", "approved"],
    []
  );

  React.useEffect(() => {
    setPose(metadata.pose ?? "undefined");
  }, [metadata]);

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
      if (!Number.isNaN(idx) && idx >= 1 && idx <= poseOptions.length) {
        setPose(poseOptions[idx - 1]);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [poseOptions, handleSave, onNextVideo]);

  return name && metadata && pose ? (
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
          <b>Pose:</b>
        </div>
        <PoseRadio pose={pose} onPoseChange={onPoseChange} />
      </div>
      <div className="flex">
        <Button onClick={handleSave}>Save</Button>
      </div>
    </>
  ) : null;
};
