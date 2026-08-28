import { useTheme, type ThemeMode } from "../../theme/useTheme";
import "./ThemeToggle.css";

const options: { mode: ThemeMode; label: string }[] = [
  { mode: "light", label: "Light" },
  { mode: "dark", label: "Dark" },
  { mode: "system", label: "System" },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div className="ve-theme-toggle" role="group" aria-label="Theme">
      {options.map((opt) => (
        <button
          key={opt.mode}
          type="button"
          className={"ve-theme-toggle__btn" + (mode === opt.mode ? " is-active" : "")}
          onClick={() => setMode(opt.mode)}
          aria-pressed={mode === opt.mode}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
