import styles from "./UnitToggle.module.scss";
import { TemperatureUnit } from "../../utils/enum";

interface UnitToggleProps {
  unit: TemperatureUnit.Celsius | TemperatureUnit.Fahrenheit;
  onChange: (
    unit: TemperatureUnit.Celsius | TemperatureUnit.Fahrenheit
  ) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.btn} ${
          unit === TemperatureUnit.Celsius ? styles.active : ""
        }`}
        onClick={() => onChange(TemperatureUnit.Celsius)}
      >
        °C
      </button>
      <button
        className={`${styles.btn} ${
          unit === TemperatureUnit.Fahrenheit ? styles.active : ""
        }`}
        onClick={() => onChange(TemperatureUnit.Fahrenheit)}
      >
        °F
      </button>
    </div>
  );
}
