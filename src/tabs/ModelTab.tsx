import "../App.css";
import { ModelViewer } from "@/components/ModelViewer";
import "@google/model-viewer";
import { useEffect, useMemo } from "react";
import { useGlb } from "@/hooks/useGlb";
import type { FC } from "react";
import { useMetadata } from "@/hooks/useMetadata";

interface ModelTabProps {
  selectedVideo: string | undefined;
}

const ModelTab: FC<ModelTabProps> = ({ selectedVideo }) => {
  const { data: glbBlob } = useGlb(selectedVideo);
  const { getMetadata } = useMetadata();
  const metadata = getMetadata(selectedVideo);
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
      <ModelViewer
        src={blobUrl ?? (selectedVideo ? `scenes/${selectedVideo}.glb` : "")}
        alt="Reconstruction scenario"
      />
      <div style={{ marginTop: "20px" }}>
        <img
          src={
            selectedVideo && metadata
              ? `https://openreal2sim.s3.us-west-2.amazonaws.com/${metadata.week}/${metadata.author}/${selectedVideo}/source/000000.jpg`
              : "https://picsum.photos/400/300"
          }
          alt="Frame from selected video"
          style={{ maxWidth: "100%", height: "100%", maxHeight: "360px" }}
        />
      </div>
    </div>
  );
};

export default ModelTab;
