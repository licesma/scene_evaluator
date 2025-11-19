import React, { useEffect, useState } from "react";
import "../App.css";
import "@google/model-viewer";
import UsersGrid from "@/components/UserGrid";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { VideoInfo } from "@/components/VideoInfo";
import { Tab } from "@/components/Tab";
import { ControlBar } from "@/components/ControlBar";
import type { TabType } from "@/types/Tab";
import type { AuthorType } from "@/types/Author";
import type { WeekType } from "@/types/Week";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchGlb } from "@/lib/glbQuery";
import { useGlb } from "@/lib/glbQuery";
import { status, type StatusType } from "@/types/Status";
import { Separator } from "@/components/ui/separator";

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
  updateAllMetadata: (name: string, patch: Partial<VideoMetadata>) => void;
}

export const MainPage: React.FC<MainPageProps> = ({
  allMetadata,
  updateAllMetadata,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | undefined>(
    undefined
  );
  const [selectedMetadata, setSelectedMetadata] = useState<
    VideoMetadata | undefined
  >(undefined);
  const [mp4s, setMp4s] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabType>("model");
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorType>("all");
  const [selectedWeek, setSelectedWeek] = useState<WeekType>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusType>("all");

  const queryClient = useQueryClient();
  const { status: currentGlbStatus } = useGlb(selectedVideo);

  const onSelectVideo = (videoName: string) => {
    setSelectedVideo(videoName);
    // Update videoStatus from allMetadata if available
    setSelectedMetadata(allMetadata[videoName]);
  };

  useEffect(() => {
    if (!selectedVideo) {
      setMp4s([]);
      return;
    }
    fetch(`/api/poses/list?video=${encodeURIComponent(selectedVideo)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch mp4 list");
        return res.json();
      })
      .then((data: { mp4s: string[] }) => {
        setMp4s(Array.isArray(data.mp4s) ? data.mp4s : []);
      })
      .catch(() => setMp4s([]));
  }, [selectedVideo]);

  const filteredVideos = React.useMemo(() => {
    return filterVideos(
      allMetadata,
      selectedAuthor,
      selectedWeek,
      selectedStatus
    );
  }, [allMetadata, selectedAuthor, selectedWeek]);

  const orderedVideos = React.useMemo(() => {
    return Object.keys(filteredVideos);
  }, [filteredVideos]);

  useEffect(() => {
    if (!selectedVideo) return;
    if (currentGlbStatus !== "success") return;
    const idx = orderedVideos.indexOf(selectedVideo);
    if (idx === -1) return;
    const toPrefetch = orderedVideos.slice(idx + 1, idx + 4);
    toPrefetch.forEach((v) => prefetchGlb(queryClient, v));
  }, [queryClient, orderedVideos, selectedVideo, currentGlbStatus]);

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
          {selectedVideo && selectedMetadata ? (
            <VideoInfo
              name={selectedVideo}
              data={selectedMetadata}
              updateAllMetadata={updateAllMetadata}
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
            type={selectedTab}
            selectedVideo={selectedVideo}
            mp4s={mp4s}
            videos={filteredVideos}
          />
        </div>
      </div>
    </div>
  );
};
