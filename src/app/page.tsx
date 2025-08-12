// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import { getItems } from "@/func";
// import { TeamData } from "@/interface";

// // 5種類のスコアカテゴリー
// type ScoreCategory = "latest" | "total" | "falling" | "cut" | "number";
// const categories: ScoreCategory[] = [
//   "latest",
//   "total",
//   "falling",
//   "cut",
//   "number",
// ];

// export default function HomePage() {
//   // --- 状態変数 ---
//   const [selectedCategory, setSelectedCategory] =
//     useState<ScoreCategory>("latest");
//   const [teamData, setTeamData] = useState<TeamData[]>([]);

//   // タイマー ID を保持する refs
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // 表示用ラベル
//   const categoryDisplay: Record<ScoreCategory, string> = {
//     latest: "トップ5",
//     total: "総スコア",
//     falling: "Game1 スコア",
//     cut: "Game2 スコア",
//     number: "Game3 スコア",
//   };

//   const apiUrl =
//     "https://script.google.com/macros/s/AKfycbySsPF65tyanLnoJOQVyuuGVgJ-6n1squtOEAux2L7FSt0gwfZGa0wpkBYKWNEWIUeRtA/exec";

//   // --- データ取得 ---
//   useEffect(() => {
//     (async () => {
//       try {
//         const result = await getItems(apiUrl);
//         setTeamData(result);
//       } catch (error) {
//         console.error("API fetch error:", error);
//       }
//     })();
//   }, [apiUrl]);

//   // --- タイマー制御 ---
//   const clearAuto = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   };
//   const clearHold = () => {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = null;
//     }
//   };
//   const rotateNext = () => {
//     setSelectedCategory((prev) => {
//       const idx = categories.indexOf(prev);
//       return categories[(idx + 1) % categories.length];
//     });
//   };
//   const startAuto = () => {
//     clearAuto();
//     intervalRef.current = setInterval(() => {
//       rotateNext();
//     }, 5000);
//   };

//   // マウント時に自動切り替え開始、アンマウント時にクリア
//   useEffect(() => {
//     startAuto();
//     return () => {
//       clearAuto();
//       clearHold();
//     };
//   }, []);

//   // 手動切り替えハンドラ
//   const handleCategoryClick = (cat: ScoreCategory) => {
//     clearAuto();
//     clearHold();
//     setSelectedCategory(cat);
//     timeoutRef.current = setTimeout(() => {
//       rotateNext();
//       startAuto();
//     }, 30 * 1000);
//   };

//   // --- レンダリング用データ ---
//   // "Player" または チーム名空欄 を除外
//   const validTeamData = teamData.filter(
//     (item) => item.team.trim() !== "" && item.team !== "Player"
//   );
//   const latestTeam =
//     validTeamData.length > 0
//       ? [...validTeamData].reverse()[0]
//       : null;
//   const sortedByTotal = [...validTeamData].sort((a, b) => b.total - a.total);
//   const latestRank =
//     latestTeam != null
//       ? sortedByTotal.findIndex((item) => item === latestTeam) + 1
//       : null;
//   const totalTeams = sortedByTotal.length;
//   const sortedData =
//     selectedCategory === "latest"
//       ? sortedByTotal
//       : [...validTeamData].sort(
//           (a, b) => b[selectedCategory] - a[selectedCategory]
//         );
//   const displayData =
//     selectedCategory === "latest" ? sortedData.slice(0, 5) : sortedData;

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
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => handleCategoryClick(cat)}
//             style={{
//               padding: "0.5rem 1rem",
//               fontSize: "1.2rem",
//               backgroundColor:
//                 selectedCategory === cat ? "#3CB371" : "#ddd",
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

