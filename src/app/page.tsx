"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getItems } from "@/func";
import { TeamData } from "@/interface";
import { CategoryButtons } from "@/components/CategoryButtons";
import { RankingTable } from "@/components/RankingTable";
import { LatestTeamCard } from "@/components/LatestTeamCard";
import { StatusIndicator } from "@/components/StatusIndicator";
import { DecorationImages } from "@/components/DecorationImages";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import styles from "./page.module.css";

export type ScoreCategory = "latest" | "total" | "falling" | "cut" | "number";

const CATEGORIES: ScoreCategory[] = [
  "latest",
  "total",
  "falling",
  "cut",
  "number",
];

const CATEGORY_DISPLAY: Record<ScoreCategory, string> = {
  latest: "トップ5",
  total: "総スコア",
  falling: "Game1 スコア",
  cut: "Game2 スコア",
  number: "Game3 スコア",
};

const TIMERS = {
  CATEGORY_ROTATION: 5000,
  INITIAL_DELAY: 20000,
  MANUAL_PAUSE: 30000,
  AUTO_RELOAD: 5 * 60 * 1000,
  DATA_REFRESH: 30 * 1000,
} as const;

interface UseDataFetchResult {
  teamData: TeamData[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  fetchData: (showLoading?: boolean) => Promise<void>;
}

function useDataFetch(): UseDataFetchResult {
  const [teamData, setTeamData] = useState<TeamData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      const result = await getItems();
      setTeamData(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("API fetch error:", error);
      setError(error instanceof Error ? error.message : "データの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { teamData, isLoading, error, lastUpdated, fetchData };
}

interface UseTimerControlsResult {
  startAuto: () => void;
  clearAuto: () => void;
  clearHold: () => void;
  clearReload: () => void;
  clearRefresh: () => void;
  startAutoReload: () => void;
  startDataRefresh: () => void;
}

function useTimerControls(
  rotateNext: () => void,
  fetchData: (showLoading?: boolean) => Promise<void>
): UseTimerControlsResult {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reloadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAuto = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearHold = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clearReload = useCallback(() => {
    if (reloadTimeoutRef.current) {
      clearTimeout(reloadTimeoutRef.current);
      reloadTimeoutRef.current = null;
    }
  }, []);

  const clearRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, []);

  const startAuto = useCallback(() => {
    clearAuto();
    intervalRef.current = setInterval(() => {
      rotateNext();
    }, TIMERS.CATEGORY_ROTATION);
  }, [rotateNext, clearAuto]);

  const startAutoReload = useCallback(() => {
    clearReload();
    reloadTimeoutRef.current = setTimeout(() => {
      window.location.reload();
    }, TIMERS.AUTO_RELOAD);
  }, [clearReload]);

  const startDataRefresh = useCallback(() => {
    clearRefresh();
    refreshIntervalRef.current = setInterval(() => {
      fetchData(false);
    }, TIMERS.DATA_REFRESH);
  }, [fetchData, clearRefresh]);

  useEffect(() => {
    return () => {
      clearAuto();
      clearHold();
      clearReload();
      clearRefresh();
    };
  }, [clearAuto, clearHold, clearReload, clearRefresh]);

  return {
    startAuto,
    clearAuto,
    clearHold,
    clearReload,
    clearRefresh,
    startAutoReload,
    startDataRefresh,
  };
}

function useRankingData(teamData: TeamData[], selectedCategory: ScoreCategory) {
  return useMemo(() => {
    const validTeamData = teamData.filter(
      (item) => item.team.trim() !== "" && item.team !== "Player"
    );
    
    const latestTeam = validTeamData.length > 0
      ? [...validTeamData].reverse()[0]
      : null;
    
    const sortedByTotal = [...validTeamData].sort((a, b) => b.total - a.total);
    
    const latestRank = latestTeam != null
      ? sortedByTotal.findIndex((item) => item === latestTeam) + 1
      : null;
    
    const totalTeams = sortedByTotal.length;
    
    const sortedData = selectedCategory === "latest"
      ? sortedByTotal
      : [...validTeamData].sort(
          (a, b) => b[selectedCategory] - a[selectedCategory]
        );
    
    const displayData = selectedCategory === "latest" 
      ? sortedData.slice(0, 5) 
      : sortedData;

    return {
      validTeamData,
      latestTeam,
      sortedByTotal,
      latestRank,
      totalTeams,
      displayData,
    };
  }, [teamData, selectedCategory]);
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<ScoreCategory>("latest");
  const { teamData, isLoading, error, lastUpdated, fetchData } = useDataFetch();
  
  const rotateNext = useCallback(() => {
    setSelectedCategory((prev) => {
      const idx = CATEGORIES.indexOf(prev);
      const nextIdx = (idx + 1) % CATEGORIES.length;
      return CATEGORIES[nextIdx] ?? CATEGORIES[0]!;
    });
  }, []);

  const timerControls = useTimerControls(rotateNext, fetchData);
  const rankingData = useRankingData(teamData, selectedCategory);

  useEffect(() => {
    // Only run timers on the client side
    if (typeof window === 'undefined') return;
    
    const initialDelay = setTimeout(() => {
      rotateNext();
      timerControls.startAuto();
    }, TIMERS.INITIAL_DELAY);

    timerControls.startAutoReload();
    timerControls.startDataRefresh();

    return () => {
      clearTimeout(initialDelay);
    };
  }, [rotateNext, timerControls]);

  const handleCategoryClick = useCallback((cat: ScoreCategory) => {
    timerControls.clearAuto();
    timerControls.clearHold();
    timerControls.clearReload();
    timerControls.clearRefresh();
    setSelectedCategory(cat);
    
    const resumeTimeout = setTimeout(() => {
      rotateNext();
      timerControls.startAuto();
    }, TIMERS.MANUAL_PAUSE);
    
    timerControls.startAutoReload();
    timerControls.startDataRefresh();
    
    return () => clearTimeout(resumeTimeout);
  }, [rotateNext, timerControls]);

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <StatusIndicator
          isLoading={isLoading}
          error={error}
          lastUpdated={lastUpdated}
          onRefresh={() => fetchData()}
        />

        <CategoryButtons
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          categoryDisplay={CATEGORY_DISPLAY}
          onCategoryClick={handleCategoryClick}
        />

        <div className={styles.titleContainer}>
          <h1 className={styles.title}>
            {CATEGORY_DISPLAY[selectedCategory]} ランキング
          </h1>
        </div>

        <RankingTable
          data={rankingData.displayData}
          selectedCategory={selectedCategory}
          isLatestCategory={selectedCategory === "latest"}
        />

        {selectedCategory === "latest" && rankingData.latestTeam && (
          <LatestTeamCard
            latestTeam={rankingData.latestTeam}
            latestRank={rankingData.latestRank}
            totalTeams={rankingData.totalTeams}
          />
        )}

        <DecorationImages />
      </div>
    </ErrorBoundary>
  );
}