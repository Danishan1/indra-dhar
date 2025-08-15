import { useEffect, useRef, useState } from "react";
import styles from "../css/Dropdown.module.css";

export default function Dropdown({
  label,
  items = [],
  selected,
  onSelect,
  placeholder = "Select...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item) => {
    onSelect(item);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={styles.selected}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selected?.label || placeholder}
        <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className={styles.menu}>
          <input
            type="text"
            className={styles.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
          <ul>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <li
                  key={item.value}
                  className={styles.item}
                  onClick={() => handleSelect(item)}
                >
                  {item.label}
                </li>
              ))
            ) : (
              <li className={styles.noItem}>No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
