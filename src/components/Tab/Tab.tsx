import styles from "./Tab.module.scss";

interface TabOption<T> {
  label: string;
  value: T;
}

interface TabProps<T> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function Tab<T extends string | number>({
  options,
  value,
  onChange,
}: TabProps<T>) {
  return (
    <div className={styles.tab}>
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          className={`${styles.btn} ${
            value === opt.value ? styles.active : ""
          }`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
