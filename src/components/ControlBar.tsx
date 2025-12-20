import type { TabType } from "@/types/Tab";
import type { FC } from "react";
import type { AuthorType } from "@/types/Author";
import { authors } from "@/types/Author";
import type { WeekType } from "@/types/Week";
import { weeks } from "@/types/Week";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { status, type StatusType } from "@/types/Status";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ControlBarProps {
  selectedTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedAuthor: AuthorType;
  onAuthorChange: (author: AuthorType) => void;
  selectedWeek: WeekType;
  onWeekChange: (week: WeekType) => void;
  selectedStatus: StatusType;
  onStatusChange: (status: StatusType) => void;
}

export const ControlBar: FC<ControlBarProps> = ({
  selectedAuthor,
  onAuthorChange,
  selectedWeek,
  onWeekChange,
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <div className="flex flex-row items-center mb-2 relative">
      <Button asChild className="ml-4">
        <Link to="/stats">Stats</Link>
      </Button>

      <div className="flex flex-row gap-6 justify-center m-auto">
        <div className="flex flex-col gap-1">
          <Label className="ml-2">Author</Label>
          <Select
            defaultValue={selectedAuthor ?? authors[0]}
            onValueChange={(value) => onAuthorChange(value as AuthorType)}
          >
            <SelectTrigger className="w-48" aria-label="Select author">
              <SelectValue placeholder="Select author" />
            </SelectTrigger>
            <SelectContent>
              {authors.map((author) => (
                <SelectItem key={author} value={author}>
                  {author.charAt(0).toUpperCase() + author.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="ml-2">Week</Label>
          <Select
            defaultValue={selectedWeek ?? weeks["all"]}
            onValueChange={(value) => onWeekChange(value as WeekType)}
          >
            <SelectTrigger className="w-48" aria-label="Select week">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(weeks).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label className="ml-2">Status</Label>
          <Select
            defaultValue={selectedStatus ?? status["all"]}
            onValueChange={(value) => onStatusChange(value as StatusType)}
          >
            <SelectTrigger className="w-48" aria-label="Select status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(status).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
