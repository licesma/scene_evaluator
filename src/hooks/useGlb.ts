import { useMetadata } from "@/hooks/useMetadata";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

export async function getGlbBlob(
  video: string,
  metadata: VideoMetadata
): Promise<Blob> {
  const response = await fetch(
    `https://openreal2sim.s3.us-west-2.amazonaws.com/${metadata.week}/${metadata.author}/${video}/reconstruction/scene.glb`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch glb");
  }
  return await response.blob();
}

export function useGlb(video?: string) {
  const { getMetadata } = useMetadata();
  const metadata = getMetadata(video);

  return useQuery({
    queryKey: ["glb", video],
    queryFn: () => getGlbBlob(video!, metadata!),
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
            queryFn: () => getGlbBlob(v, metadata),
            staleTime: Infinity,
          });
        }
      });
    }
  }, [queryClient, getMetadata, orderedVideos, selectedVideo, glbQuery.status]);
}
