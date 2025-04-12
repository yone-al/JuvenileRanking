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
// // }
// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";

// // 4種類のスコアカテゴリー
// type ScoreCategory = "total" | "falling" | "cut" | "number";

// // API から取得するデータの型
// interface TeamData {
//   team: string;    // 「名前」
//   total: number;   // 「総計」または（落下物＋調理＋レジ）
//   falling: number; // 「落下物」
//   cut: number;     // 「調理」
//   number: number;  // 「レジ」
// }

// // 各項目に上限制限をかける関数（必要であれば）
// function clampData(item: TeamData): TeamData {
//   return {
//     team: item.team.slice(0, 10),
//     total: Math.min(item.total, 99999),
//     falling: Math.min(item.falling, 999999),
//     cut: Math.min(item.cut, 999999),
//     number: Math.min(item.number, 999999),
//   };
// }

// export default function HomePage() {
//   // 初期表示は「総スコア」
//   const [selectedCategory, setSelectedCategory] = useState<ScoreCategory>("total");
//   // API から取得したチームデータ
//   const [teamData, setTeamData] = useState<TeamData[]>([]);

//   // カテゴリー名の表示用
//   const categoryDisplay: Record<ScoreCategory, string> = {
//     total: "総スコア",
//     falling: "落下物ゲームスコア",
//     cut: "食べ物カットスコア",
//     number: "数字ゲームスコア",
//   };

//   // API エンドポイント URL (POST { "mode": "readAll" } を送信)
//   const apiUrl =
//     "https://script.google.com/macros/s/AKfycbySsPF65tyanLnoJOQVyuuGVgJ-6n1squtOEAux2L7FSt0gwfZGa0wpkBYKWNEWIUeRtA/exec";

//   // マウント時にAPIからデータを取得
//   useEffect(() => {
//     fetch(apiUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mode: "readAll" }),
//     })
//       .then((res) => {
//         console.log("Response status:", res.status);
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Fetched data:", data);
//         // dataが配列でない場合は [data] に変換
//         const entries = Array.isArray(data) ? data : [data];
//         // 各エントリーは { "名前": ..., "落下物": ..., "調理": ..., "レジ": ..., "総計": ... } を返す前提
//         const fetchedData: TeamData[] = entries.map((entry: any) => {
//           const team = entry["名前"] || "";
//           const falling = Number(entry["落下物"]) || 0;
//           const cut = Number(entry["調理"]) || 0;
//           const numberVal = Number(entry["レジ"]) || 0;
//           // 総計が存在すればそれを、存在しなければ falling+cut+numberVal を使用
//           const total =
//             entry["総計"] !== undefined
//               ? Number(entry["総計"])
//               : falling + cut + numberVal;
//           return { team, total, falling, cut, number: numberVal };
//         });
//         const clamped = fetchedData.map(clampData);
//         console.log("Clamped data:", clamped);
//         setTeamData(clamped);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch data:", err);
//       });
//   }, [apiUrl]);

//   // 選択されたカテゴリーで降順にソート
//   const sortedData = [...teamData].sort(
//     (a, b) => b[selectedCategory] - a[selectedCategory]
//   );

//   return (
//     <div style={{ padding: "1rem" }}>
//       {/* カテゴリー選択ボタン（固定しない場合もここに配置） */}
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
//               <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>
//                 順位
//               </th>
//               <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>
//                 チーム名
//               </th>
//               <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>
//                 スコア
//               </th>
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

//       {/* 固定配置：リンゴ（左下）とアップルパイ（右上） */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: "10%",
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
//           top: "10%",
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


// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";

// // 4種類のスコアカテゴリー
// type ScoreCategory = "total" | "falling" | "cut" | "number";

// // API から取得するデータの型（キー名は API のレスポンスに合わせる）
// interface ApiEntry {
//   名前?: string;
//   落下物?: string | number;
//   調理?: string | number;
//   レジ?: string | number;
//   総計?: string | number;
// }

// // API から取得したデータを格納する型
// interface TeamData {
//   team: string;    // チーム名
//   total: number;   // 総計（落下物＋調理＋レジまたはAPIの総計）
//   falling: number; // 落下物
//   cut: number;     // 調理
//   number: number;  // レジ
// }

// // 各項目に上限制限をかける関数（必要に応じて）
// function clampData(item: TeamData): TeamData {
//   return {
//     team: item.team.slice(0, 10),
//     total: Math.min(item.total, 99999),
//     falling: Math.min(item.falling, 999999),
//     cut: Math.min(item.cut, 999999),
//     number: Math.min(item.number, 999999),
//   };
// }

