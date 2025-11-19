import type { FC } from "react";
import type { TabType } from "@/types/Tab";
import "../App.css";
import { ModelViewer } from "@/components/ModelViewer";
import "@google/model-viewer";
import { useEffect, useMemo } from "react";
import { useGlb } from "@/lib/glbQuery";
import Stats from "./ui/Stats";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModelTab from "@/tabs/ModelTab";

interface TabProps {
  selectedVideo: string | undefined;
  videos: Record<string, VideoMetadata>;
  mp4s: string[];
  type: TabType;
}

export const Tab: FC<TabProps> = ({ mp4s, videos, selectedVideo }) => {
  return (
    <div className="flex gap-6 max-w-none w-full">
      <Tabs defaultValue="model" className="w-full flex">
        <TabsList className="mx-auto">
          <TabsTrigger className="w-186 " value="model">
            Model
          </TabsTrigger>
          <TabsTrigger value="poses">Poses</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="model" className="w-full">
          <ModelTab selectedVideo={selectedVideo} />
        </TabsContent>
        <TabsContent value="poses">
          {mp4s.length > 0 ? (
            <div className="mt-0 flex flex-row flex-wrap gap-2">
              {mp4s.map((file) => (
                <video
                  autoPlay
                  loop
                  key={file}
                  controls
                  src={`poses/${selectedVideo}/${file}`}
                  style={{ maxWidth: "100%" }}
                />
              ))}
            </div>
          ) : null}
        </TabsContent>
        <TabsContent value="stats">
          <Stats videos={videos} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
