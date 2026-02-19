import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ColumnVisibilityPopover } from "@/components/ColumnVisibilityPopover";
import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  speciesApi,
  type FloraSpecies,
  type ImportResult,
  type SpeciesFilterEntry,
  SPECIES_FILTER_FIELDS,
} from "@/api/species";
import { Pagination } from "@/components/Pagination";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, Upload, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const OPERATORS_STRING = [
  { value: "contains", label: "Contains" },
  { value: "eq", label: "Equals" },
  { value: "empty", label: "Is empty" },
];
const OPERATORS_ENUM = [
  { value: "eq", label: "Equals" },
  { value: "in", label: "In" },
  { value: "empty", label: "Is empty" },
];
const OPERATORS_NUMBER = [
  { value: "eq", label: "Equals" },
  { value: "gte", label: "Greater or equal" },
  { value: "lte", label: "Less or equal" },
  { value: "empty", label: "Is empty" },
];
const OPERATORS_BOOLEAN = [{ value: "eq", label: "Equals" }];

function operatorsForType(type: "string" | "enum" | "number" | "boolean") {
  switch (type) {
    case "string": return OPERATORS_STRING;
    case "enum": return OPERATORS_ENUM;
    case "number": return OPERATORS_NUMBER;
    case "boolean": return OPERATORS_BOOLEAN;
    default: return OPERATORS_STRING;
  }
}

const SPECIES_PER_PAGE_KEY = "species-per-page";

const SPECIES_TABLE_COLUMNS = [
  { id: "drugName", label: "Drug name" },
  { id: "sanskritName", label: "Sanskrit name" },
  { id: "latinName", label: "Latin name" },
  { id: "remarks", label: "Remarks" },
  { id: "partOfPlantUsed", label: "Part of plant used" },
  { id: "bookName", label: "Book" },
  { id: "sthana", label: "Sthana" },
  { id: "chapterNumber", label: "Chapter" },
  { id: "verseNumber", label: "Verse" },
  { id: "singleOrCombinationDrug", label: "Single/Combination" },
  { id: "formulationAsSingleDrug", label: "Formulation (single)" },
  { id: "formulationAsCombination", label: "Formulation (combination)" },
  { id: "nameOfCombination", label: "Name of combination" },
  { id: "userExtOrInt", label: "INT/EXT" },
  { id: "typeOfExtUse", label: "Type of ext use" },
  { id: "enteralRoute", label: "Enteral route" },
  { id: "parenteralRoute", label: "Parenteral route" },
  { id: "usesAsSingleDrug", label: "Uses (single)" },
  { id: "usesAsCombination", label: "Uses (combination)" },
  { id: "anupana", label: "Anupana" },
  { id: "granthadikara", label: "Granthadikara" },
  { id: "rogadhikara", label: "Rogadhikara" },
  { id: "sahapana", label: "Sahapana" },
  { id: "state", label: "State" },
];

function renderCell(colId: string, s: FloraSpecies) {
  const empty = "—";
  switch (colId) {
    case "drugName":
      return s.drugName;
    case "sanskritName":
      return s.sanskritName ?? empty;
    case "latinName":
      return s.latinName ?? empty;
    case "remarks":
      return s.remarks ?? empty;
    case "partOfPlantUsed":
      return s.partOfPlantUsed ?? empty;
    case "bookName":
      return s.bookName.replace(/_/g, " ");
    case "sthana":
      return s.sthana?.replace(/_/g, " ") ?? empty;
    case "chapterNumber":
      return s.chapterNumber?.replace(/_/g, " ") ?? empty;
    case "verseNumber":
      return s.verseNumber ?? empty;
    case "singleOrCombinationDrug":
      return s.singleOrCombinationDrug ?? empty;
    case "formulationAsSingleDrug":
      return s.formulationAsSingleDrug ?? empty;
    case "formulationAsCombination":
      return s.formulationAsCombination ?? empty;
    case "nameOfCombination":
      return s.nameOfCombination ?? empty;
    case "userExtOrInt":
      return s.userExtOrInt ?? empty;
    case "typeOfExtUse":
      return s.typeOfExtUse ?? empty;
    case "enteralRoute":
      return s.enteralRoute ?? empty;
    case "parenteralRoute":
      return s.parenteralRoute ?? empty;
    case "usesAsSingleDrug":
      return s.usesAsSingleDrug ?? empty;
    case "usesAsCombination":
      return s.usesAsCombination ?? empty;
    case "anupana":
      return s.anupana ?? empty;
    case "granthadikara":
      return s.granthadikara ?? empty;
    case "rogadhikara":
      return s.rogadhikara ?? empty;
    case "sahapana":
      return s.sahapana ?? empty;
    case "state":
      return (
        <Badge variant={s.published ? "success" : "secondary"}>
          {s.published ? "Published" : "Draft"}
        </Badge>
      );
    default:
      return empty;
  }
}

