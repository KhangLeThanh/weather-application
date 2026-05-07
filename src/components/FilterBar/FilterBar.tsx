import styles from "./FilterBar.module.scss";

export type ForecastFilter = 1 | 3 | 7;

interface FilterBarProps {
  active: ForecastFilter;
  onChange: (filter: ForecastFilter) => void;
}

const OPTIONS: { label: string; value: ForecastFilter }[] = [
  { label: "Today",  value: 1 },
  { label: "3 days", value: 3 },
  { label: "7 days", value: 7 },
];

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className={styles.bar}>
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`${styles.btn} ${active === opt.value ? styles.active : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
