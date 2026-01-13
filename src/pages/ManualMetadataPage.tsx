import { useState, type FC } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMetadata } from "@/hooks/useMetadata";
import type { VideoMetadata } from "@/types/VideoMetadata";
import { MetadataTable, type MetadataRow } from "@/components/MetadataTable";

// Week options from week_0 to week_30
const weekOptions = Array.from({ length: 31 }, (_, i) => `week_${i}`);

// Author options (excluding "all")
const authorOptions = ["esteban", "junsoo", "divleen"];

// Status options from StatusSelector
const statusOptions = ["no_recon", "pending", "object", "pose", "approved"];

// Pose options from PoseSelector
const poseOptions = ["no_recon", "pending", "wrong", "almost", "approved"];

export const ManualMetadataPage: FC = () => {
  const {
    data,
    update,
    delete: deleteMetadata,
    updateMutation,
    deleteMutation,
  } = useMetadata();

  const [key, setKey] = useState("");
  const [week, setWeek] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [pose, setPose] = useState<string>("");
  const [prompt, setPrompt] = useState("");

  const handleRowSelect = (row: MetadataRow) => {
    setKey(row.name);
    setWeek(row.week);
    setAuthor(row.author);
    setStatus(row.status);
    setPose(row.pose);
    setPrompt(row.prompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    const metadata: VideoMetadata = {
      week,
      author,
      status,
      pose,
      prompt,
    };

    await update(key.trim(), metadata);
  };

  const handleDelete = async () => {
    if (!key.trim()) return;
    await deleteMetadata(key.trim());
  };

  const handleClear = () => {
    setKey("");
    setWeek("");
    setAuthor("");
    setStatus("");
    setPose("");
    setPrompt("");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">
          Manual Metadata
        </h1>
        <Button variant="outline" asChild>
          <Link to="/">← Back</Link>
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Form Section */}
        <div className="w-[400px] shrink-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-100/50 p-6 shadow-2xl backdrop-blur-sm">
              <div className="space-y-5">
                {/* Key (Video Name) */}
                <div className="space-y-2">
                  <Label htmlFor="key" className="text-gray-700">
                    Video Key
                  </Label>
                  <Input
                    id="key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter video key..."
                    className="bg-slate-200/50 border-slate-700 text-slate-700 placeholder:text-slate-500"
                  />
                </div>

                {/* Prompt */}
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-gray-700">
                    Prompt
                  </Label>
                  <Input
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter prompt..."
                    className="bg-slate-200/50 border-slate-700 text-slate-700 placeholder:text-slate-500"
                  />
                </div>

                {/* Week Selector */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Week</Label>
                  <Select value={week} onValueChange={setWeek}>
                    <SelectTrigger className="w-full bg-slate-200/50 border-slate-700 text-slate-700">
                      <SelectValue placeholder="Select week..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-200 border-slate-500">
                      {weekOptions.map((w) => (
                        <SelectItem
                          key={w}
                          value={w}
                          className="text-slate-700 focus:bg-slate-200 focus:text-slate-900 focus:font-bold"
                        >
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Author Selector */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Author</Label>
                  <Select value={author} onValueChange={setAuthor}>
                    <SelectTrigger className="w-full bg-slate-200/50 border-slate-700 text-slate-700">
                      <SelectValue placeholder="Select author..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-200 border-slate-500">
                      {authorOptions.map((a) => (
                        <SelectItem
                          key={a}
                          value={a}
                          className="text-slate-700 focus:bg-slate-200 focus:text-slate-900 focus:font-bold"
                        >
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Selector */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full bg-slate-200/50 border-slate-700 text-slate-700">
                      <SelectValue placeholder="Select status..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-200 border-slate-500">
                      {statusOptions.map((s) => (
                        <SelectItem
                          key={s}
                          value={s}
                          className="text-slate-700 focus:bg-slate-200 focus:text-slate-900 focus:font-bold"
                        >
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pose Selector */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Pose</Label>
                  <Select value={pose} onValueChange={setPose}>
                    <SelectTrigger className="w-full bg-slate-200/50 border-slate-700 text-slate-700">
                      <SelectValue placeholder="Select pose..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-200 border-slate-500">
                      {poseOptions.map((p) => (
                        <SelectItem
                          key={p}
                          value={p}
                          className="text-slate-700 focus:bg-slate-200 focus:text-slate-900 focus:font-bold"
                        >
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={!key.trim() || updateMutation.isPending}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? "Saving..." : "Save Metadata"}
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={!key.trim() || deleteMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Metadata"}
              </Button>
              <Button
                type="button"
                onClick={handleClear}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 transition-colors"
              >
                Clear
              </Button>
            </div>
          </form>
        </div>
        <MetadataTable data={data} onSelect={handleRowSelect} />
      </div>
    </div>
  );
};
