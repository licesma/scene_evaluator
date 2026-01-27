import { useMetadata } from "@/hooks/useMetadata";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useObjectModel, type ObjectModelType } from "@/providers/ObjectModelProvider";
import React from "react";

export async function getGlbBlob(
  video: string,
  metadata: VideoMetadata,
  objectModel: ObjectModelType
): Promise<Blob> {
  const bucket = objectModel === "hunyuan" ? "openreal2sim" : "openreal2sim-sam"
  console.log("cons", bucket)
  const response = await fetch(
    `https://${bucket}.s3.us-west-2.amazonaws.com/${metadata.week}/${metadata.author}/${video}/reconstruction/scene.glb`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch glb");
  }
  return await response.blob();
}

export function useGlb(video?: string) {
  const { getMetadata } = useMetadata();
  const {model: objectModel} = useObjectModel();
  const metadata = getMetadata(video);

  return useQuery({
    queryKey: ["glb", objectModel, video],
    queryFn: () => getGlbBlob(video!, metadata!, objectModel),
    enabled: !!video && !!metadata,
    staleTime: Infinity,
    retry: false,
  });
}

export function usePrefetchGlb(
  orderedVideos: string[],
  selectedVideo?: string
) {
  const queryClient = useQueryClient();
  const {model: objectModel} = useObjectModel();
  const { getMetadata } = useMetadata();
  const glbQuery = useGlb(selectedVideo);

  React.useEffect(() => {
    if (selectedVideo && glbQuery.status === "success") {
      const idx = orderedVideos.indexOf(selectedVideo);

      const toPrefetch = orderedVideos.slice(idx + 1, idx + 4);
      toPrefetch.forEach((v) => {
        const metadata = getMetadata(v);

        if (metadata) {
          queryClient.prefetchQuery({
            queryKey: ["glb", v],
            queryFn: () => getGlbBlob(v, metadata, objectModel),
            staleTime: Infinity,
          });
        }
      });
    }
  }, [queryClient, getMetadata, orderedVideos, selectedVideo, glbQuery.status]);
}
