import type { FC } from "react";
import Stats from "@/components/Stats";
import { useMetadata } from "@/hooks/useMetadata";

export const StatsPage: FC = () => {
  const { data } = useMetadata();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Stats videos={data} />
    </div>
  );
};
