import { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";
import type { VideoMetadata } from "@/types/VideoMetadata";
import type { ColDef } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface UserInterface {
  author: string;
  name: string;
}

export interface UserGridProps {
  videos: Record<string, VideoMetadata>;
  onSelect: (name: string) => void;
}

const UsersGrid = (props: UserGridProps) => {
  const { onSelect, videos } = props;
  const gridRef = useRef<AgGridReact>(null);
  const [colDefs] = useState<ColDef<UserInterface>[]>([
    { field: "name", flex: 3, cellStyle: { textAlign: "left" } },
  ]);
  const rowData = useMemo(
    () => Object.keys(videos).map((v) => ({ name: v })),
    [videos]
  );

  const handleRowSelection = () => {
    const api = gridRef.current?.api;
    const selectedNodes = api?.getSelectedNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      onSelect(rowData[selectedNodes[0].rowIndex || 0].name);
    }
  };

  return (
    <div>
      <h2 className="text-left font-bold text-[28px]">
        {rowData.length} Reconstructions
      </h2>
      <div style={{ height: 400 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          theme={themeQuartz}
          rowSelection="single"
          onSelectionChanged={handleRowSelection}
          suppressCellFocus={true}
          suppressRowHoverHighlight={false}
        />
      </div>
    </div>
  );
};

export default UsersGrid;
