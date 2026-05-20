import { useState, useEffect, useMemo } from "react";
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
import {
  getSthanaOptionsForBook,
  isSthanaValidForBook,
  formatSthanaLabel,
} from "@/constants/bookSthana";
import { settingsApi } from "@/api/settings";
import { FormSection } from "@/components/FormSection";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
import { scrollToFormSection } from "@/lib/utils";

const BOOK_NAMES: { value: BookName; label: string }[] = [
  { value: "Charaka_Samhita", label: "Charaka Samhita" },
  { value: "Sushruta_Samhita", label: "Sushruta Samhita" },
  { value: "Ashtang_Hridaya", label: "Ashtang Hridaya" },
  { value: "Ashtang_Samgraha", label: "Ashtang Samgraha" },
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
  sthana: "Sutra_Sthana",
  chapterNumber: "Chapter_1",
  verseNumber: undefined,
  singleOrCombinationDrug: "Single",
  formulationAsSingleDrug: "NA",
  formulationAsCombination: "NA",
  nameOfCombination: "NA",
  userExtOrInt: "INT",
  typeOfExtUse: "NA",
  enteralRoute: "NA",
  parenteralRoute: "NA",
  usesAsSingleDrug: "NA",
  usesAsCombination: "NA",
  anupana: "NA",
  granthadikara: "",
  rogadhikara: "",
  sahapana: "NA",
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

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get(),
  });

  const enablePublishDraft = settings?.enablePublishDraft ?? false;

  const formSections = useMemo(() => {
    const sections = [
      { id: "section-basic", title: "Basic" },
      { id: "section-source", title: "Source" },
      { id: "section-formulation", title: "Drug type and formulation" },
      { id: "section-use-route", title: "Use and route" },
      { id: "section-references", title: "References" },
    ];
    if (enablePublishDraft) {
      sections.push({ id: "section-published", title: "Published" });
    }
    sections.push({ id: "section-remarks", title: "Remarks" });
    return sections;
  }, [enablePublishDraft]);

  const sectionNav = (sectionId: string) => {
    const index = formSections.findIndex((s) => s.id === sectionId);
    if (index < 0 || index >= formSections.length - 1) {
      return { showNext: false as const };
    }
    const next = formSections[index + 1];
    return {
      showNext: true as const,
      nextTitle: next.title,
      onNext: () => scrollToFormSection(next.id),
    };
  };

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
      navigate("/");
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
      navigate("/");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { published: _published, ...formWithoutPublished } = form;
    const payload: SpeciesCreateInput = {
      ...formWithoutPublished,
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
      ...(enablePublishDraft ? { published: form.published } : {}),
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

  const bookName = form.bookName ?? "Charaka_Samhita";
  const sthanaOptions = getSthanaOptionsForBook(bookName);
  const showOrphanSthana =
    !!form.sthana && !isSthanaValidForBook(bookName, form.sthana);

  const handleBookChange = (bookName: BookName) => {
    setForm((f) => {
      const next = { ...f, bookName };
      if (!isSthanaValidForBook(bookName, f.sthana)) {
        const first = getSthanaOptionsForBook(bookName)[0];
        next.sthana = first?.value;
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {!isNew && enablePublishDraft && (
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
          {enablePublishDraft && !form.published && (
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

        <FormSection id="section-basic" title="Basic" {...sectionNav("section-basic")}>
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
            <Label htmlFor="partOfPlantUsed">Part of plant used</Label>
            <Input
              id="partOfPlantUsed"
              value={form.partOfPlantUsed ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, partOfPlantUsed: e.target.value }))}
            />
          </div>
        </FormSection>

        <FormSection id="section-source" title="Source" {...sectionNav("section-source")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bookName">Book name / Samhita name *</Label>
              <select
                id="bookName"
                className={inputClass}
                value={form.bookName}
                onChange={(e) => handleBookChange(e.target.value as BookName)}
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
                {showOrphanSthana && form.sthana && (
                  <option key={form.sthana} value={form.sthana}>
                    {formatSthanaLabel(form.sthana)}
                  </option>
                )}
                {sthanaOptions.map((o) => (
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
        </FormSection>

        <FormSection
          id="section-formulation"
          title="Drug type and formulation"
          {...sectionNav("section-formulation")}
        >
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
        </FormSection>

        <FormSection id="section-use-route" title="Use and route" {...sectionNav("section-use-route")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="userExtOrInt">User INT/EXT</Label>
              <select
                id="userExtOrInt"
                className={inputClass}
                value={form.userExtOrInt ?? ""}
                onChange={(e) => {
                  const val = (e.target.value as UserExtOrInt) || undefined;
                  setForm((f) => ({
                    ...f,
                    userExtOrInt: val,
                    ...(val === "INT" && { typeOfExtUse: "NA" }),
                    ...(val === "EXT" && {
                      enteralRoute: "NA",
                      parenteralRoute: "NA",
                      usesAsSingleDrug: "NA",
                      usesAsCombination: "NA",
                    }),
                  }));
                }}
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
              <Label htmlFor="sahapana">Sahapana</Label>
              <Input
                id="sahapana"
                value={form.sahapana ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, sahapana: e.target.value }))}
              />
            </div>
          </div>
        </FormSection>

        <FormSection id="section-references" title="References" {...sectionNav("section-references")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="granthadikara">Granthadikara</Label>
              <Input
                id="granthadikara"
                value={form.granthadikara ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, granthadikara: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rogadhikara">Rogadhikara</Label>
              <Input
                id="rogadhikara"
                value={form.rogadhikara ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, rogadhikara: e.target.value }))}
              />
            </div>
          </div>
        </FormSection>

        {enablePublishDraft && (
          <FormSection id="section-published" title="Published" {...sectionNav("section-published")}>
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={form.published}
                onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </FormSection>
        )}

        <FormSection id="section-remarks" title="Remarks">
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <textarea
              id="remarks"
              className={`${inputClass} min-h-[100px]`}
              value={form.remarks ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
            />
          </div>
        </FormSection>

        <div id="form-actions" className="flex gap-2 scroll-mt-24">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/")}>
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

      <ScrollToBottomButton />
    </div>
  );
}
