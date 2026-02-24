import { useState, useEffect, type FC } from "react";
import type { CanvasType } from "@/types/CanvasType";
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
import { useKeyboardControl } from "@/hooks/useKeyboardControl";

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
  no_recon: "1. No FD Pose",
  pending: "2. Pending",
  wrong: "3. Wrong",
  almost: "4. Almost",
  approved: "5. Correct",
};


export const Tab: FC<TabProps> = ({ selectedVideo, metadata, onNextVideo }) => {
  const [currentTab, setCurrentTab] = useState<CanvasType>("model");
  const [status, setStatus] = useState(metadata?.status ?? "pending");
  const [pose, setPose] = useState(metadata?.pose ?? "pending");
  const [gripped, setGripped] = useState(metadata?.gripped ?? false);
  const { update } = useMetadata();
  const isPoses = currentTab === "poses";

  // Sync status and pose when metadata changes
  useEffect(() => {
    setStatus(metadata?.status ?? "pending");
    setPose(metadata?.pose ?? "pending");
    setGripped(metadata?.gripped ?? false);
  }, [metadata]);

  const handleTabChange = (checked: boolean) => {
    const newTab = checked ? "poses" : "model";
    setCurrentTab(newTab);
  };

  const updateDropdownState = (index: number) => {
    if (currentTab === "model") {
      setStatus(statusOptions[index - 1]);
    } else {
      setPose(poseOptions[index - 1]);
    }
  };

  const handleSave = async () => {
    if (!selectedVideo || !metadata) return;
    if (status !== metadata.status || pose !== metadata.pose || gripped !== metadata.gripped) {
      try {
        update(selectedVideo, { ...metadata, status, pose, gripped });
      } catch (error) {
        console.error("Error updating video metadata:", error);
      }
    }
  };
  useKeyboardControl({ handleSave, updateDropdownState, onNextVideo, toggleGripped: () => setGripped((v) => !v) });

  return (
    <div className="flex flex-col gap-6 max-w-none w-full h-full">
      <div className="w-full h-full border border-gray-300 rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-10 flex items-center justify-between px-4 shrink-0">
          <div className="text-xl font-semibold">{selectedVideo}</div>
          <div className="flex items-center gap-2">
            <Label
              className={`text-sm ${isPoses ? "text-gray-400" : "font-semibold"}`}
            >
              Model
            </Label>
            <Switch checked={isPoses} onCheckedChange={handleTabChange} />
            <Label
              className={`text-sm ${!isPoses ? "text-gray-400" : "font-semibold"}`}
            >
              Poses
            </Label>
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
                <Label
                  className={`text-sm ${!isPoses ? "font-semibold" : "text-gray-400"}`}
                >
                  Status:
                </Label>
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
                <Label
                  className={`text-sm ${isPoses ? "font-semibold" : "text-gray-400"}`}
                >
                  Pose:
                </Label>
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
              <div className="flex items-center gap-2">
                <Label className="text-sm">Gripped:</Label>
                <Switch checked={gripped} onCheckedChange={setGripped} />
              </div>
            </div>
            <Button onClick={handleSave}>Save</Button>
          </div>
        )}
      </div>
    </div>
  );
};
