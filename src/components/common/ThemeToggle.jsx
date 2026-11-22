import { useTheme } from "../../context/ThemeContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle({ showLabel = true, className = "" }) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      className={`${styles.toggleButton} ${className}`}
      onClick={toggleTheme}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <i
        className={`bi ${isDark ? "bi-sun-fill " + styles.sun : "bi-moon-stars-fill " + styles.moon} ${styles.icon}`}
      ></i>
      {showLabel && (
        <span className={styles.label}>
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
