import { useQuery, QueryClient } from "@tanstack/react-query";

export async function getGlbBlob(video: string): Promise<Blob> {
  const response = await fetch(`scenes/${video}.glb`);
  if (!response.ok) {
    throw new Error("Failed to fetch glb");
  }
  return await response.blob();
}

export function useGlb(video?: string) {
  return useQuery({
    queryKey: ["glb", video],
    queryFn: () => getGlbBlob(video as string),
    enabled: !!video,
    staleTime: Infinity,
  });
}

export function prefetchGlb(queryClient: QueryClient, video: string) {
  return queryClient.prefetchQuery({
    queryKey: ["glb", video],
    queryFn: () => getGlbBlob(video),
    staleTime: Infinity,
  });
}
