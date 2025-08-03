import React from "react";
import { TeamData } from "@/interface";
import { ScoreCategory } from "@/app/page";
import styles from "./RankingTable.module.css";

interface RankingTableProps {
  data: TeamData[];
  selectedCategory: ScoreCategory;
  isLatestCategory: boolean;
}

export function RankingTable({ 
  data, 
  selectedCategory, 
  isLatestCategory 
}: RankingTableProps) {
  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>データがありません</p>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.container} ${isLatestCategory ? styles.scrollable : ''}`}
      role="region"
      aria-label="ランキングテーブル"
    >
      <table className={styles.table} role="table">
        <caption className={styles.caption}>
          {isLatestCategory ? "トップ5" : "全"} ランキング
        </caption>
        <colgroup>
          <col className={styles.rankColumn} />
          <col className={styles.teamColumn} />
          <col className={styles.scoreColumn} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={styles.header}>
              順位
            </th>
            <th scope="col" className={styles.header}>
              チーム名
            </th>
            <th scope="col" className={styles.header}>
              スコア
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            // Create a stable key that won't cause hydration issues
            const stableKey = `ranking-${item.team}-${item.total}-${index}`;
            return (
              <tr
                key={stableKey}
                className={`${styles.row} ${index % 2 === 0 ? styles.evenRow : styles.oddRow}`}
              >
                <td className={styles.cell}>
                  <span className={styles.rank}>{index + 1}位</span>
                </td>
                <td className={styles.cell}>
                  <span className={styles.teamName} title={item.team}>
                    {item.team}
                  </span>
                </td>
                <td className={styles.cell}>
                  <span className={styles.score}>
                    {selectedCategory === "latest" ? item.total : item[selectedCategory]}点
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}