export function SpeciesList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const { visibleColumnIds, visibleColumnsOrdered, toggleColumn } = useColumnVisibility(
    SPECIES_TABLE_COLUMNS,
    ["drugName", "sanskritName", "latinName", "bookName", "state"],
    "species-column-visibility"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [limit, setLimit] = useState(() => {
    const s = localStorage.getItem(SPECIES_PER_PAGE_KEY);
    const n = s ? parseInt(s, 10) : NaN;
    return Number.isNaN(n) || n < 1 ? 20 : Math.min(n, 100);
  });
  useEffect(() => {
    localStorage.setItem(SPECIES_PER_PAGE_KEY, String(limit));
  }, [limit]);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const [filters, setFilters] = useState<SpeciesFilterEntry[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<SpeciesFilterEntry[]>([]);

  const addFilter = () => {
    const firstId = SPECIES_FILTER_FIELDS[0]?.id ?? "drugName";
    const firstType = SPECIES_FILTER_FIELDS[0]?.type ?? "string";
    setFilters([
      ...filters,
      {
        field: firstId,
        operator: firstType === "string" ? "contains" : "eq",
        value: firstType === "boolean" ? false : "",
      },
    ]);
  };
  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };
  const updateFilter = (index: number, patch: Partial<SpeciesFilterEntry>) => {
    setFilters(filters.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };
  const applyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };
  const clearFilters = () => {
    setFilters([]);
    setAppliedFilters([]);
    setPage(1);
  };

  const normalizedAppliedFilters = appliedFilters.map((f) => {
    if (f.operator === "in" && typeof f.value === "string") {
      return { ...f, value: f.value.split(",").map((s) => s.trim()).filter(Boolean) };
    }
    return f;
  });

  const { data, isLoading } = useQuery({
    queryKey: ["species", page, limit, searchDebounced, appliedFilters],
    queryFn: () =>
      speciesApi.list({
        page,
        limit,
        search: searchDebounced || undefined,
        filters: normalizedAppliedFilters.length > 0 ? normalizedAppliedFilters : undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => speciesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["species"] });
      toast.success("Species deleted");
    },
    onError: (err) =>
      toast.error((err as Error)?.message ?? "Something went wrong"),
  });

  const importMutation = useMutation({
    mutationFn: (file: File) => speciesApi.importSpecies(file),
    onSuccess: (result) => {
      setImportResult(result);
      queryClient.invalidateQueries({ queryKey: ["species"] });
      const msg =
        result.errors?.length > 0
          ? `Import completed. ${result.imported} imported, ${result.errors.length} errors.`
          : `Import completed. ${result.imported} imported.`;
      toast.success(msg);
    },
    onError: (err) => {
      setImportResult(null);
      toast.error((err as Error)?.message ?? "Import failed");
    },
  });

  const handleImportClick = () => {
    setImportResult(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) importMutation.mutate(file);
    e.target.value = "";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchDebounced(search);
    setPage(1);
  };

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Flora Species</h1>
        <div className="flex gap-2">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              placeholder="Search by drug name, Sanskrit or Latin name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
          <ColumnVisibilityPopover
            columns={SPECIES_TABLE_COLUMNS}
            visibleColumnIds={visibleColumnIds}
            onToggleColumn={toggleColumn}
          />
          <Button variant="outline" onClick={handleImportClick} disabled={importMutation.isPending}>
            <Upload className="mr-2 h-4 w-4" />
            {importMutation.isPending ? "Importing…" : "Import"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button asChild>
            <Link to="/species/new">
              <Plus className="mr-2 h-4 w-4" />
              Create new entry
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-gray-50/80 p-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
          <Button type="button" variant="outline" size="sm" onClick={addFilter}>
            Add filter
          </Button>
          {filters.length > 0 && (
            <>
              <Button type="button" variant="secondary" size="sm" onClick={applyFilters}>
                Apply filters
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </>
          )}
        </div>
        {filters.length > 0 && (
          <div className="space-y-2">
            {filters.map((filter, index) => {
              const fieldConfig = SPECIES_FILTER_FIELDS.find((f) => f.id === filter.field);
              const fieldType = fieldConfig?.type ?? "string";
              const operators = operatorsForType(fieldType);
              const showValue = filter.operator !== "empty";
              return (
                <div key={index} className="flex flex-wrap items-center gap-2">
                  <select
                    value={filter.field}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      const nextConfig = SPECIES_FILTER_FIELDS.find((f) => f.id === nextId);
                      const nextType = nextConfig?.type ?? "string";
                      updateFilter(index, {
                        field: nextId,
                        operator: nextType === "string" ? "contains" : "eq",
                        value: nextType === "boolean" ? false : "",
                      });
                    }}
                    className={cn(
                      "h-9 rounded-md border border-gray-300 bg-white px-2 text-sm min-w-[140px]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    )}
                  >
                    {SPECIES_FILTER_FIELDS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filter.operator}
                    onChange={(e) => updateFilter(index, { operator: e.target.value })}
                    className={cn(
                      "h-9 rounded-md border border-gray-300 bg-white px-2 text-sm min-w-[120px]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    )}
                  >
                    {operators.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                  {showValue && (
                    <>
                      {fieldType === "string" && (
                        <Input
                          value={typeof filter.value === "string" ? filter.value : ""}
                          onChange={(e) => updateFilter(index, { value: e.target.value })}
                          placeholder="Value"
                          className="h-9 w-40"
                        />
                      )}
                      {fieldType === "number" && (
                        <Input
                          type="number"
                          value={
                            filter.value !== undefined && filter.value !== ""
                              ? String(filter.value)
                              : ""
                          }
                          onChange={(e) =>
                            updateFilter(index, {
                              value:
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                            })
                          }
                          placeholder="Value"
                          className="h-9 w-24"
                        />
                      )}
                      {fieldType === "boolean" && (
                        <select
                          value={String(filter.value)}
                          onChange={(e) =>
                            updateFilter(index, { value: e.target.value === "true" })
                          }
                          className={cn(
                            "h-9 rounded-md border border-gray-300 bg-white px-2 text-sm w-24",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          )}
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      )}
                      {fieldType === "enum" && fieldConfig?.enumOptions && (
                        filter.operator === "in" ? (
                          <Input
                            value={
                              Array.isArray(filter.value)
                                ? filter.value.join(", ")
                                : String(filter.value ?? "")
                            }
                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                            placeholder="Comma-separated values"
                            className="h-9 min-w-[180px]"
                          />
                        ) : (
                          <select
                            value={Array.isArray(filter.value) ? filter.value[0] ?? "" : String(filter.value ?? "")}
                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                            className={cn(
                              "h-9 rounded-md border border-gray-300 bg-white px-2 text-sm min-w-[160px]",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            )}
                          >
                            <option value="">Select…</option>
                            {fieldConfig.enumOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )
                      )}
                    </>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-red-600"
                    onClick={() => removeFilter(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {importResult && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm">
          <p className="font-medium text-gray-900">
            Imported {importResult.imported} row{importResult.imported !== 1 ? "s" : ""}.
          </p>
          {importResult.errors.length > 0 && (
            <p className="mt-1 text-red-700">
              {importResult.errors.length} error{importResult.errors.length !== 1 ? "s" : ""}
              {importResult.errors.slice(0, 5).map((e) => (
                <span key={e.row} className="block mt-0.5">
                  Row {e.row}: {e.message}
                </span>
              ))}
              {importResult.errors.length > 5 && (
                <span className="block mt-0.5">… and {importResult.errors.length - 5} more</span>
              )}
            </p>
          )}
        </div>
      )}

      {importMutation.isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {(importMutation.error as Error).message}
        </div>
      )}

      <div className="rounded-md border border-gray-200 bg-white">
        {isLoading ? (
          <div className="flex justify-center p-8">Loading…</div>
        ) : (
          <div className="overflow-x-auto scroll-smooth">
            <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                {visibleColumnsOrdered.map((col) => (
                  <TableHead key={col.id}>{col.label}</TableHead>
                ))}
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumnsOrdered.length + 1} className="text-center text-gray-500">
                    No species found.
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((s: FloraSpecies) => (
                  <TableRow key={s.id}>
                    {visibleColumnsOrdered.map((col) => (
                      <TableCell
                        key={col.id}
                        className={col.id === "drugName" ? "font-medium" : "text-gray-600"}
                      >
                        {renderCell(col.id, s)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/species/${s.id}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Delete this species?")) {
                              deleteMutation.mutate(s.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={data?.total ?? 0}
        limit={limit}
        limitOptions={[10, 20, 50, 100]}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
