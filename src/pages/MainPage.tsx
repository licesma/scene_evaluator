import React, { useState } from "react";
import "../App.css";
import "@google/model-viewer";
import UsersGrid from "@/components/UserGrid";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { StatusSelector } from "@/components/StatusSelector";
import { Tab } from "@/components/Tab";
import { ControlBar } from "@/components/ControlBar";
import type { TabType } from "@/types/Tab";
import type { AuthorType } from "@/types/Author";
import type { WeekType } from "@/types/Week";
import { usePrefetchGlb } from "@/hooks/useGlb";
import { type StatusType } from "@/types/Status";
import { Separator } from "@/components/ui/separator";
import { useMetadata } from "@/hooks/useMetadata";
import { PoseSelector } from "@/components/PoseSelector";

function filterVideos(
  allMetadata: Record<string, VideoMetadata>,
  selectedAuthor: AuthorType,
  selectedWeek: WeekType,
  selectedStatus: string
) {
  const filteredByAuthor =
    selectedAuthor !== "all"
      ? (Object.fromEntries(
          Object.entries(allMetadata).filter(
            ([_name, meta]) => meta.author == selectedAuthor
          )
        ) as Record<string, VideoMetadata>)
      : allMetadata;

  const filteredByWeek =
    selectedWeek !== "all"
      ? (Object.fromEntries(
          Object.entries(filteredByAuthor).filter(
            ([_name, meta]) => meta.week == selectedWeek
          )
        ) as Record<string, VideoMetadata>)
      : filteredByAuthor;

  const filteredByStatus =
    selectedStatus !== "all"
      ? (Object.fromEntries(
          Object.entries(filteredByWeek).filter(
            ([_name, meta]) => meta.status == selectedStatus
          )
        ) as Record<string, VideoMetadata>)
      : filteredByWeek;

  return filteredByStatus;
}

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
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorType>("all");
  const [selectedWeek, setSelectedWeek] = useState<WeekType>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusType>("all");

  const onSelectVideo = (videoName: string) => {
    setSelectedVideo(videoName);
  };

  const filteredVideos = React.useMemo(() => {
    return filterVideos(
      allMetadata,
      selectedAuthor,
      selectedWeek,
      selectedStatus
    );
  }, [allMetadata, selectedAuthor, selectedWeek, selectedStatus]);

  const orderedVideos = React.useMemo(() => {
    return Object.keys(filteredVideos).sort((a, b) => a.localeCompare(b));
  }, [filteredVideos]);

  React.useEffect(() => {
    console.log("elena", selectedTab, metadata, selectedVideo);
  });
  usePrefetchGlb(orderedVideos, selectedVideo);

  return (
    <div className="flex flex-col gap-6">
      <ControlBar
        selectedTab={selectedTab}
        onTabChange={(tab: TabType) => setSelectedTab(tab)}
        selectedAuthor={selectedAuthor}
        onAuthorChange={(author: AuthorType) => setSelectedAuthor(author)}
        selectedWeek={selectedWeek}
        onWeekChange={(week: WeekType) => setSelectedWeek(week)}
        selectedStatus={selectedStatus}
        onStatusChange={(status: StatusType) => setSelectedStatus(status)}
      />
      <Separator orientation="horizontal" />
      <div className="grid grid-flow-col grid-cols-[1fr_3fr] gap-[10px]">
        <div className="left-side">
          <UsersGrid videos={filteredVideos} onSelect={onSelectVideo} />
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
            videos={filteredVideos}
          />
        </div>
      </div>
    </div>
  );
};
