import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type FormSectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  showNext?: boolean;
  nextTitle?: string;
  onNext?: () => void;
};

export function FormSection({
  id,
  title,
  children,
  showNext = false,
  nextTitle,
  onNext,
}: FormSectionProps) {
  return (
    <section id={id} className="space-y-4 scroll-mt-24">
      <div className="flex items-center gap-2 border-b pb-2">
        <h2 className="text-lg font-medium">{title}</h2>
        {showNext && onNext && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            aria-label={nextTitle ? `Go to ${nextTitle}` : "Go to next section"}
            onClick={onNext}
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        )}
      </div>
      {children}
    </section>
  );
}
