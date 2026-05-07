import { useState, useRef, useEffect } from "react";
import { FiSearch, FiX, FiMapPin } from "react-icons/fi";
import { searchLocations } from "../../api/weatherApi";
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
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchLocations(query);
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [query]);

  // Close on outside click
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
          onChange={(e) => setQuery(e.target.value)}
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
