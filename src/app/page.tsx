// import Image from "next/image";
// import React from "react";

// export default function Home() {
//   // ランキングデータをオブジェクトで管理
//   const rawData = [
//     { rank: 1, team: "Team A", score: 10000 },
//     { rank: 2, team: "Team B", score: 9500 }, 
//     { rank: 3, team: "Team C", score: 9000 },
//     { rank: 4, team: "Team D", score: 8500 },
//     { rank: 5, team: "Team E", score: 8000 },
//     { rank: 6, team: "Team F", score: 7500 },
//     { rank: 7, team: "Team G", score: 7000 }, 
//     { rank: 8, team: "Team H", score: 6500 },
//     { rank: 9, team: "Team I", score: 6000 },
//     { rank: 10, team: "Team J", score: 5500 },
//     { rank: 11, team: "Team K", score: 5000 },
//     { rank: 12, team: "Team L", score: 4500 },
//     { rank: 13, team: "Team M", score: 4000 },
//     { rank: 14, team: "Team N", score: 3500 },
//     { rank: 15, team: "Team O", score: 3000 },
//     { rank: 16, team: "Team P", score: 2500 },
//     { rank: 17, team: "Team Q", score: 2000 },
//     { rank: 18, team: "Team R", score: 1500 },
//     { rank: 19, team: "Team S", score: 1000 },
//     { rank: 20, team: "Team T", score: 500 },
//   ];

//   // データを制限値に従って加工（順位5桁, チーム名10文字, スコア6桁）
//   const rankingData = rawData.map((item) => clampData(item));

//   return (
//     <>
//       <div style={{ position: "relative", height: "100vh" }}>
//         {/* タイトル */}
//         <div
//           style={{
//             position: "absolute",
//             top: "20%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: "80%",
//             textAlign: "center",
//           }}
//         >
//           <h1 style={{ fontWeight: "bold", fontSize: "3rem", margin: 0 }}>
//             ランキング
//           </h1>
//         </div>

//         {/* ランキング本体 (テーブル) */}
//         <div
//           style={{
//             position: "absolute",
//             top: "30%",
//             left: "50%",
//             transform: "translateX(-50%)",
//             width: "80%",
//             overflowY: "auto",
//             textAlign: "center",
//           }}
//         >
//           <table
//             style={{
//               margin: "0 auto",
//               borderCollapse: "collapse",
//               tableLayout: "fixed",
//               width: "60%", // テーブル全体の幅を調整
//             }}
//           >
//             <colgroup>
//               {/* 順位, チーム名, スコア の列幅を固定 or 割合指定 */}
//               <col style={{ width: "20%" }} />
//               <col style={{ width: "40%" }} />
//               <col style={{ width: "40%" }} />
//             </colgroup>
//             <thead>
//               <tr style={{ borderBottom: "2px solid #000" }}>
//                 <th style={{ padding: "0.5rem", fontSize: "1.5rem" }}>順位</th>
//                 <th style={{ padding: "0.5rem", fontSize: "1.5rem" }}>チーム名</th>
//                 <th style={{ padding: "0.5rem", fontSize: "1.5rem" }}>スコア</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rankingData.map((item, index) => (
//                 <tr
//                   key={index}
//                   style={{
//                     borderBottom: "1px solid #ccc",
//                     backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff",
//                   }}
//                 >
//                   <td
//                     style={{
//                       padding: "0.5rem",
//                       verticalAlign: "middle",
//                       fontSize: "1.3rem",
//                     }}
//                   >
//                     {item.rank}位
//                   </td>
//                   <td
//                     style={{
//                       padding: "0.5rem",
//                       verticalAlign: "middle",
//                       fontSize: "1.3rem",
//                     }}
//                   >
//                     {item.team}
//                   </td>
//                   <td
//                     style={{
//                       padding: "0.5rem",
//                       verticalAlign: "middle",
//                       fontSize: "1.3rem",
//                     }}
//                   >
//                     {item.score}点
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* 以下 装飾 */}
//         <div
//           style={{
//             position: "fixed",
//             top: "80%",
//             left: "15%",
//             transform: "translate(-50%, -50%)",
//           }}
//         >
//           <Image
//             src="/images/Apple.png"
//             alt="リンゴの画像"
//             width={200}
//             height={200}
//           />
//         </div>
//         <div
//           style={{
//             position: "fixed",
//             top: "80%",
//             left: "85%",
//             transform: "translate(-50%, -50%) scale(1.4)",
//           }}
//         >
//           <Image
//             src="/images/ApplePie.jpeg"
//             alt="アップルパイの画像"
//             width={200}
//             height={200}
//           />
//         </div>
//         <div
//           style={{
//             position: "fixed",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%) scale(2.4,2)",
//           }}
//         >
//           <Image
//             src="/images/Frame.png"
//             alt="フレームの画像"
//             width={1000}
//             height={1000}
//           />
//         </div>
//       </div>

