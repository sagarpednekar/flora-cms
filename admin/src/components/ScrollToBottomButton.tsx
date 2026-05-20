import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scrollToElement } from "@/lib/utils";

type ScrollToBottomButtonProps = {
  targetId?: string;
};

export function ScrollToBottomButton({ targetId = "form-actions" }: ScrollToBottomButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-50"
      aria-label="Jump to bottom"
      onClick={() => scrollToElement(targetId)}
    >
      <ChevronDown className="h-5 w-5" />
    </Button>
  );
}
