import type { FC } from "react";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { authors } from "@/types/Author";
import { status, type StatusType } from "@/types/Status";
import { pose, type PoseType } from "@/types/Pose";

interface StatsProps {
  videos: Record<string, VideoMetadata>;
  label?: string;
}

const Stats: FC<StatsProps> = ({ videos, label }) => {
  const trackedAuthors = authors.filter((a) => a !== "all");
  const videoList = Object.values(videos);

  // Filter status keys to exclude "all"
  const statusKeys = (Object.keys(status) as Array<StatusType>).filter(
    (k) => k !== "all"
  );
  const poseKeys = Object.keys(pose) as Array<PoseType>;

  // Calculate counts and percentages for a given author and category type
  const calculateStats = (
    authorName: string | null,
    categoryKeys: string[],
    propertyName: "status" | "pose"
  ): Array<{ count: number; percentage: number }> => {
    // Filter videos by author (null means ALL)
    const filteredVideos = authorName
      ? videoList.filter((v) => (v.author || "").toLowerCase() === authorName)
      : videoList;

    // Count occurrences for each category
    const counts = categoryKeys.map(
      (key) =>
        filteredVideos.filter(
          (v) => (v[propertyName] || "").toLowerCase() === key
        ).length
    );

    // Calculate total
    const total = counts.reduce((sum, count) => sum + count, 0);

    // Convert to counts and percentages
    return counts.map((count) => ({
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  };

  // Calculate combined stats (approved = status AND pose both approved)
  const calculateCombinedStats = (
    authorName: string | null
  ): Array<{ count: number; percentage: number }> => {
    // Filter videos by author (null means ALL)
    const filteredVideos = authorName
      ? videoList.filter((v) => (v.author || "").toLowerCase() === authorName)
      : videoList;

    const total = filteredVideos.length;

    // Count approved (both status and pose are "approved")
    const approvedCount = filteredVideos.filter(
      (v) =>
        (v.status || "").toLowerCase() === "approved" &&
        (v.pose || "").toLowerCase() === "approved"
    ).length;

    // Count not approved (everything else)
    const notApprovedCount = total - approvedCount;

    return [
      {
        count: approvedCount,
        percentage: total > 0 ? (approvedCount / total) * 100 : 0,
      },
      {
        count: notApprovedCount,
        percentage: total > 0 ? (notApprovedCount / total) * 100 : 0,
      },
    ];
  };

  // Calculate stats for ALL and each author
  const allStatusStats = calculateStats(null, statusKeys, "status");
  const allPoseStats = calculateStats(null, poseKeys, "pose");
  const allCombinedStats = calculateCombinedStats(null);

  const authorStatusStats = trackedAuthors.map((author) =>
    calculateStats(author, statusKeys, "status")
  );
  const authorPoseStats = trackedAuthors.map((author) =>
    calculateStats(author, poseKeys, "pose")
  );
  const authorCombinedStats = trackedAuthors.map((author) =>
    calculateCombinedStats(author)
  );

  return (
    <div className="px-4">
      <h2 className="text-center font-bold text-[28px] mb-4">Stats</h2>
      {label && <div className="text-center font-semibold mb-4">{label}</div>}

      <div className="flex justify-center">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 border-r-4 px-4 py-2 bg-gray-100 font-bold">
                Category
              </th>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-bold">
                All
              </th>
              {trackedAuthors.map((author) => (
                <th
                  key={author}
                  className="border border-gray-300 px-4 py-2 bg-gray-100 font-bold capitalize"
                >
                  {author}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Status Section Header */}
            <tr>
              <td
                colSpan={2 + trackedAuthors.length}
                className="border border-gray-300 px-4 py-0 bg-gray-200 font-bold text-center"
              >
                Status
              </td>
            </tr>
            {/* Status Rows */}
            {statusKeys.map((key, idx) => (
              <tr key={`status-${key}`}>
                <td
                  className={`border border-gray-300 border-r-4 px-4 py-2 ${
                    key === "approved" ? "bg-green-50" : ""
                  }`}
                >
                  {status[key]}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 text-right font-bold ${
                    key === "approved" ? "bg-green-50" : ""
                  }`}
                >
                  {allStatusStats[idx].count} (
                  {allStatusStats[idx].percentage.toFixed(1)}%)
                </td>
                {trackedAuthors.map((author, authorIdx) => (
                  <td
                    key={`${author}-${key}`}
                    className={`border border-gray-300 px-4 py-2 text-right ${
                      key === "approved" ? "bg-green-50" : ""
                    }`}
                  >
                    {authorStatusStats[authorIdx][idx].count} (
                    {authorStatusStats[authorIdx][idx].percentage.toFixed(1)}%)
                  </td>
                ))}
              </tr>
            ))}
            {/* Pose Section Header */}
            <tr>
              <td
                colSpan={2 + trackedAuthors.length}
                className="border border-gray-300 px-4 bg-gray-200 font-bold text-center"
              >
                Pose
              </td>
            </tr>
            {/* Pose Rows */}
            {poseKeys.map((key, idx) => (
              <tr key={`pose-${key}`}>
                <td
                  className={`border border-gray-300 border-r-4 px-4 py-2 ${
                    key === "approved" ? "bg-green-50" : ""
                  }`}
                >
                  {pose[key]}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 text-right font-bold ${
                    key === "approved" ? "bg-green-50" : ""
                  }`}
                >
                  {allPoseStats[idx].count} (
                  {allPoseStats[idx].percentage.toFixed(1)}%)
                </td>
                {trackedAuthors.map((author, authorIdx) => (
                  <td
                    key={`${author}-${key}`}
                    className={`border border-gray-300 px-4 py-2 text-right ${
                      key === "approved" ? "bg-green-50" : ""
                    }`}
                  >
                    {authorPoseStats[authorIdx][idx].count} (
                    {authorPoseStats[authorIdx][idx].percentage.toFixed(1)}%)
                  </td>
                ))}
              </tr>
            ))}
            {/* Combined Section Header */}
            <tr>
              <td
                colSpan={2 + trackedAuthors.length}
                className="border border-gray-300 px-4 py-0 bg-gray-200 font-bold text-center"
              >
                Combined
              </td>
            </tr>
            {/* Combined Rows */}
            <tr>
              <td className="border border-gray-300 border-r-4 px-4 py-2">
                Not approved
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right font-bold">
                {allCombinedStats[1].count} (
                {allCombinedStats[1].percentage.toFixed(1)}%)
              </td>
              {trackedAuthors.map((author, authorIdx) => (
                <td
                  key={`${author}-not-approved`}
                  className="border border-gray-300 px-4 py-2 text-right"
                >
                  {authorCombinedStats[authorIdx][1].count} (
                  {authorCombinedStats[authorIdx][1].percentage.toFixed(1)}%)
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 border-r-4 px-4 py-2 bg-green-50">
                Approved
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right font-bold bg-green-50">
                {allCombinedStats[0].count} (
                {allCombinedStats[0].percentage.toFixed(1)}%)
              </td>
              {trackedAuthors.map((author, authorIdx) => (
                <td
                  key={`${author}-approved`}
                  className="border border-gray-300 px-4 py-2 text-right bg-green-50"
                >
                  {authorCombinedStats[authorIdx][0].count} (
                  {authorCombinedStats[authorIdx][0].percentage.toFixed(1)}%)
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stats;
