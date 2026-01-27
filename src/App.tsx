import "./App.css";
import "@google/model-viewer";
import { MainPage } from "@/pages/MainPage";
import { StatsPage } from "@/pages/StatsPage";
import { SamComparePage } from "@/pages/SamComparePage";
import { ManualMetadataPage } from "@/pages/ManualMetadataPage";
import { useMetadata } from "./hooks/useMetadata";
import type { AuthorType } from "@/types/Author";
import { type StatusType } from "@/types/Status";
import { Separator } from "@/components/ui/separator";
import { ControlBar } from "@/components/ControlBar";
import type { WeekType } from "@/types/Week";
import { useState, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { filterVideos } from "@/functions/filterVideos";

function App() {
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorType>("all");
  const [selectedWeek, setSelectedWeek] = useState<WeekType>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusType>("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data } = useMetadata();

  const filteredVideos = useMemo(() => {
    if (!data) return {};
    return filterVideos(data, selectedAuthor, selectedWeek, selectedStatus);
  }, [data, selectedAuthor, selectedWeek, selectedStatus]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="shrink-0 mb-2">
        <ControlBar showFilters={showFilters} onToggleFilters={() => setShowFilters(!showFilters)} />
        <Separator orientation="horizontal" />
      </div>
      <Routes>
        <Route
          path="/:videoId?"
          element={
            data ? (
              <div className="flex flex-col gap-4 h-full min-h-0 flex-1">
                <MainPage
                  allMetadata={filteredVideos}
                  selectedAuthor={selectedAuthor}
                  onAuthorChange={(author: AuthorType) => setSelectedAuthor(author)}
                  selectedWeek={selectedWeek}
                  onWeekChange={(week: WeekType) => setSelectedWeek(week)}
                  selectedStatus={selectedStatus}
                  onStatusChange={(status: StatusType) => setSelectedStatus(status)}
                  showFilters={showFilters}
                />
              </div>
            ) : null
          }
        />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/sam_compare" element={<SamComparePage />} />
        <Route path="/manual_metadata" element={<ManualMetadataPage />} />
      </Routes>
    </div>
  );
}

export default App;
