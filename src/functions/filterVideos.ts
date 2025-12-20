import "../App.css";
import "@google/model-viewer";
import type { VideoMetadata } from "@/types/VideoMetadata";
import type { AuthorType } from "@/types/Author";
import type { WeekType } from "@/types/Week";

export function filterVideos(
    allMetadata: Record<string, VideoMetadata>,
    selectedAuthor: AuthorType,
    selectedWeek: WeekType,
    selectedStatus: string
) {
    const filteredByAuthor =
        selectedAuthor !== "all"
            ? (Object.fromEntries(
                Object.entries(allMetadata).filter(
                    ([_name, meta]) => meta.author == selectedAuthor
                )
            ) as Record<string, VideoMetadata>)
            : allMetadata;

    const filteredByWeek =
        selectedWeek !== "all"
            ? (Object.fromEntries(
                Object.entries(filteredByAuthor).filter(
                    ([_name, meta]) => meta.week == selectedWeek
                )
            ) as Record<string, VideoMetadata>)
            : filteredByAuthor;

    const filteredByStatus =
        selectedStatus !== "all"
            ? (Object.fromEntries(
                Object.entries(filteredByWeek).filter(
                    ([_name, meta]) => meta.status == selectedStatus
                )
            ) as Record<string, VideoMetadata>)
            : filteredByWeek;

    return filteredByStatus;
}