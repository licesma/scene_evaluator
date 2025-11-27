import { useMetadata } from "@/hooks/useMetadata";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export async function getObjectsIndex(
  video: string,
  metadata: VideoMetadata
): Promise<string[]> {
  const response = await fetch(
    `https://openreal2sim.s3.us-west-2.amazonaws.com/${metadata.week}/${metadata.author}/${video}/reconstruction/objects/index.json`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch objects index");
  }
  return (await response.json()) as string[];
}

export function usePosesIndex(video?: string) {
  const { getMetadata } = useMetadata();
  const metadata = getMetadata(video);

  return useQuery({
    queryKey: ["posesIndex", video],
    queryFn: () => getObjectsIndex(video!, metadata!),
    enabled: !!video && !!metadata,
    staleTime: Infinity,
  });
}

function buildPoseUrl(
  name: string,
  video: string,
  metadata: VideoMetadata
): string {
  return `https://openreal2sim.s3.us-west-2.amazonaws.com/${metadata.week}/${metadata.author}/${video}/reconstruction/objects/${name}`;
}

export function usePoses(video?: string) {
  const { getMetadata } = useMetadata();
  const metadata = getMetadata(video);
  const posesIndexQuery = usePosesIndex(video);

  useEffect(() => {
    console.log(
      "Dilara",
      posesIndexQuery.data?.map((name) => buildPoseUrl(name, video!, metadata!))
    );
  });

  return useQuery({
    queryKey: ["poses", video],
    queryFn: async () => {
      const names = posesIndexQuery.data!;
      const urls = names.map((name) => buildPoseUrl(name, video!, metadata!));
      return urls;
    },
    enabled:
      !!video &&
      !!metadata &&
      posesIndexQuery.status === "success" &&
      !!posesIndexQuery.data,
    staleTime: Infinity,
  });
}
