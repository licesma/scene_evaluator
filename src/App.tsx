import "./App.css";
import "@google/model-viewer";
import { MainPage } from "@/pages/MainPage";
import { StatsPage } from "@/pages/StatsPage";
import { useMetadata } from "./hooks/useMetadata";
import type { TabType } from "@/types/Tab";
import type { AuthorType } from "@/types/Author";
import { type StatusType } from "@/types/Status";
import { Separator } from "@/components/ui/separator";
import { ControlBar } from "@/components/ControlBar";
import type { WeekType } from "@/types/Week";
import { useState, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { filterVideos } from "@/functions/filterVideos";

function App() {
  const [selectedTab, setSelectedTab] = useState<TabType>("model");
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorType>("all");
  const [selectedWeek, setSelectedWeek] = useState<WeekType>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusType>("all");

  const { data } = useMetadata();

  const filteredVideos = useMemo(() => {
    if (!data) return {};
    return filterVideos(data, selectedAuthor, selectedWeek, selectedStatus);
  }, [data, selectedAuthor, selectedWeek, selectedStatus]);

  if (!data) {
    return null;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex flex-col gap-4">
            <div>
              <ControlBar
                selectedTab={selectedTab}
                onTabChange={(tab: TabType) => setSelectedTab(tab)}
                selectedAuthor={selectedAuthor}
                onAuthorChange={(author: AuthorType) =>
                  setSelectedAuthor(author)
                }
                selectedWeek={selectedWeek}
                onWeekChange={(week: WeekType) => setSelectedWeek(week)}
                selectedStatus={selectedStatus}
                onStatusChange={(status: StatusType) =>
                  setSelectedStatus(status)
                }
              />
              <Separator orientation="horizontal" />
            </div>
            <MainPage allMetadata={filteredVideos} />
          </div>
        }
      />
      <Route path="/stats" element={<StatsPage />} />
    </Routes>
  );
}

export default App;
