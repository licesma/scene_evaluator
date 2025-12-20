import type { FC } from "react";
import type { TabType } from "@/types/Tab";
import "../App.css";
import "@google/model-viewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModelTab from "@/tabs/ModelTab";
import PosesTab from "@/tabs/PosesTab";

interface TabProps {
  selectedVideo: string | undefined;
  onTabChange: (tab: TabType) => void;
}

export const Tab: FC<TabProps> = ({ selectedVideo, onTabChange }) => {
  return (
    <div className="flex gap-6 max-w-none w-full">
      <Tabs
        defaultValue="model"
        className="w-full flex"
        onValueChange={(val: string) => onTabChange(val as TabType)}
      >
        <TabsList className="mx-auto">
          <TabsTrigger className="w-186 " value="model">
            Model
          </TabsTrigger>
          <TabsTrigger value="poses">Poses</TabsTrigger>
        </TabsList>
        <TabsContent value="model" className="w-full">
          <ModelTab selectedVideo={selectedVideo} />
        </TabsContent>
        <TabsContent value="poses">
          <PosesTab video={selectedVideo} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
