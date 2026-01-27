import { useState, useEffect, type FC } from "react";
import type { TabType } from "@/types/Tab";
import type { VideoMetadata } from "@/types/VideoMetadata";
import "../App.css";
import "@google/model-viewer";
import ModelTab from "@/tabs/ModelTab";
import PosesTab from "@/tabs/PosesTab";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMetadata } from "@/hooks/useMetadata";

interface TabProps {
  selectedVideo: string | undefined;
  metadata: VideoMetadata | undefined;
  onNextVideo: () => void;
}

const statusOptions = ["no_recon", "pending", "object", "pose", "approved"];
const statusLabels: Record<string, string> = {
  no_recon: "1. No Reconstruction",
  pending: "2. Pending",
  object: "3. Wrong objects",
  pose: "4. Wrong pose",
  approved: "5. Approved",
};

const poseOptions = ["no_recon", "pending", "wrong", "almost", "approved"];
const poseLabels: Record<string, string> = {
  no_recon: "1. No Reconstruction",
  pending: "2. Pending",
  wrong: "3. Wrong",
  almost: "4. Almost",
  approved: "5. Correct",
};

export const Tab: FC<TabProps> = ({ selectedVideo, metadata, onNextVideo }) => {
  const [currentTab, setCurrentTab] = useState<TabType>("model");
  const [status, setStatus] = useState(metadata?.status ?? "pending");
  const [pose, setPose] = useState(metadata?.pose ?? "pending");
  const { update } = useMetadata();
  const isPoses = currentTab === "poses";

  // Sync status and pose when metadata changes
  useEffect(() => {
    setStatus(metadata?.status ?? "pending");
    setPose(metadata?.pose ?? "pending");
  }, [metadata]);

  const handleTabChange = (checked: boolean) => {
    const newTab = checked ? "poses" : "model";
    setCurrentTab(newTab);
  };

  const handleSave = async () => {
    if (!selectedVideo || !metadata) return;
    if(status !== metadata.status && pose != metadata.pose){
    try {
      if (status === "no_recon") {
        update(selectedVideo, { ...metadata, status, pose: status });
      } else {
        update(selectedVideo, { ...metadata, status, pose });
      }
    } catch (error) {
      console.error("Error updating video metadata:", error);
    }
  };
}

  // Keyboard bindings based on current tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "TEXTAREA" ||
          (target.tagName === "INPUT" &&
            ["text", "search", "password", "email", "number", "url", "tel"].includes(
              (target as HTMLInputElement).type
            )) ||
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
        if (currentTab === "model") {
          setStatus(statusOptions[idx - 1]);
        } else {
          setPose(poseOptions[idx - 1]);
        }
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTab, handleSave, onNextVideo]);

  return (
    <div className="flex flex-col gap-6 max-w-none w-full h-full">
      <div className="w-full h-full border border-gray-300 rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-10 flex items-center justify-between px-4 shrink-0">
          <div className="text-xl font-semibold">{selectedVideo}</div>
          <div className="flex items-center gap-2">
            <Label className={`text-sm ${isPoses ? "text-gray-400" : "font-semibold"}`}>Model</Label>
            <Switch checked={isPoses} onCheckedChange={handleTabChange} />
            <Label className={`text-sm ${!isPoses ? "text-gray-400" : "font-semibold"}`}>Poses</Label>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {currentTab === "model" ? (
            <ModelTab selectedVideo={selectedVideo} />
          ) : (
            <PosesTab video={selectedVideo} />
          )}
        </div>

        {/* Bottom bar with selectors */}
        {selectedVideo && metadata && (
          <div className="h-14 flex items-center justify-between px-4 border-t border-gray-300 shrink-0 gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className={`text-sm ${!isPoses ? "font-semibold" : "text-gray-400"}`}>Status:</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {statusLabels[opt]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className={`text-sm ${isPoses ? "font-semibold" : "text-gray-400"}`}>Pose:</Label>
                <Select value={pose} onValueChange={setPose}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select pose" />
                  </SelectTrigger>
                  <SelectContent>
                    {poseOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {poseLabels[opt]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSave}>Save</Button>
          </div>
        )}
      </div>
    </div>
  );
};