//       {/* テーブルコンテナ */}
//       <div
//         style={{
//           maxHeight: selectedCategory === "latest" ? "400px" : undefined,
//           overflowY: selectedCategory === "latest" ? "auto" : undefined,
//           overflowX: "auto",
//           textAlign: "center",
//           marginBottom:
//             selectedCategory === "latest" ? "2rem" : "1rem",
//         }}
//       >
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
//             {displayData.map((item, index) => (
//               <tr
//                 key={`${item.team}-${index}`}
//                 style={{
//                   borderBottom: "1px solid #ccc",
//                   backgroundColor:
//                     index % 2 === 0 ? "#f2f2f2" : "#ffffff",
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
//                   {selectedCategory === "latest"
//                     ? item.total
//                     : item[selectedCategory]}
//                   点
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* 最新チーム情報：カード風 */}
//       {selectedCategory === "latest" && latestTeam && (
//         <div
//           style={{
//             width: "60%",
//             margin: "0 auto",
//             padding: "1.5rem",
//             border: "2px solid #3CB371",
//             borderRadius: "8px",
//             backgroundColor: "#f8fff8",
//             textAlign: "center",
//           }}
//         >
//           <h2
//             style={{
//               fontSize: "1.8rem",
//               margin: "0 0 0.5rem",
//               color: "#2e7d32",
//             }}
//           >
//             最新チーム：{latestTeam.team}
//             {latestRank != null &&
//               `（${latestRank}位／${totalTeams}組中）`}
//           </h2>
//           <p style={{ fontSize: "1.5rem", margin: 0 }}>
//             総スコア：{latestTeam.total}点
//           </p>
//         </div>
//       )}

//       {/* 固定画像 */}
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


// // "use client";

// // import React, { useState, useEffect, useRef } from "react";
// // import Image from "next/image";
// // import { getItems } from "@/func";
// // import { TeamData } from "@/interface";

// // // 5種類のスコアカテゴリー
// // type ScoreCategory = "latest" | "total" | "falling" | "cut" | "number";
// // const categories: ScoreCategory[] = [
// //   "latest",
// //   "total",
// //   "falling",
// //   "cut",
// //   "number",
// // ];

// // export default function HomePage() {
// //   // --- 状態変数 ---
// //   const [selectedCategory, setSelectedCategory] =
// //     useState<ScoreCategory>("latest");
// //   const [teamData, setTeamData] = useState<TeamData[]>([]);

// //   // タイマー ID を保持する refs
// //   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
// //   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

// //   // 表示用ラベル
// //   const categoryDisplay: Record<ScoreCategory, string> = {
// //     latest: "最新＋トップ10",
// //     total: "総スコア",
// //     falling: "Game1 スコア",
// //     cut: "Game2 スコア",
// //     number: "Game3 スコア",
// //   };

// //   const apiUrl =
// //     "https://script.google.com/macros/s/AKfycbySsPF65tyanLnoJOQVyuuGVgJ-6n1squtOEAux2L7FSt0gwfZGa0wpkBYKWNEWIUeRtA/exec";

// //   // --- データ取得 ---
// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const result = await getItems(apiUrl);
// //         setTeamData(result);
// //       } catch (error) {
// //         console.error("API fetch error:", error);
// //       }
// //     })();
// //   }, [apiUrl]);

// //   // --- タイマー制御 ---
// //   const clearAuto = () => {
// //     if (intervalRef.current) {
// //       clearInterval(intervalRef.current);
// //       intervalRef.current = null;
// //     }
// //   };
// //   const clearHold = () => {
// //     if (timeoutRef.current) {
// //       clearTimeout(timeoutRef.current);
// //       timeoutRef.current = null;
// //     }
// //   };
// //   const rotateNext = () => {
// //     setSelectedCategory((prev) => {
// //       const idx = categories.indexOf(prev);
// //       return categories[(idx + 1) % categories.length];
// //     });
// //   };
// //   const startAuto = () => {
// //     clearAuto();
// //     intervalRef.current = setInterval(() => {
// //       rotateNext();
// //     }, 5000);
// //   };

