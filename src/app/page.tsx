// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { getItems} from "@/func";
// import {TeamData} from "@/interface";

// // 4種類のスコアカテゴリー（各項目名を表します）
// type ScoreCategory = "total" | "falling" | "cut" | "number";



// export default function HomePage() {
//   // 初期表示は「総スコア」
//   const [selectedCategory, setSelectedCategory] = useState<ScoreCategory>("total");
//   // API から取得したチームデータの状態
//   const [teamData, setTeamData] = useState<TeamData[]>([]);

//   // ボタン表示用のカテゴリー名辞書
//   const categoryDisplay: Record<ScoreCategory, string> = {
//     total: "総スコア",
//     falling: "Game1 スコア",
//     cut: "Game2 スコア",
//     number: "Game3 スコア",
//   };

//   // Google Apps Script 側のエンドポイント URL（※自身の URL に変更してください）
//   const apiUrl =
//     "https://script.google.com/macros/s/AKfycbySsPF65tyanLnoJOQVyuuGVgJ-6n1squtOEAux2L7FSt0gwfZGa0wpkBYKWNEWIUeRtA/exec";

//   useEffect(() => {
//     // CORS 対策のためにプロキシ URL を利用（cors-anywhere を利用）
//     // const proxyUrl = "https://cors-anywhere.herokuapp.com/";
//     const fullUrl = apiUrl;

//     // POST で送信するデータ：今回は「名前」「落下物」「調理」「レジ」「総計」を渡しています。
//     const handleCreateItem = async () => {
//           try {
//               const result = await getItems(fullUrl);
//               setTeamData(result);
//           } catch (error) {
//               console.error('Error creating item:', error);
//           }
//     };

//     handleCreateItem();
//   }, [apiUrl]);

//   // 選択カテゴリーでデータを降順ソート
//   const sortedData = [...teamData].sort(
//     (a, b) => b[selectedCategory] - a[selectedCategory]
//   );

//   return (
//     <div style={{ padding: "1rem" }}>
//       {/* カテゴリー選択ボタン */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           gap: "1rem",
//           marginBottom: "1.5rem",
//         }}
//       >
//         {(["total", "falling", "cut", "number"] as ScoreCategory[]).map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setSelectedCategory(cat)}
//             style={{
//               padding: "0.5rem 1rem",
//               fontSize: "1.2rem",
//               backgroundColor: selectedCategory === cat ? "#3CB371" : "#ddd",
//               color: selectedCategory === cat ? "#fff" : "#000",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             {categoryDisplay[cat]}
//           </button>
//         ))}
//       </div>

//       {/* タイトル */}
//       <div style={{ textAlign: "center", marginBottom: "1rem" }}>
//         <h1 style={{ fontWeight: "bold", fontSize: "3rem", margin: 0 }}>
//           {categoryDisplay[selectedCategory]} ランキング
//         </h1>
//       </div>

//       {/* ランキングテーブル */}
//       <div style={{ overflowX: "auto", textAlign: "center" }}>
//         <table
//           style={{
//             margin: "0 auto",
//             borderCollapse: "collapse",
//             tableLayout: "fixed",
//             width: "60%",
//           }}
//         >
//           <colgroup>
//             <col style={{ width: "20%" }} />
//             <col style={{ width: "40%" }} />
//             <col style={{ width: "40%" }} />
//           </colgroup>
//           <thead>
//             <tr style={{ borderBottom: "2px solid #000" }}>
//               <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>順位</th>
//               <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>チーム名</th>
//               <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>スコア</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedData.map((item, index) => (
//               <tr
//                 key={`${item.team}-${index}`}
//                 style={{
//                   borderBottom: "1px solid #ccc",
//                   backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff",
//                 }}
//               >
//                 <td
//                   style={{
//                     padding: "0.75rem",
//                     verticalAlign: "middle",
//                     fontSize: "1.3rem",
//                     textAlign: "center",
//                   }}
//                 >
//                   {index + 1}位
//                 </td>
//                 <td
//                   style={{
//                     padding: "0.75rem",
//                     verticalAlign: "middle",
//                     fontSize: "1.3rem",
//                     textAlign: "center",
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   {item.team}
//                 </td>
//                 <td
//                   style={{
//                     padding: "0.75rem",
//                     verticalAlign: "middle",
//                     fontSize: "1.3rem",
//                     textAlign: "center",
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   {item[selectedCategory]}点
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* 固定配置された画像 ※ "public/images" 以下にファイル配置すること */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: "1%",
//           left: "10%",
//           transform: "translate(-50%, -50%) scale(0.6)",
//         }}
//       >
//         <Image
//           src="/images/Apple.png"
//           alt="リンゴの画像"
//           width={200}
//           height={200}
//         />
//       </div>
//       <div
//         style={{
//           position: "fixed",
//           top: "20%",
//           right: "10%",
//           transform: "translate(50%, -50%) scale(0.6)",
//         }}
//       >
//         <Image
//           src="/images/ApplePie.jpeg"
//           alt="アップルパイの画像"
//           width={200}
//           height={200}
//         />
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getItems } from "@/func";
import { TeamData } from "@/interface";

