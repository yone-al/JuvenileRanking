import React from "react";
import { ScoreCategory } from "@/app/page";
import styles from "./CategoryButtons.module.css";

interface CategoryButtonsProps {
  categories: ScoreCategory[];
  selectedCategory: ScoreCategory;
  categoryDisplay: Record<ScoreCategory, string>;
  onCategoryClick: (category: ScoreCategory) => void;
}

export function CategoryButtons({
  categories,
  selectedCategory,
  categoryDisplay,
  onCategoryClick,
}: CategoryButtonsProps) {
  return (
    <nav className={styles.container} role="navigation" aria-label="カテゴリー選択">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryClick(cat)}
          className={`${styles.button} ${
            selectedCategory === cat ? styles.active : styles.inactive
          }`}
          aria-pressed={selectedCategory === cat}
          aria-label={`${categoryDisplay[cat]}を選択`}
          type="button"
        >
          {categoryDisplay[cat]}
        </button>
      ))}
    </nav>
  );
}