// //   // マウント時に自動切り替え開始、アンマウント時にクリア
// //   useEffect(() => {
// //     startAuto();
// //     return () => {
// //       clearAuto();
// //       clearHold();
// //     };
// //   }, []);

// //   // 手動切り替えハンドラ
// //   const handleCategoryClick = (cat: ScoreCategory) => {
// //     clearAuto();
// //     clearHold();
// //     setSelectedCategory(cat);
// //     timeoutRef.current = setTimeout(() => {
// //       rotateNext();
// //       startAuto();
// //     }, 30 * 1000);
// //   };

// //   // --- レンダリング用データ ---
// //   const latestTeam =
// //     teamData.length > 0
// //       ? [...teamData].reverse().find((item) => item.team !== "Player") || null
// //       : null;
// //   const sortedByTotal = [...teamData].sort((a, b) => b.total - a.total);
// //   const latestRank =
// //     latestTeam != null
// //       ? sortedByTotal.findIndex((item) => item === latestTeam) + 1
// //       : null;
// //   const totalTeams = sortedByTotal.length;
// //   const sortedData =
// //     selectedCategory === "latest"
// //       ? sortedByTotal
// //       : [...teamData].sort((a, b) => b[selectedCategory] - a[selectedCategory]);
// //   const displayData =
// //     selectedCategory === "latest" ? sortedData.slice(0, 10) : sortedData;

// //   return (
// //     <div style={{ padding: "1rem" }}>
// //       {/* カテゴリー選択ボタン */}
// //       <div
// //         style={{
// //           display: "flex",
// //           justifyContent: "center",
// //           gap: "1rem",
// //           marginBottom: "1.5rem",
// //         }}
// //       >
// //         {categories.map((cat) => (
// //           <button
// //             key={cat}
// //             onClick={() => handleCategoryClick(cat)}
// //             style={{
// //               padding: "0.5rem 1rem",
// //               fontSize: "1.2rem",
// //               backgroundColor:
// //                 selectedCategory === cat ? "#3CB371" : "#ddd",
// //               color: selectedCategory === cat ? "#fff" : "#000",
// //               border: "none",
// //               borderRadius: "5px",
// //               cursor: "pointer",
// //             }}
// //           >
// //             {categoryDisplay[cat]}
// //           </button>
// //         ))}
// //       </div>

// //       {/* タイトル */}
// //       <div style={{ textAlign: "center", marginBottom: "1rem" }}>
// //         <h1 style={{ fontWeight: "bold", fontSize: "3rem", margin: 0 }}>
// //           {categoryDisplay[selectedCategory]} ランキング
// //         </h1>
// //       </div>

