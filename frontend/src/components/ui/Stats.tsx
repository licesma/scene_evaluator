import type { FC } from "react";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { authors } from "@/types/Author";
import { status, type StatusType } from "@/types/Status";

interface StatsProps {
  videos: Record<string, VideoMetadata>;
  label?: string;
}

const Stats: FC<StatsProps> = ({ videos, label }) => {
  const trackedAuthors = authors.filter((a) => a !== "all");
  const statusLabelByKey = {
    pending: "Pending",
    object: "Wrong objects",
    pose: "Wrong pose",
    approved: "Approved",
  } as const;
  const statusKeys = Object.keys(status) as Array<StatusType>;

  return (
    <div>
      <h2 className="text-center font-bold text-[28px]">Stats</h2>
      {label && <div className="text-center font-semibold">{label}</div>}
      <div className="text-left text-[20px] ml-72">Authors</div>
      <div className="flex justify-center gap-8">
        {trackedAuthors.map((author) => {
          const count = Object.values(videos).filter(
            (m) => (m.author || "").toLowerCase() === author
          ).length;
          return (
            <div
              key={author}
              className="flex flex-col items-center text-center"
            >
              <div className="capitalize">{author}</div>
              <div className="text-xl font-bold">{count}</div>
            </div>
          );
        })}
      </div>
      <div className="text-left text-[20px] ml-72 mt-6">Status</div>
      <div className="flex justify-center gap-8">
        {statusKeys.map((key) => {
          const count = Object.values(videos).filter(
            (m) => (m.status || "").toLowerCase() === key
          ).length;
          return (
            <div key={key} className="flex flex-col items-center text-center">
              <div>{status[key]}</div>
              <div className="text-xl font-bold">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stats;
