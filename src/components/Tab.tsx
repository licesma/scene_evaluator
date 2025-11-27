import type { FC } from "react";
import type { TabType } from "@/types/Tab";
import "../App.css";
import "@google/model-viewer";
import Stats from "./ui/Stats";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModelTab from "@/tabs/ModelTab";
import PosesTab from "@/tabs/PosesTab";

interface TabProps {
  selectedVideo: string | undefined;
  videos: Record<string, VideoMetadata>;
  type: TabType;
}

export const Tab: FC<TabProps> = ({ videos, selectedVideo }) => {
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
          <PosesTab video={selectedVideo} />
        </TabsContent>
        <TabsContent value="stats">
          <Stats videos={videos} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