// //       {/* テーブルコンテナ */}
// //       <div
// //         style={{
// //           maxHeight: selectedCategory === "latest" ? "400px" : undefined,
// //           overflowY: selectedCategory === "latest" ? "auto" : undefined,
// //           overflowX: "auto",
// //           textAlign: "center",
// //           marginBottom:
// //             selectedCategory === "latest" ? "2rem" : "1rem",
// //         }}
// //       >
// //         <table
// //           style={{
// //             margin: "0 auto",
// //             borderCollapse: "collapse",
// //             tableLayout: "fixed",
// //             width: "60%",
// //           }}
// //         >
// //           <colgroup>
// //             <col style={{ width: "20%" }} />
// //             <col style={{ width: "40%" }} />
// //             <col style={{ width: "40%" }} />
// //           </colgroup>
// //           <thead>
// //             <tr style={{ borderBottom: "2px solid #000" }}>
// //               <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>
// //                 順位
// //               </th>
// //               <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>
// //                 チーム名
// //               </th>
// //               <th style={{ padding: "0.75rem", fontSize: "1.5rem" }}>
// //                 スコア
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {displayData.map((item, index) => (
// //               <tr
// //                 key={`${item.team}-${index}`}
// //                 style={{
// //                   borderBottom: "1px solid #ccc",
// //                   backgroundColor:
// //                     index % 2 === 0 ? "#f2f2f2" : "#ffffff",
// //                 }}
// //               >
// //                 <td
// //                   style={{
// //                     padding: "0.75rem",
// //                     verticalAlign: "middle",
// //                     fontSize: "1.3rem",
// //                     textAlign: "center",
// //                   }}
// //                 >
// //                   {index + 1}位
// //                 </td>
// //                 <td
// //                   style={{
// //                     padding: "0.75rem",
// //                     verticalAlign: "middle",
// //                     fontSize: "1.3rem",
// //                     textAlign: "center",
// //                     whiteSpace: "nowrap",
// //                   }}
// //                 >
// //                   {item.team}
// //                 </td>
// //                 <td
// //                   style={{
// //                     padding: "0.75rem",
// //                     verticalAlign: "middle",
// //                     fontSize: "1.3rem",
// //                     textAlign: "center",
// //                     whiteSpace: "nowrap",
// //                   }}
// //                 >
// //                   {selectedCategory === "latest"
// //                     ? item.total
// //                     : item[selectedCategory]}
// //                   点
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* 最新チーム情報：カード風 */}
// //       {selectedCategory === "latest" && latestTeam && (
// //         <div
// //           style={{
// //             width: "60%",
// //             margin: "0 auto",
// //             padding: "1.5rem",
// //             border: "2px solid #3CB371",
// //             borderRadius: "8px",
// //             backgroundColor: "#f8fff8",
// //             textAlign: "center",
// //           }}
// //         >
// //           <h2
// //             style={{
// //               fontSize: "1.8rem",
// //               margin: "0 0 0.5rem",
// //               color: "#2e7d32",
// //             }}
// //           >
// //             最新チーム：{latestTeam.team}
// //             {latestRank != null &&
// //               `（${latestRank}位／${totalTeams}人中）`}
// //           </h2>
// //           <p style={{ fontSize: "1.5rem", margin: 0 }}>
// //             総スコア：{latestTeam.total}点
// //           </p>
// //         </div>
// //       )}

// //       {/* 固定画像 */}
// //       <div
// //         style={{
// //           position: "fixed",
// //           bottom: "1%",
// //           left: "10%",
// //           transform: "translate(-50%, -50%) scale(0.6)",
// //         }}
// //       >
// //         <Image
// //           src="/images/Apple.png"
// //           alt="リンゴの画像"
// //           width={200}
// //           height={200}
// //         />
// //       </div>
// //       <div
// //         style={{
// //           position: "fixed",
// //           top: "20%",
// //           right: "10%",
// //           transform: "translate(50%, -50%) scale(0.6)",
// //         }}
// //       >
// //         <Image
// //           src="/images/ApplePie.jpeg"
// //           alt="アップルパイの画像"
// //           width={200}
// //           height={200}
// //         />
// //       </div>
// //     </div>
// //   );
// // }
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getItems } from "@/func";
import { TeamData } from "@/interface";

// 6種類のスコアカテゴリー
type ScoreCategory = "latest" | "recent" | "total" | "falling" | "cut" | "number";
const categories: ScoreCategory[] = [
  "latest",
  "recent",
  "total",
  "falling",
  "cut",
  "number",
];

export default function HomePage() {
  // --- 状態変数 ---
  const [selectedCategory, setSelectedCategory] =
    useState<ScoreCategory>("latest");
  const [teamData, setTeamData] = useState<TeamData[]>([]);

  // タイマー ID を保持する refs
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 表示用ラベル
  const categoryDisplay: Record<ScoreCategory, string> = {
    latest: "トップ5",
    recent: "最近30件",
    total: "総スコア",
    falling: "Game1 スコア",
    cut: "Game2 スコア",
    number: "Game3 スコア",
  };

  const apiUrl =
    "https://script.google.com/macros/s/AKfycbySsPF65tyanLnoJOQVyuuGVgJ-6n1squtOEAux2L7FSt0gwfZGa0wpkBYKWNEWIUeRtA/exec";

  // --- データ取得 ---
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

  // --- タイマー制御 ---
  const clearAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  const clearHold = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  const rotateNext = () => {
    setSelectedCategory((prev) => {
      const idx = categories.indexOf(prev);
      return categories[(idx + 1) % categories.length];
    });
  };
  const startAuto = () => {
    clearAuto();
    intervalRef.current = setInterval(() => {
      rotateNext();
    }, 5000); // 5秒ごとにタブを切り替え
  };

  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ 修正箇所 ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  // マウント時に自動切り替え開始、アンマウント時にクリア
  useEffect(() => {
    // 初回ロード時、20秒間は最初のタブで静止
    const initialDelay = setTimeout(() => {
      // 20秒後に最初のタブ切り替えを実行
      rotateNext();
      // その後、5秒ごとの自動切り替えを開始
      startAuto();
    }, 20000); // 20秒 = 20000ミリ秒

    // 設定したタイマーのIDをrefに保存
    timeoutRef.current = initialDelay;

    // コンポーネントがアンマウントされる際にタイマーをすべてクリア
    return () => {
      clearAuto();
      clearHold();
    };
  }, []); // このeffectはマウント時に一度だけ実行する
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ 修正箇所 ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

  // 手動切り替えハンドラ
  const handleCategoryClick = (cat: ScoreCategory) => {
    clearAuto();
    clearHold();
    setSelectedCategory(cat);
    timeoutRef.current = setTimeout(() => {
      rotateNext();
      startAuto();
    }, 30 * 1000);
  };

  // --- レンダリング用データ ---
  // "Player" または チーム名空欄 を除外
  const validTeamData = teamData.filter(
    (item) => item.team.trim() !== "" && item.team !== "Player"
  );
  const latestTeam =
    validTeamData.length > 0
      ? [...validTeamData].reverse()[0]
      : null;
  const sortedByTotal = [...validTeamData].sort((a, b) => b.total - a.total);
  
  // 最近30件のデータとその中での順位計算
  const recent30Teams = [...validTeamData].slice(-30);
  const recent30Sorted = [...recent30Teams].sort((a, b) => b.total - a.total);
  const recentRank = 
    latestTeam != null && recent30Teams.includes(latestTeam)
      ? recent30Sorted.findIndex((item) => item === latestTeam) + 1
      : null;
  const recent30Count = recent30Teams.length;
  
  const latestRank =
    latestTeam != null
      ? sortedByTotal.findIndex((item) => item === latestTeam) + 1
      : null;
  const totalTeams = sortedByTotal.length;
  const sortedData =
    selectedCategory === "latest"
      ? sortedByTotal
      : selectedCategory === "recent"
      ? recent30Sorted
      : [...validTeamData].sort(
          (a, b) => b[selectedCategory] - a[selectedCategory]
        );
  const displayData =
    selectedCategory === "latest" ? sortedData.slice(0, 5) : sortedData;

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
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
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

      {/* テーブルコンテナ */}
      <div
        style={{
          maxHeight: selectedCategory === "latest" ? "400px" : undefined,
          overflowY: selectedCategory === "latest" ? "auto" : undefined,
          overflowX: "auto",
          textAlign: "center",
          marginBottom:
            selectedCategory === "latest" ? "2rem" : "1rem",
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
                  {index + 1 === 1 && "🥇 1位"}
                  {index + 1 === 2 && "🥈 2位"}
                  {index + 1 === 3 && "🥉 3位"}
                  {index + 1 > 3 && `${index + 1}位`}
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
                  {selectedCategory === "latest" || selectedCategory === "recent"
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
      {(selectedCategory === "latest" || selectedCategory === "recent") && latestTeam && (
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
            {selectedCategory === "recent" 
              ? recentRank != null && `（${recentRank}位／${recent30Count}組中）`
              : latestRank != null && `（${latestRank}位／${totalTeams}組中）`}
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