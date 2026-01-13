import { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";
import type { ColDef } from "ag-grid-community";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { Input } from "@/components/ui/input";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface MetadataRow {
  name: string;
  week: string;
  author: string;
  status: string;
  pose: string;
  prompt: string;
}

export interface MetadataTableProps {
  data: Record<string, VideoMetadata> | undefined;
  onSelect: (row: MetadataRow) => void;
}

export const MetadataTable = ({ data, onSelect }: MetadataTableProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const [filterText, setFilterText] = useState("");

  const colDefs = useMemo<ColDef<MetadataRow>[]>(
    () => [
      { field: "name", flex: 2, cellStyle: { textAlign: "left" } },
      { field: "week", flex: 1, cellStyle: { textAlign: "left" } },
      { field: "author", flex: 1, cellStyle: { textAlign: "left" } },
      { field: "status", flex: 1, cellStyle: { textAlign: "left" } },
      { field: "pose", flex: 1, cellStyle: { textAlign: "left" } },
    ],
    []
  );

  const rowData = useMemo<MetadataRow[]>(() => {
    if (!data) return [];
    return Object.entries(data)
      .map(([name, meta]) => ({
        name,
        week: meta.week || "",
        author: meta.author || "",
        status: meta.status || "",
        pose: meta.pose || "",
        prompt: meta.prompt || "",
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const filteredRowData = useMemo(() => {
    if (!filterText.trim()) return rowData;
    const lowerFilter = filterText.toLowerCase();
    return rowData.filter((row) =>
      row.name.toLowerCase().includes(lowerFilter)
    );
  }, [rowData, filterText]);

  const handleRowSelection = () => {
    const api = gridRef.current?.api;
    const selectedNodes = api?.getSelectedNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      const selectedRow = selectedNodes[0].data as MetadataRow;
      onSelect(selectedRow);
    }
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-left font-bold text-xl text-gray-800">
          {filteredRowData.length} of {rowData.length} Entries
        </h2>
        <Input
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter by name..."
          className="w-64 bg-slate-200/50 border-slate-700 text-slate-700 placeholder:text-slate-500"
        />
      </div>
      <div style={{ height: 600 }}>
        <AgGridReact
          ref={gridRef}
          rowData={filteredRowData}
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
