import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";
import "@google/model-viewer";
import UsersGrid from "@/components/UserGrid";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { Tab } from "@/components/Tab";
import { usePrefetchGlb } from "@/hooks/useGlb";
import { useMetadata } from "@/hooks/useMetadata";
import type { AuthorType } from "@/types/Author";
import { authors } from "@/types/Author";
import type { WeekType } from "@/types/Week";
import { weeks } from "@/types/Week";
import { status, type StatusType } from "@/types/Status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface MainPageProps {
  allMetadata: Record<string, VideoMetadata>;
  selectedAuthor: AuthorType;
  onAuthorChange: (author: AuthorType) => void;
  selectedWeek: WeekType;
  onWeekChange: (week: WeekType) => void;
  selectedStatus: StatusType;
  onStatusChange: (status: StatusType) => void;
  showFilters: boolean;
}

export const MainPage: React.FC<MainPageProps> = ({
  allMetadata,
  selectedAuthor,
  onAuthorChange,
  selectedWeek,
  onWeekChange,
  selectedStatus,
  onStatusChange,
  showFilters,
}) => {
  const { getMetadata } = useMetadata();
  const { videoId } = useParams<{ videoId?: string }>();
  const navigate = useNavigate();
  
  const selectedVideo = videoId;
  const metadata = getMetadata(selectedVideo);

  const onSelectVideo = (videoName: string) => {
    navigate(`/${videoName}`);
  };

  const orderedVideos = React.useMemo(() => {
    return Object.keys(allMetadata).sort((a, b) => a.localeCompare(b));
  }, [allMetadata]);

  usePrefetchGlb(orderedVideos, selectedVideo);

  return (
    <div className="grid grid-flow-col grid-cols-[1fr_3fr] gap-[10px] h-full min-h-0 flex-1">
      <div className="left-side">
        <div className="flex h-full min-h-0">
          {showFilters && (
            <div className="flex flex-col gap-4 pr-4 shrink-0">
              <div>Filters</div>
              <div className="flex flex-col gap-1">
                <Label className="ml-2">Author</Label>
                <Select
                  defaultValue={selectedAuthor ?? authors[0]}
                  onValueChange={(value) => onAuthorChange(value as AuthorType)}
                >
                  <SelectTrigger className="w-32" aria-label="Select author">
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((author) => (
                      <SelectItem key={author} value={author}>
                        {author.charAt(0).toUpperCase() + author.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="ml-2">Week</Label>
                <Select
                  defaultValue={selectedWeek ?? weeks["all"]}
                  onValueChange={(value) => onWeekChange(value as WeekType)}
                >
                  <SelectTrigger className="w-32" aria-label="Select week">
                    <SelectValue placeholder="Select week" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(weeks).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="ml-2">Status</Label>
                <Select
                  defaultValue={selectedStatus ?? status["all"]}
                  onValueChange={(value) => onStatusChange(value as StatusType)}
                >
                  <SelectTrigger className="w-32" aria-label="Select status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(status).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <UsersGrid videos={allMetadata} onSelect={onSelectVideo} selectedVideo={selectedVideo}/>
        </div>
      </div>
      <div className="grid">
        <Tab
          selectedVideo={selectedVideo}
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
      </div>
    </div>
  );
};
