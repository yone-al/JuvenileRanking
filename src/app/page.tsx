"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getItems} from "@/func";
import {TeamData} from "@/interface";

// 4種類のスコアカテゴリー（各項目名を表します）
type ScoreCategory = "total" | "falling" | "cut" | "number";



export default function HomePage() {
  // 初期表示は「総スコア」
  const [selectedCategory, setSelectedCategory] = useState<ScoreCategory>("total");
  // API から取得したチームデータの状態
  const [teamData, setTeamData] = useState<TeamData[]>([]);

  // ボタン表示用のカテゴリー名辞書
  const categoryDisplay: Record<ScoreCategory, string> = {
    total: "総スコア",
    falling: "落下物ゲームスコア",
    cut: "食べ物カットスコア",
    number: "数字ゲームスコア",
  };

  // Google Apps Script 側のエンドポイント URL（※自身の URL に変更してください）
  const apiUrl =
    "https://script.google.com/macros/s/AKfycbySsPF65tyanLnoJOQVyuuGVgJ-6n1squtOEAux2L7FSt0gwfZGa0wpkBYKWNEWIUeRtA/exec";

  useEffect(() => {
    // CORS 対策のためにプロキシ URL を利用（cors-anywhere を利用）
    // const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const fullUrl = apiUrl;

    // POST で送信するデータ：今回は「名前」「落下物」「調理」「レジ」「総計」を渡しています。
    const handleCreateItem = async () => {
          try {
              const result = await getItems(fullUrl);
              setTeamData(result);
          } catch (error) {
              console.error('Error creating item:', error);
          }
    };

    handleCreateItem();
  }, [apiUrl]);

  // 選択カテゴリーでデータを降順ソート
  const sortedData = [...teamData].sort(
    (a, b) => b[selectedCategory] - a[selectedCategory]
  );

  return (
    <div style={{ padding: "1rem" }}>
      {/* カテゴリー選択ボタン */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {(["total", "falling", "cut", "number"] as ScoreCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1.2rem",
              backgroundColor: selectedCategory === cat ? "#3CB371" : "#ddd",
              color: selectedCategory === cat ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {categoryDisplay[cat]}
          </button>
        ))}
      </div>

      {/* タイトル */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <h1 style={{ fontWeight: "bold", fontSize: "3rem", margin: 0 }}>
          {categoryDisplay[selectedCategory]} ランキング
        </h1>
      </div>

      {/* ランキングテーブル */}
      <div style={{ overflowX: "auto", textAlign: "center" }}>
        <table
          style={{
            margin: "0 auto",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            width: "60%",
          }}
        >
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "40%" }} />
            <col style={{ width: "40%" }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: "2px solid #000" }}>
              <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>順位</th>
              <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>チーム名</th>
              <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>スコア</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr
                key={`${item.team}-${index}`}
                style={{
                  borderBottom: "1px solid #ccc",
                  backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff",
                }}
              >
                <td
                  style={{
                    padding: "0.75rem",
                    verticalAlign: "middle",
                    fontSize: "1.3rem",
                    textAlign: "center",
                  }}
                >
                  {index + 1}位
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    verticalAlign: "middle",
                    fontSize: "1.3rem",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.team}
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    verticalAlign: "middle",
                    fontSize: "1.3rem",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item[selectedCategory]}点
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 固定配置された画像 ※ "public/images" 以下にファイル配置すること */}
      <div
        style={{
          position: "fixed",
          bottom: "10%",
          left: "10%",
          transform: "translate(-50%, -50%) scale(0.6)",
        }}
      >
        <Image
          src="/images/Apple.png"
          alt="リンゴの画像"
          width={200}
          height={200}
        />
      </div>
      <div
        style={{
          position: "fixed",
          top: "10%",
          right: "10%",
          transform: "translate(50%, -50%) scale(0.6)",
        }}
      >
        <Image
          src="/images/ApplePie.jpeg"
          alt="アップルパイの画像"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
}

