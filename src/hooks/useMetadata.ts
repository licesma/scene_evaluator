import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { useFirestore } from "@/providers/FirestoreProvider";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { toast } from "sonner";
import { FIREBASE_COLLECTION, HUNYUAN_DOCUMENT, SAM_DOCUMENT } from "@/constants";
import { useObjectModel } from "@/providers/ObjectModelProvider";

export const KEY = "reconstructions";

export function useMetadata() {
  const db = useFirestore();
  const queryClient = useQueryClient();
  const { model } = useObjectModel();
  const documentId = model === "sam" ? SAM_DOCUMENT : HUNYUAN_DOCUMENT;
  const docRef = doc(db, FIREBASE_COLLECTION, documentId);
  const queryKey = [KEY, model];

  const query = useQuery<Record<string, VideoMetadata>>({
    queryKey,
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
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Record<string, VideoMetadata>>(
        queryKey
      );
      if (previous) {
        queryClient.setQueryData<Record<string, VideoMetadata>>(
          queryKey,
          { ...previous, [key]: value }
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSuccess: (_data, { key, value }) => {
      void queryClient.invalidateQueries({ queryKey });
      toast(`${key}'s status updated to ${value.status}`);
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (updates: Record<string, VideoMetadata>) => {
      await updateDoc(docRef, updates);
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Record<string, VideoMetadata>>(
        queryKey
      );
      if (previous) {
        queryClient.setQueryData<Record<string, VideoMetadata>>(
          queryKey,
          { ...previous, ...updates }
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSuccess: (_data, updates) => {
      void queryClient.invalidateQueries({ queryKey });
      const count = Object.keys(updates).length;
      toast(`${count} video${count === 1 ? "" : "s"} updated`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (key: string) => {
      await updateDoc(docRef, { [key]: deleteField() });
    },
    onMutate: async (key) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Record<string, VideoMetadata>>(
        queryKey
      );
      if (previous) {
        const { [key]: _, ...rest } = previous;
        queryClient.setQueryData<Record<string, VideoMetadata>>(
          queryKey,
          rest
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSuccess: (_data, key) => {
      void queryClient.invalidateQueries({ queryKey });
      toast(`${key} deleted`);
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
    delete: (key: string) => deleteMutation.mutateAsync(key),
    updateMutation,
    updateManyMutation,
    deleteMutation,
  };
}
