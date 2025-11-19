import { useState, useEffect } from "react";
import "./App.css";
import "@google/model-viewer";
import type { VideoMetadata } from "./types/VideoMetadata";
import { MainPage } from "@/pages/MainPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const [allMetadata, setAllMetadata] = useState<Record<string, VideoMetadata>>(
    {}
  );

  const updateAllMetadata = (name: string, patch: Partial<VideoMetadata>) => {
    setAllMetadata((prev) => ({
      ...prev,
      [name]: { ...prev[name], ...patch },
    }));
  };

  useEffect(() => {
    fetch("/api/videos/metadata")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch metadata");
        return response.json();
      })
      .then((data) => {
        setAllMetadata(data);
      })
      .catch((error) => console.error("Error fetching metadata:", error));
  }, []);

  return allMetadata ? (
    <QueryClientProvider client={queryClient}>
      <MainPage
        allMetadata={allMetadata}
        updateAllMetadata={updateAllMetadata}
      />
    </QueryClientProvider>
  ) : null;
}

export default App;
