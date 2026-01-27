import type { FC } from "react";
import { Label } from "./ui/label";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useObjectModel } from "@/providers/ObjectModelProvider";
import { Filter } from "lucide-react";
import { DARK_BLUE } from "@/constants";

interface NavItemProps {
  to: string;
  label: string;
  isActive: boolean;
}

const NavItem: FC<NavItemProps> = ({ to, label, isActive }) => (
  <Link
    to={to}
    className={`px-4 py-2 text-sm font-medium transition-colors relative ${
      isActive
        ? ""
        : "text-gray-500 hover:text-gray-700"
    }`}
    style={isActive ? { color: DARK_BLUE } : undefined}
  >
    {label}
    {isActive && (
      <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: DARK_BLUE }} />
    )}
  </Link>
);

interface ControlBarProps {
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

export const ControlBar: FC<ControlBarProps> = ({ showFilters, onToggleFilters }) => {
  const { model, setModel } = useObjectModel();
  const isSam = model === "sam";
  const location = useLocation();

  const isStats = location.pathname === "/stats";
  // Evaluator is active for "/" and any video route (not stats, sam_compare, or manual_metadata)
  const isEvaluator = !["/stats", "/sam_compare", "/manual_metadata"].includes(location.pathname);

  return (
    <div className="flex flex-row items-center relative justify-between">
      <div className="flex items-center gap-2 ml-4">
        {onToggleFilters && (
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={onToggleFilters}
            aria-label="Toggle filters"
          >
            <Filter className="h-4 w-4" />
          </Button>
        )}
        <nav className="flex items-center">
          <NavItem to="/" label="Evaluator" isActive={isEvaluator} />
          <NavItem to="/stats" label="Stats" isActive={isStats} />
        </nav>
      </div>

      <div className="flex items-center gap-2 mr-4">
        <Label className={`text-sm ${isSam ? "text-gray-400" : "font-semibold"}`}>Hunyuan</Label>
        <Switch checked={isSam} onCheckedChange={(checked) => setModel(checked ? "sam" : "hunyuan")} />
        <Label className={`text-sm ${!isSam ? "text-gray-400" : "font-semibold"}`}>Sam</Label>
      </div>
    </div>
  );
};