// export default function HomePage() {
//   // 初期表示は「総スコア」
//   const [selectedCategory, setSelectedCategory] = useState<ScoreCategory>("total");
//   // API から取得したチームデータ
//   const [teamData, setTeamData] = useState<TeamData[]>([]);

//   // カテゴリー名の表示用
//   const categoryDisplay: Record<ScoreCategory, string> = {
//     total: "総スコア",
//     falling: "落下物ゲームスコア",
//     cut: "食べ物カットスコア",
//     number: "数字ゲームスコア",
//   };

//   // API エンドポイント URL (POST { "mode": "readAll" } を送信)
//   const apiUrl =
//     "https://script.google.com/macros/s/AKfycbySsPF65tyanLnoJOQVyuuGVgJ-6n1squtOEAux2L7FSt0gwfZGa0wpkBYKWNEWIUeRtA/exec";

//   // マウント時にAPIからデータを取得
//   useEffect(() => {
//     fetch(apiUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mode: "readAll" }),
//     })
//       .then((res) => {
//         console.log("Response status:", res.status);
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Fetched data:", data);
//         // data が配列でない場合は [data] に変換
//         const entries: ApiEntry[] = Array.isArray(data) ? data : [data];
//         // 各エントリーは { "名前": ..., "落下物": ..., "調理": ..., "レジ": ..., "総計": ... } を返す前提
//         const fetchedData: TeamData[] = entries.map((entry: ApiEntry) => {
//           const team = entry["名前"] || "";
//           const falling = Number(entry["落下物"]) || 0;
//           const cut = Number(entry["調理"]) || 0;
//           const numberVal = Number(entry["レジ"]) || 0;
//           // 総計が存在すればそれを、存在しなければ falling + cut + numberVal を使用
//           const total =
//             entry["総計"] !== undefined
//               ? Number(entry["総計"])
//               : falling + cut + numberVal;
//           return { team, total, falling, cut, number: numberVal };
//         });
//         const clamped = fetchedData.map(clampData);
//         console.log("Clamped data:", clamped);
//         setTeamData(clamped);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch data:", err);
//       });
//   }, [apiUrl]);

//   // 選択されたカテゴリーで降順にソート
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
//               <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>
//                 順位
//               </th>
//               <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>
//                 チーム名
//               </th>
//               <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>
//                 スコア
//               </th>
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

//       {/* 固定配置：リンゴ（左下）とアップルパイ（右上） */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: "10%",
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
//           top: "10%",
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

// 4種類のスコアカテゴリー（各項目名を表します）
type ScoreCategory = "total" | "falling" | "cut" | "number";

// Google Apps Script から受け取るレスポンスの各項目の型
interface ApiEntry {
  名前?: string;
  落下物?: string | number;
  調理?: string | number;
  レジ?: string | number;
  総計?: string | number;
}

// クライアント側で扱うデータの型
interface TeamData {
  team: string;    // チーム名（名前）
  total: number;   // 総計（API の「総計」があればそれ、なければ各項目の合計）
  falling: number; // 落下物
  cut: number;     // 調理
  number: number;  // レジ
}

// 各項目に上限制限をかける関数（任意の調整）
function clampData(item: TeamData): TeamData {
  return {
    team: item.team.slice(0, 10),
    total: Math.min(item.total, 99999),
    falling: Math.min(item.falling, 999999),
    cut: Math.min(item.cut, 999999),
    number: Math.min(item.number, 999999),
  };
}

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
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const fullUrl = proxyUrl + apiUrl;

    // POST で送信するデータ：今回は「名前」「落下物」「調理」「レジ」「総計」を渡しています。
    // 実際のアプリケーションで動的にする場合は、フォームなどから値を取得してください。
    const dataPayload = {
      名前: "井上",
      落下物: 200,
      調理: 300,
      レジ: 400,
      総計: 900
    };

    fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataPayload)
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        // もしデータが配列でない場合は、配列に変換
        const entries: ApiEntry[] = Array.isArray(data) ? data : [data];

        // 各エントリーを TeamData 型に変換
        const fetchedData: TeamData[] = entries.map((entry: ApiEntry) => {
          const team = entry["名前"] || "";
          const falling = Number(entry["落下物"]) || 0;
          const cut = Number(entry["調理"]) || 0;
          const numberVal = Number(entry["レジ"]) || 0;
          // 総計が存在すればその値、なければ falling + cut + numberVal を合計として使用
          const total =
            entry["総計"] !== undefined
              ? Number(entry["総計"])
              : falling + cut + numberVal;
          return { team, total, falling, cut, number: numberVal };
        });

        // 各項目の上限を適用
        const clamped = fetchedData.map(clampData);
        console.log("Clamped data:", clamped);
        setTeamData(clamped);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
      });
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

