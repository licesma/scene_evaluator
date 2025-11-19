import "../App.css";
import { ModelViewer } from "@/components/ModelViewer";
import "@google/model-viewer";
import { useEffect, useMemo } from "react";
import { useGlb } from "@/lib/glbQuery";
import type { FC } from "react";

interface ModelTabProps {
  selectedVideo: string | undefined;
}

const ModelTab: FC<ModelTabProps> = ({ selectedVideo }) => {
  const { data: glbBlob } = useGlb(selectedVideo);
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
    <>
      <ModelViewer
        src={blobUrl ?? (selectedVideo ? `scenes/${selectedVideo}.glb` : "")}
        alt="Reconstruction scenario"
      />
      <div style={{ marginTop: "20px" }}>
        <img
          src={
            selectedVideo
              ? `frames/${selectedVideo}.jpg`
              : "https://picsum.photos/400/300"
          }
          alt="Frame from selected video"
          style={{ maxWidth: "100%", height: "100%", maxHeight: "360px" }}
        />
      </div>
    </>
  );
};

export default ModelTab;
