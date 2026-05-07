import { useState, useRef, useEffect, useCallback } from "react";
import { FiSearch, FiX, FiMapPin, FiNavigation } from "react-icons/fi";
import { searchLocations } from "../../api/weatherApi";
import { reverseGeocode } from "../../api/reverseGeocode";
import type { Location } from "../../types/weather";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  onSelect: (location: Location) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSelect,
  placeholder = "Search for a city...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchLocations(value);
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  const handleSelect = (location: Location) => {
    setQuery(`${location.name}, ${location.country}`);
    setOpen(false);
    setResults([]);
    onSelect(location);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const location = await reverseGeocode(latitude, longitude);
        setQuery(`${location.name}, ${location.country}`);
        onSelect(location);
        setLocating(false);
      },
      () => {
        setLocating(false);
      }
    );
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div
        className={`${styles.inputRow} ${
          open && results.length ? styles.active : ""
        }`}
      >
        <FiSearch className={styles.iconSearch} />
        <input
          className={styles.input}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => results.length && setOpen(true)}
        />
        {loading && <span className={styles.spinner} />}
        {!loading && query && (
          <button
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Clear"
          >
            <FiX />
          </button>
        )}
        <div className={styles.divider} />
        <button
          className={styles.locationBtn}
          onClick={handleCurrentLocation}
          aria-label="Use current location"
          disabled={locating}
        >
          {locating ? <span className={styles.spinner} /> : <FiNavigation />}
        </button>
      </div>

      {open && results.length > 0 && (
        <ul className={styles.dropdown}>
          {results.map((loc, i) => (
            <li
              key={i}
              className={styles.item}
              onMouseDown={() => handleSelect(loc)}
            >
              <FiMapPin className={styles.pinIcon} />
              <span className={styles.cityName}>{loc.name}</span>
              <span className={styles.country}>{loc.country}</span>
            </li>
          ))}
        </ul>
      )}

      {open && !loading && query && results.length === 0 && (
        <div className={styles.empty}>No results found for "{query}"</div>
      )}
    </div>
  );
}
