import { usePoses } from "@/hooks/usePoses";
import type { FC } from "react";

interface PosesTabProps {
  video?: string;
}

const PosesTab: FC<PosesTabProps> = ({ video }) => {
  const { data } = usePoses(video);
  return (
    <div className="mt-0 flex flex-row flex-wrap gap-2">
      {data && 0 < data.length
        ? data.map((url) => (
            <video
              autoPlay
              loop
              key={url}
              controls
              src={url}
              style={{ maxWidth: "100%" }}
            />
          ))
        : null}
    </div>
  );
};

export default PosesTab;
