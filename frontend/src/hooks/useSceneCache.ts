import { useEffect } from "react";

export function useModelPrefetcherCache(files: string[], currentIndex: number) {
    useEffect(() => {
        const prefetch = async () => {
            const cache = await caches.open("scene_files"); // persistent storage
            const nextFiles = [files[currentIndex], files[currentIndex + 1], files[currentIndex + 2]]
                .filter(Boolean);

            for (const url of nextFiles) {
                const match = await cache.match(url);
                if (!match) {
                    try {
                        const resp = await fetch(url, { credentials: "same-origin" });
                        if (resp.ok) await cache.put(url, resp.clone());
                    } catch { }
                }
            }

            const keys = await cache.keys();
            if (10 < keys.length) {
                await cache.delete(keys[0]);
            }
        };

        prefetch();
    }, [files, currentIndex]);

    useEffect(() => {
        const logCache = async () => {
            const cache = await caches.open("scene_files");
            const keys = await cache.keys();
            console.log(
                "🗂️ Cached models:",
                keys.map((req) => req.url.replace(window.location.origin, ""))
            );
        };
        logCache();
    }, [files, currentIndex]);
}