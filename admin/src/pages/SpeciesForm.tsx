import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  speciesApi,
  type SpeciesCreateInput,
  type FloraSpecies,
  type BookName,
  type Sthana,
  type ChapterNumber,
  type SingleOrCombinationDrug,
  type UserExtOrInt,
} from "@/api/species";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Trash2 } from "lucide-react";

const BOOK_NAMES: { value: BookName; label: string }[] = [
  { value: "Charaka_Samhita", label: "Charaka Samhita" },
  { value: "Sushruta_Samhita", label: "Sushruta Samhita" },
  { value: "Ashtang_Hridaya", label: "Ashtang Hridaya" },
  { value: "Ashtang_Samgraha", label: "Ashtang Samgraha" },
];

const STHANA_OPTIONS: { value: Sthana; label: string }[] = [
  { value: "Chikitsa_Sthana", label: "Chikitsa Sthana" },
  { value: "Indriya_Sthana", label: "Indriya Sthana" },
  { value: "Kalpa_Sthana", label: "Kalpa Sthana" },
  { value: "Kalpa_siddhi_Sthana", label: "Kalpa siddhi Sthana" },
  { value: "Kalpana_Sthana", label: "Kalpana Sthana" },
  { value: "Nidana_Sthana", label: "Nidana Sthana" },
  { value: "Sharir_Sthana", label: "Sharir Sthana" },
  { value: "Sidhi_Sthana", label: "Sidhi Sthana" },
  { value: "Sutra_Sthana", label: "Sutra Sthana" },
  { value: "Uttar_Tantra", label: "Uttar Tantra" },
  { value: "Vimana_Sthana", label: "Vimana Sthana" },
];

const CHAPTER_OPTIONS: { value: ChapterNumber; label: string }[] = Array.from(
  { length: 50 },
  (_, i) => ({
    value: `Chapter_${i + 1}` as ChapterNumber,
    label: `Chapter ${i + 1}`,
  })
);

const SINGLE_OR_COMBO_OPTIONS: { value: SingleOrCombinationDrug; label: string }[] = [
  { value: "Single", label: "Single" },
  { value: "Combination", label: "Combination" },
  { value: "Both", label: "Both" },
  { value: "Other", label: "Other" },
];

const USER_EXT_INT_OPTIONS: { value: UserExtOrInt; label: string }[] = [
  { value: "INT", label: "INT" },
  { value: "EXT", label: "EXT" },
];

const inputClass =
  "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

type FormState = SpeciesCreateInput & { published: boolean };

const defaultForm: FormState = {
  drugName: "",
  sanskritName: "",
  latinName: "",
  remarks: "",
  partOfPlantUsed: "",
  bookName: "Charaka_Samhita",
  sthana: "Chikitsa_Sthana",
  chapterNumber: "Chapter_1",
  verseNumber: undefined,
  singleOrCombinationDrug: "Single",
  formulationAsSingleDrug: "NA",
  formulationAsCombination: "NA",
  nameOfCombination: "NA",
  userExtOrInt: "INT",
  typeOfExtUse: "",
  enteralRoute: "",
  parenteralRoute: "",
  usesAsSingleDrug: "NA",
  usesAsCombination: "NA",
  anupana: "",
  granthadikara: "",
  rogadhikara: "",
  sahapana: "",
  published: false,
};