//       <div style={{ position: "relative", height: "100vh" }}>
//         <span
//           style={{
//             position: "absolute",
//             top: "30%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             fontWeight: "bold",
//             fontSize: "2rem",
//           }}
//         >
//           {/* 追加要素用スペース */}
//         </span>
//       </div>
//     </>
//   );
// }

// function clampData(item) {
//   const clampedRank = Math.min(item.rank, 99999);
//   const clampedTeam = item.team.slice(0, 10);
//   const clampedScore = Math.min(item.score, 999999);
//   return {
//     rank: clampedRank,
//     team: clampedTeam,
//     score: clampedScore,
//   };
// }

"use client";

import React, { useState } from "react";
import Image from "next/image";

// スコアカテゴリーの型を4種類に限定
type ScoreCategory = "total" | "falling" | "cut" | "number";

// 各チームのデータ型の定義
interface TeamData {
  team: string;
  total: number;
  falling: number;
  cut: number;
  number: number;
}

// サンプル生データ
const rawData: TeamData[] = [
  { team: "Team A", total: 9000, falling: 4500, cut: 2500, number: 2000 },
  { team: "Team B", total: 7500, falling: 3300, cut: 3000, number: 2200 },
  { team: "Team C", total: 10000, falling: 5000, cut: 1000, number: 4000 },
  { team: "Team D", total: 8000, falling: 3700, cut: 3200, number: 1100 },
  { team: "Team E", total: 8500, falling: 4000, cut: 2800, number: 1700 },
  { team: "Team F", total: 9500, falling: 6000, cut: 3000, number: 500 },
  // { team: "Team G", total: 7500, falling: 3300, cut: 3000, number: 2200 },
  // { team: "Team H", total: 7500, falling: 3300, cut: 3000, number: 2200 },
  // { team: "Team I", total: 7500, falling: 3300, cut: 3000, number: 2200 },
  // { team: "Team J", total: 7500, falling: 3300, cut: 3000, number: 2200 },
  // { team: "Team K", total: 7500, falling: 3300, cut: 3000, number: 2200 },
  // { team: "Team L", total: 7500, falling: 3300, cut: 3000, number: 2200 },
  // { team: "Team M", total: 7500, falling: 3300, cut: 3000, number: 2200 },
  // 必要に応じてさらにデータを追加
];

// 各項目に表示制限をかける関数
function clampData(item: TeamData): TeamData {
  return {
    team: item.team.slice(0, 10), // チーム名は先頭10文字まで
    total: Math.min(item.total, 99999),        // 総スコアは最大5桁
    falling: Math.min(item.falling, 999999),     // 落下物ゲームスコアは最大6桁
    cut: Math.min(item.cut, 999999),             // 食べ物カットスコアは最大6桁
    number: Math.min(item.number, 999999),       // 数字ゲームスコアは最大6桁
  };
}

export default function Home() {
  // 初期表示は「総スコア」（"total"）
  const [selectedCategory, setSelectedCategory] = useState<ScoreCategory>("total");

  // 各カテゴリーの表示名
  const categoryDisplay: Record<ScoreCategory, string> = {
    total: "総スコア",
    falling: "落下物ゲームスコア",
    cut: "食べ物カットスコア",
    number: "数字ゲームスコア",
  };

  // rawData に制限をかけたデータを生成
  const processedData: TeamData[] = rawData.map(clampData);

  // 選択中のカテゴリーで降順ソートしたランキングデータ
  const sortedData = [...processedData].sort(
    (a, b) => b[selectedCategory] - a[selectedCategory]
  );

  return (
    <div style={{ padding: "1rem" }}>
      {/* 4種類のカテゴリー選択ボタン */}
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

      {/* タイトル部 */}
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
            width: "80%",
          }}
        >
          <colgroup>
            {/* 列幅の割り当て：順位20%、チーム名60%、スコア20% */}
            <col style={{ width: "20%" }} />
            <col style={{ width: "60%" }} />
            <col style={{ width: "20%" }} />
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
                key={item.team}
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
                  }}
                >
                  {item[selectedCategory]}点
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
           style={{
             position: "fixed",
             top: "80%",
             left: "5%",
             transform: "translate(-50%, -50%) scale(0.5)",
           }}
      >
           <Image
             src="/images/Apple.png"
             alt="リンゴの画像"
             width={200}
             height={200}
            ></Image> 
      </div>      
      <div
          style={{
            position: "fixed",
            top: "20%",
            left: "95%",
            transform: "translate(-50%, -50%) scale(0.5)",
          }}
        >
          <Image
            src="/images/ApplePie.jpeg"
            alt="アップルパイの画像"
            width={200}
            height={200}
          />
        </div>

      {/* ※ 装飾用画像が必要なら、ここに Image コンポーネントなどを追加 */}
    </div>
  );
}
