import type { FC } from "react";
import Stats from "@/components/ui/Stats";
import { useMetadata } from "@/hooks/useMetadata";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const StatsPage: FC = () => {
  const { data } = useMetadata();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <Button asChild>
          <Link to="/">← Back to Main</Link>
        </Button>
      </div>
      <Stats videos={data} />
    </div>
  );
};

