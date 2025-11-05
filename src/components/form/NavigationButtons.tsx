import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextClassName?: string;
}

export function NavigationButtons({
  onBack,
  onNext,
  nextLabel = "Avanti",
  nextClassName = "flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600",
}: NavigationButtonsProps) {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onBack}
        variant="outline"
        className="flex-1 h-12"
      >
        Indietro
      </Button>
      <Button
        onClick={onNext}
        className={nextClassName}
      >
        {nextLabel}
      </Button>
    </div>
  );
}