// 5種類のスコアカテゴリー
type ScoreCategory = "latest" | "total" | "falling" | "cut" | "number";

export default function HomePage() {
  // 初期表示を「最新＋トップ10」に設定
  const [selectedCategory, setSelectedCategory] =
    useState<ScoreCategory>("latest");
  const [teamData, setTeamData] = useState<TeamData[]>([]);

  const categoryDisplay: Record<ScoreCategory, string> = {
    latest: "最新＋トップ10",
    total: "総スコア",
    falling: "Game1 スコア",
    cut: "Game2 スコア",
    number: "Game3 スコア",
  };

  const apiUrl =
    "https://script.google.com/macros/s/AKfycbySsPF65tyanLnoJOQVyuuGVgJ-6n1squtOEAux2L7FSt0gwfZGa0wpkBYKWNEWIUeRtA/exec";

  useEffect(() => {
    (async () => {
      try {
        const result = await getItems(apiUrl);
        setTeamData(result);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    })();
  }, [apiUrl]);

  // 最新チーム（「Player」以外で一番最後に追加されたもの）
  const latestTeam =
    teamData.length > 0
      ? [...teamData].reverse().find((item) => item.team !== "Player") || null
      : null;

  // 総スコアで全体ソート
  const sortedByTotal = [...teamData].sort((a, b) => b.total - a.total);

  // 最新チームの全体順位
  const latestRank =
    latestTeam != null
      ? sortedByTotal.findIndex((item) => item === latestTeam) + 1
      : null;

  // チーム総数
  const totalTeams = sortedByTotal.length;

  // 各タブの表示データを準備
  const sortedData =
    selectedCategory === "latest"
      ? sortedByTotal
      : [...teamData].sort(
          (a, b) => b[selectedCategory] - a[selectedCategory]
        );
  const displayData =
    selectedCategory === "latest"
      ? sortedData.slice(0, 10)
      : sortedData;

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
        {(
          ["latest", "total", "falling", "cut", "number"] as ScoreCategory[]
        ).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1.2rem",
              backgroundColor:
                selectedCategory === cat ? "#3CB371" : "#ddd",
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

      {/* テーブルコンテナ：最新タブのみ高さ制限＆スクロール */}
      <div
        style={{
          maxHeight: selectedCategory === "latest" ? "400px" : undefined,
          overflowY: selectedCategory === "latest" ? "auto" : undefined,
          overflowX: "auto",
          textAlign: "center",
          marginBottom: selectedCategory === "latest" ? "2rem" : "1rem",
        }}
      >
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
              <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>
                順位
              </th>
              <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>
                チーム名
              </th>
              <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>
                スコア
              </th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((item, index) => (
              <tr
                key={`${item.team}-${index}`}
                style={{
                  borderBottom: "1px solid #ccc",
                  backgroundColor:
                    index % 2 === 0 ? "#f2f2f2" : "#ffffff",
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
                  {selectedCategory === "latest"
                    ? item.total
                    : item[selectedCategory]}
                  点
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 最新チーム情報：カード風 */}
      {selectedCategory === "latest" && latestTeam && (
        <div
          style={{
            width: "60%",
            margin: "0 auto",
            padding: "1.5rem",
            border: "2px solid #3CB371",
            borderRadius: "8px",
            backgroundColor: "#f8fff8",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              margin: "0 0 0.5rem",
              color: "#2e7d32",
            }}
          >
            最新チーム：{latestTeam.team}
            {latestRank != null &&
              `（${latestRank}位／${totalTeams}人中）`}
          </h2>
          <p style={{ fontSize: "1.5rem", margin: 0 }}>
            総スコア：{latestTeam.total}点
          </p>
        </div>
      )}

      {/* 固定画像 */}
      <div
        style={{
          position: "fixed",
          bottom: "1%",
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
          top: "20%",
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

