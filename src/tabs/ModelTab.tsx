import "../App.css";
import { ModelViewer } from "@/components/ModelViewer";
import "@google/model-viewer";
import { useEffect, useMemo } from "react";
import { useGlb } from "@/hooks/useGlb";
import type { FC } from "react";

interface ModelTabProps {
  selectedVideo: string | undefined;
}

const ModelTab: FC<ModelTabProps> = ({ selectedVideo }) => {
  const { data: glbBlob, isLoading } = useGlb(selectedVideo);
  const blobUrl = useMemo(
    () => (glbBlob ? URL.createObjectURL(glbBlob) : undefined),
    [glbBlob]
  );

  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);
  return (
    <div className="h-full">
      {blobUrl || isLoading ? (
        <ModelViewer src={blobUrl ?? ""} alt="Reconstruction scenario" />
      ) : (
        <div className="w-full h-full bg-black text-white flex items-center justify-center text-center text-2xl">
          No Reconstruction
        </div>
      )}
    </div>
  );
};

export default ModelTab;
