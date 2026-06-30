import logo from "@/assets/logo.png";

export function Logo({ className = "", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={logo} alt="MedSorts" width={32} height={32} className="h-8 w-8" />
      {showText && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Med<span className="text-primary">Sorts</span>
        </span>
      )}
    </div>
  );
}
