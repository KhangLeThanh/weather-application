import styles from "./UnitToggle.module.scss";

interface UnitToggleProps {
  unit: "celsius" | "fahrenheit";
  onChange: (unit: "celsius" | "fahrenheit") => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.btn} ${unit === "celsius" ? styles.active : ""}`}
        onClick={() => onChange("celsius")}
      >
        °C
      </button>
      <button
        className={`${styles.btn} ${unit === "fahrenheit" ? styles.active : ""}`}
        onClick={() => onChange("fahrenheit")}
      >
        °F
      </button>
    </div>
  );
}