function toFormState(s: FloraSpecies): FormState {
  return {
    drugName: s.drugName,
    sanskritName: s.sanskritName ?? "",
    latinName: s.latinName ?? "",
    remarks: s.remarks ?? "",
    partOfPlantUsed: s.partOfPlantUsed ?? "",
    bookName: s.bookName,
    sthana: s.sthana ?? "Chikitsa_Sthana",
    chapterNumber: s.chapterNumber ?? "Chapter_1",
    verseNumber: s.verseNumber ?? undefined,
    singleOrCombinationDrug: s.singleOrCombinationDrug ?? "Single",
    formulationAsSingleDrug: s.formulationAsSingleDrug ?? "NA",
    formulationAsCombination: s.formulationAsCombination ?? "NA",
    nameOfCombination: s.nameOfCombination ?? "NA",
    userExtOrInt: s.userExtOrInt ?? "INT",
    typeOfExtUse: s.typeOfExtUse ?? "",
    enteralRoute: s.enteralRoute ?? "",
    parenteralRoute: s.parenteralRoute ?? "",
    usesAsSingleDrug: s.usesAsSingleDrug ?? "NA",
    usesAsCombination: s.usesAsCombination ?? "NA",
    anupana: s.anupana ?? "",
    granthadikara: s.granthadikara ?? "",
    rogadhikara: s.rogadhikara ?? "",
    sahapana: s.sahapana ?? "",
    published: s.published,
  };
}

function getErrorMessage(error: unknown): string {
  return (error as Error)?.message ?? "Something went wrong";
}

