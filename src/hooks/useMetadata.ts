import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useFirestore } from "@/providers/FirestoreProvider";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { toast } from "sonner";

export function useMetadata() {
  const db = useFirestore();
  const queryClient = useQueryClient();
  const docRef = doc(db, "reconstructions", "metadata");

  const query = useQuery<Record<string, VideoMetadata>>({
    queryKey: ["reconstructions"],
    queryFn: async () => {
      const fireDoc = await getDoc(docRef);
      if (!fireDoc.exists()) throw new Error("no doc");
      return fireDoc.data() as Record<string, VideoMetadata>;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (args: { key: string; value: VideoMetadata }) => {
      const { key, value } = args;
      await updateDoc(docRef, { [key]: value });
    },
    onMutate: async ({ key, value }) => {
      await queryClient.cancelQueries({ queryKey: ["reconstructions"] });
      const previous = queryClient.getQueryData<Record<string, VideoMetadata>>([
        "reconstructions",
      ]);
      if (previous) {
        queryClient.setQueryData<Record<string, VideoMetadata>>(
          ["reconstructions"],
          { ...previous, [key]: value }
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["reconstructions"], context.previous);
      }
    },
    onSuccess: (_data, { key, value }) => {
      void queryClient.invalidateQueries({ queryKey: ["reconstructions"] });
      toast(`${key}'s status updated to ${value.status}`);
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (updates: Record<string, VideoMetadata>) => {
      await updateDoc(docRef, updates);
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["reconstructions"] });
      const previous = queryClient.getQueryData<Record<string, VideoMetadata>>([
        "reconstructions",
      ]);
      if (previous) {
        queryClient.setQueryData<Record<string, VideoMetadata>>(
          ["reconstructions"],
          { ...previous, ...updates }
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["reconstructions"], context.previous);
      }
    },
    onSuccess: (_data, updates) => {
      void queryClient.invalidateQueries({ queryKey: ["reconstructions"] });
      const count = Object.keys(updates).length;
      toast(`${count} video${count === 1 ? "" : "s"} updated`);
    },
  });

  return {
    ...query,
    getMetadata: (video?: string): VideoMetadata | undefined =>
      video ? query.data?.[video] : undefined,
    update: (key: string, value: VideoMetadata) =>
      updateMutation.mutateAsync({ key, value }),
    updateMany: (updates: Record<string, VideoMetadata>) =>
      updateManyMutation.mutateAsync(updates),
    updateMutation,
    updateManyMutation,
  };
}
