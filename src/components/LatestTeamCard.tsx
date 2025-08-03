import React from "react";
import { TeamData } from "@/interface";
import styles from "./LatestTeamCard.module.css";

interface LatestTeamCardProps {
  latestTeam: TeamData;
  latestRank: number | null;
  totalTeams: number;
}

export function LatestTeamCard({
  latestTeam,
  latestRank,
  totalTeams,
}: LatestTeamCardProps) {
  return (
    <div className={styles.card} role="region" aria-label="最新チーム情報">
      <h2 className={styles.title}>
        最新チーム: {latestTeam.team}
        {latestRank != null && (
          <span className={styles.ranking}>
            （{latestRank}位／{totalTeams}組中）
          </span>
        )}
      </h2>
      <p className={styles.score}>
        総スコア: <span className={styles.scoreValue}>{latestTeam.total}</span>点
      </p>
      <div className={styles.breakdown}>
        <div className={styles.gameScore}>
          <span className={styles.gameLabel}>Game1:</span>
          <span className={styles.gameValue}>{latestTeam.falling}点</span>
        </div>
        <div className={styles.gameScore}>
          <span className={styles.gameLabel}>Game2:</span>
          <span className={styles.gameValue}>{latestTeam.cut}点</span>
        </div>
        <div className={styles.gameScore}>
          <span className={styles.gameLabel}>Game3:</span>
          <span className={styles.gameValue}>{latestTeam.number}点</span>
        </div>
      </div>
    </div>
  );
}