import { useMemo, useRef, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";
import { useMetadata } from "@/hooks/useMetadata";
import type { VideoMetadata } from "@/types/VideoMetadata";
import type { ColDef } from "ag-grid-community";
import { LIGHT_BLUE, DARK_BLUE } from "@/constants";

ModuleRegistry.registerModules([AllCommunityModule]);

const customTheme = themeQuartz.withParams({
  headerBackgroundColor: "#ffffff",
  headerHeight: 40,
  backgroundColor: LIGHT_BLUE,
  selectedRowBackgroundColor: DARK_BLUE,
});

export interface UserInterface {
  author: string;
  name: string;
}

export interface UserGridProps {
  videos: Record<string, VideoMetadata>;
  onSelect: (name: string) => void;
  selectedVideo: string|undefined;
}

const UsersGrid = (props: UserGridProps) => {
  const { onSelect, videos, selectedVideo } = props;
  const { getMetadata } = useMetadata();
  const metadata = getMetadata(selectedVideo);
  const gridRef = useRef<AgGridReact>(null);
  const rowData = useMemo(
    () =>
      Object.keys(videos)
        .map((v) => ({ name: v }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [videos]
  );
  const [colDefs] = useState<ColDef<UserInterface>[]>([
    { field: "name", headerName: `${rowData.length} Reconstructions`, flex: 3, cellStyle: { textAlign: "left" }, headerClass: "text-[20px] font-bold" },
  ]);


  const handleRowSelection = () => {
    const api = gridRef.current?.api;
    const selectedNodes = api?.getSelectedNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      onSelect(rowData[selectedNodes[0].rowIndex || 0].name);
    }
  };

  // Sync grid selection when selectedVideo changes externally (e.g., via keyboard)
  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api || !selectedVideo) return;

    // Find the row node that matches selectedVideo
    let nodeToSelect: ReturnType<typeof api.getRowNode> | undefined;
    api.forEachNode((node) => {
      if (node.data?.name === selectedVideo) {
        nodeToSelect = node;
      }
    });

    if (nodeToSelect && !nodeToSelect.isSelected()) {
      nodeToSelect.setSelected(true, true);
      // Ensure the selected row is visible
      api.ensureNodeVisible(nodeToSelect, "middle");
    }
  }, [selectedVideo]);

  return (
    <div className="flex flex-col h-full min-h-0 w-full [&_.ag-row-selected_.ag-cell]:text-white gap-1">
      <div className="flex-1 min-h-0">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          theme={customTheme}
          rowSelection="single"
          onSelectionChanged={handleRowSelection}
          suppressCellFocus={true}
          suppressRowHoverHighlight={false}
        />
      </div>
      <div className="shrink-0 rounded-lg overflow-hidden">
       { selectedVideo && metadata ?  (<img
          src={
               `https://openreal2sim.s3.us-west-2.amazonaws.com/${metadata.week}/${metadata.author}/${selectedVideo}/source/000000.jpg`

          }
          alt="Frame from selected video"
          className="max-w-full max-h-[460px]"
        />):null}
      </div>
    </div>
  );
};

export default UsersGrid;