export function SpeciesForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(defaultForm);

  const { data: existing } = useQuery({
    queryKey: ["species", id],
    queryFn: () => speciesApi.get(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (existing) setForm(toFormState(existing));
  }, [existing]);

  const createMutation = useMutation({
    mutationFn: (data: SpeciesCreateInput) => speciesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["species"] });
      toast.success("Species added");
      navigate("/species");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<SpeciesCreateInput>) => speciesApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["species"] });
      queryClient.invalidateQueries({ queryKey: ["species", id] });
      toast.success("Species updated");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => speciesApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["species"] });
      toast.success("Species deleted");
      navigate("/species");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SpeciesCreateInput = {
      ...form,
      sanskritName: form.sanskritName || undefined,
      latinName: form.latinName || undefined,
      remarks: form.remarks || undefined,
      partOfPlantUsed: form.partOfPlantUsed || undefined,
      verseNumber: form.verseNumber ?? undefined,
      typeOfExtUse: form.typeOfExtUse || undefined,
      enteralRoute: form.enteralRoute || undefined,
      parenteralRoute: form.parenteralRoute || undefined,
      anupana: form.anupana || undefined,
      granthadikara: form.granthadikara || undefined,
      rogadhikara: form.rogadhikara || undefined,
      sahapana: form.sahapana || undefined,
    };
    if (isNew) {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate(payload);
    }
  };

  const handleDelete = () => {
    if (confirm("Delete this entry? This cannot be undone.")) deleteMutation.mutate();
  };

  const saving = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/species")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {!isNew && (
          <Button
            variant="outline"
            onClick={() => updateMutation.mutate({ ...form, published: !form.published })}
          >
            {form.published ? "Unpublish" : "Publish"}
          </Button>
        )}
      </div>

      {!isNew && existing && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          <span className="font-medium">Last updated:</span>{" "}
          {new Date(existing.updatedAt).toLocaleString()}
          {!form.published && (
            <span className="ml-2 inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              Draft
            </span>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">
            {(error as Error).message}
          </p>
        )}

        {/* Basic */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium border-b pb-2">Basic</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="drugName">Drug name *</Label>
              <Input
                id="drugName"
                value={form.drugName}
                onChange={(e) => setForm((f) => ({ ...f, drugName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sanskritName">Sanskrit name</Label>
              <Input
                id="sanskritName"
                value={form.sanskritName ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, sanskritName: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="latinName">Latin name</Label>
            <Input
              id="latinName"
              value={form.latinName ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, latinName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <textarea
              id="remarks"
              className={`${inputClass} min-h-[100px]`}
              value={form.remarks ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="partOfPlantUsed">Part of plant used</Label>
            <Input
              id="partOfPlantUsed"
              value={form.partOfPlantUsed ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, partOfPlantUsed: e.target.value }))}
            />
          </div>
        </section>

        {/* Source */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium border-b pb-2">Source</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bookName">Book name *</Label>
              <select
                id="bookName"
                className={inputClass}
                value={form.bookName}
                onChange={(e) => setForm((f) => ({ ...f, bookName: e.target.value as BookName }))}
                required
              >
                {BOOK_NAMES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sthana">Sthana</Label>
              <select
                id="sthana"
                className={inputClass}
                value={form.sthana ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sthana: (e.target.value as Sthana) || undefined }))
                }
              >
                {STHANA_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="chapterNumber">Chapter number</Label>
              <select
                id="chapterNumber"
                className={inputClass}
                value={form.chapterNumber ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    chapterNumber: (e.target.value as ChapterNumber) || undefined,
                  }))
                }
              >
                {CHAPTER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="verseNumber">Verse number</Label>
              <Input
                id="verseNumber"
                type="number"
                value={form.verseNumber ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    verseNumber: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  }))
                }
              />
            </div>
          </div>
        </section>

        {/* Drug type and formulation */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium border-b pb-2">Drug type and formulation</h2>
          <div className="space-y-2">
            <Label htmlFor="singleOrCombinationDrug">Single or combination drug</Label>
            <select
              id="singleOrCombinationDrug"
              className={inputClass}
              value={form.singleOrCombinationDrug ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  singleOrCombinationDrug: (e.target.value as SingleOrCombinationDrug) || undefined,
                }))
              }
            >
              {SINGLE_OR_COMBO_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="formulationAsSingleDrug">Formulation as single drug</Label>
            <Input
              id="formulationAsSingleDrug"
              value={form.formulationAsSingleDrug ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, formulationAsSingleDrug: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="formulationAsCombination">Formulation as combination</Label>
            <Input
              id="formulationAsCombination"
              value={form.formulationAsCombination ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, formulationAsCombination: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameOfCombination">Name of the combination</Label>
            <Input
              id="nameOfCombination"
              value={form.nameOfCombination ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, nameOfCombination: e.target.value }))}
            />
          </div>
        </section>

        {/* Use and route */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium border-b pb-2">Use and route</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="userExtOrInt">User INT/EXT</Label>
              <select
                id="userExtOrInt"
                className={inputClass}
                value={form.userExtOrInt ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    userExtOrInt: (e.target.value as UserExtOrInt) || undefined,
                  }))
                }
              >
                {USER_EXT_INT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeOfExtUse">Type of ext use</Label>
              <Input
                id="typeOfExtUse"
                value={form.typeOfExtUse ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, typeOfExtUse: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="enteralRoute">Enteral route</Label>
              <Input
                id="enteralRoute"
                value={form.enteralRoute ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, enteralRoute: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parenteralRoute">Parenteral route</Label>
              <Input
                id="parenteralRoute"
                value={form.parenteralRoute ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, parenteralRoute: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="usesAsSingleDrug">Uses as single drug</Label>
            <Input
              id="usesAsSingleDrug"
              value={form.usesAsSingleDrug ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, usesAsSingleDrug: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="usesAsCombination">Uses as combination</Label>
            <Input
              id="usesAsCombination"
              value={form.usesAsCombination ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, usesAsCombination: e.target.value }))}
            />
          </div>
        </section>

        {/* References */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium border-b pb-2">References</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="anupana">Anupana</Label>
              <Input
                id="anupana"
                value={form.anupana ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, anupana: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="granthadikara">Granthadikara</Label>
              <Input
                id="granthadikara"
                value={form.granthadikara ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, granthadikara: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rogadhikara">Rogadhikara</Label>
              <Input
                id="rogadhikara"
                value={form.rogadhikara ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, rogadhikara: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sahapana">Sahapana</Label>
              <Input
                id="sahapana"
                value={form.sahapana ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, sahapana: e.target.value }))}
              />
            </div>
          </div>
        </section>

        {/* Publish */}
        <section className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={form.published}
            onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
          />
          <Label htmlFor="published">Published</Label>
        </section>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/species")}>
            Cancel
          </Button>
          {!isNew && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete this entry
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
