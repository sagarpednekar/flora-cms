import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Columns3 } from "lucide-react";
import type { ColumnDef } from "@/hooks/useColumnVisibility";

type ColumnVisibilityPopoverProps = {
  columns: ColumnDef[];
  visibleColumnIds: string[];
  onToggleColumn: (columnId: string) => void;
};

export function ColumnVisibilityPopover({
  columns,
  visibleColumnIds,
  onToggleColumn,
}: ColumnVisibilityPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Columns3 className="mr-2 h-4 w-4" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <p className="mb-3 text-sm font-medium text-gray-700">Toggle columns</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {columns.map((col) => (
            <label
              key={col.id}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
            >
              <Checkbox
                checked={visibleColumnIds.includes(col.id)}
                onCheckedChange={() => onToggleColumn(col.id)}
              />
              {col.label}
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
