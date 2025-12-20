import React, { useState } from "react";
import "../App.css";
import "@google/model-viewer";
import UsersGrid from "@/components/UserGrid";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { StatusSelector } from "@/components/StatusSelector";
import { Tab } from "@/components/Tab";
import type { TabType } from "@/types/Tab";
import { usePrefetchGlb } from "@/hooks/useGlb";
import { useMetadata } from "@/hooks/useMetadata";
import { PoseSelector } from "@/components/PoseSelector";

export interface MainPageProps {
  allMetadata: Record<string, VideoMetadata>;
}

export const MainPage: React.FC<MainPageProps> = ({ allMetadata }) => {
  const { getMetadata } = useMetadata();
  const [selectedVideo, setSelectedVideo] = useState<string | undefined>(
    undefined
  );
  const metadata = getMetadata(selectedVideo);
  const [selectedTab, setSelectedTab] = useState<TabType>("model");

  const onSelectVideo = (videoName: string) => {
    setSelectedVideo(videoName);
  };

  const orderedVideos = React.useMemo(() => {
    return Object.keys(allMetadata).sort((a, b) => a.localeCompare(b));
  }, [allMetadata]);

  usePrefetchGlb(orderedVideos, selectedVideo);

  return (
    <div className="grid grid-flow-col grid-cols-[1fr_3fr] gap-[10px]">
      <div className="left-side">
        <UsersGrid videos={allMetadata} onSelect={onSelectVideo} />
        {selectedVideo && metadata && selectedTab === "model" ? (
          <StatusSelector
            name={selectedVideo}
            metadata={metadata}
            onNextVideo={() => {
              if (!selectedVideo) return;
              const idx = orderedVideos.indexOf(selectedVideo);
              if (idx === -1) return;
              const hasNext = idx + 1 < orderedVideos.length;
              if (hasNext) {
                onSelectVideo(orderedVideos[idx + 1]);
              }
            }}
          />
        ) : selectedVideo && metadata && selectedTab === "poses" ? (
          <PoseSelector
            name={selectedVideo}
            metadata={metadata}
            onNextVideo={() => {
              if (!selectedVideo) return;
              const idx = orderedVideos.indexOf(selectedVideo);
              if (idx === -1) return;
              const hasNext = idx + 1 < orderedVideos.length;
              if (hasNext) {
                onSelectVideo(orderedVideos[idx + 1]);
              }
            }}
          />
        ) : null}
      </div>
      <div className="grid">
        <Tab
          selectedVideo={selectedVideo}
          onTabChange={(tab: TabType) => setSelectedTab(tab)}
        />
      </div>
    </div>
  );
};
