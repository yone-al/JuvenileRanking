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
//           <h1 style={{ fontWeight: "bold", fontSize: "2rem", margin: 0 }}>
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
//             //maxHeight: "40vh",
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
//                 <th>順位</th>
//                 <th>チーム名</th>
//                 <th>スコア</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rankingData.map((item, index) => (
//                 <tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
//                   <td style={{ padding: "0.5rem", verticalAlign: "middle" }}>
//                     {/* rank が 5桁以上でも 99999 で表示 */}
//                     {item.rank}位
//                   </td>
//                   <td style={{ padding: "0.5rem", verticalAlign: "middle" }}>
//                     {/* team が 10文字以上でも slice(0,10) で表示 */}
//                     {item.team}
//                   </td>
//                   <td style={{ padding: "0.5rem", verticalAlign: "middle" }}>
//                     {/* score が 6桁以上でも 999999 で表示 */}
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
//           <Image src="/images/Apple.png" alt="リンゴの画像" width={200} height={200} />
//         </div>
//         <div
//           style={{
//             position: "fixed",
//             top: "80%",
//             left: "85%",
//             transform: "translate(-50%, -50%) scale(1.4)",
//           }}
//         >
//           <Image src="/images/ApplePie.jpeg" alt="アップルパイの画像" width={200} height={200} />
//         </div>
//         <div
//           style={{
//             position: "fixed",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%) scale(2.4,2)",
//           }}
//         >
//           <Image src="/images/Frame.png" alt="フレームの画像" width={1000} height={1000} />
//         </div>
//       </div>

//      <div style={{ position: "relative", height: "50vh" }}>
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
//         </span>
//       </div>
//     </>

//     // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//     //   <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//     //     <Image
//     //       className="dark:invert"
//     //       src="/next.svg"
//     //       alt="Next.js logo"
//     //       width={180}
//     //       height={38}
//     //       priority
//     //     />
//     //     <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//     //       <li className="mb-2 tracking-[-.01em]">
//     //         Get started by editing{" "}
//     //         <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
//     //           src/app/page.tsx
//     //         </code>
//     //         .
//     //       </li>
//     //       <li className="tracking-[-.01em]">
//     //         Save and see your changes instantly.
//     //       </li>
//     //     </ol>

//     //     <div className="flex gap-4 items-center flex-col sm:flex-row">
//     //       <a
//     //         className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//     //         href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//     //         target="_blank"
//     //         rel="noopener noreferrer"
//     //       >
//     //         <Image
//     //           className="dark:invert"
//     //           src="/vercel.svg"
//     //           alt="Vercel logomark"
//     //           width={20}
//     //           height={20}
//     //         />
//     //         Deploy now
//     //       </a>
//     //       <a
//     //         className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//     //         href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//     //         target="_blank"
//     //         rel="noopener noreferrer"
//     //       >
//     //         <Image
//     //           className="dark:invert"
//     //           src="/vercel.svg"
//     //           alt="Vercel logomark"
//     //           width={20}
//     //           height={20}
//     //         />
//     //         Deploy now
//     //       </a>
//     //       <a
//     //         className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//     //         href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//     //         target="_blank"
//     //         rel="noopener noreferrer"
//     //       >
//     //         Read our docs
//     //       </a>
//     //     </div>
//     //   </main>
//     //   <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//     //     <a
//     //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//     //       href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//     //       target="_blank"
//     //       rel="noopener noreferrer"
//     //     >
//     //       <Image
//     //         aria-hidden
//     //         src="/file.svg"
//     //         alt="File icon"
//     //         width={16}
//     //         height={16}
//     //       />
//     //       Learn
//     //     </a>
//     //     <a
//     //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//     //       href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//     //       target="_blank"
//     //       rel="noopener noreferrer"
//     //     >
//     //       <Image
//     //         aria-hidden
//     //         src="/window.svg"
//     //         alt="Window icon"
//     //         width={16}
//     //         height={16}
//     //       />
//     //       Examples
//     //     </a>
//     //     <a
//     //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//     //       href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//     //       target="_blank"
//     //       rel="noopener noreferrer"
//     //     >
//     //       <Image
//     //         aria-hidden
//     //         src="/globe.svg"
//     //         alt="Globe icon"
//     //         width={16}
//     //         height={16}
//     //       />
//     //       Go to nextjs.org →
//     //     </a>
//     //   </footer>
//     // </div>
//   );
//   function clampData(item) {
//     const clampedRank = Math.min(item.rank, 99999);
//     const clampedTeam = item.team.slice(0, 10);
//     const clampedScore = Math.min(item.score, 999999);
  
//     return {
//       rank: clampedRank,
//       team: clampedTeam,
//       score: clampedScore,
//     };
//   }
// }
import Image from "next/image";
import React from "react";

export default function Home() {
  // ランキングデータをオブジェクトで管理
  const rawData = [
    { rank: 1, team: "Team A", score: 10000 },
    { rank: 2, team: "Team B", score: 9500 }, 
    { rank: 3, team: "Team C", score: 9000 },
    { rank: 4, team: "Team D", score: 8500 },
    { rank: 5, team: "Team E", score: 8000 },
    { rank: 6, team: "Team F", score: 7500 },
    { rank: 7, team: "Team G", score: 7000 }, 
    { rank: 8, team: "Team H", score: 6500 },
    { rank: 9, team: "Team I", score: 6000 },
    { rank: 10, team: "Team J", score: 5500 },
    { rank: 11, team: "Team K", score: 5000 },
    { rank: 12, team: "Team L", score: 4500 },
    { rank: 13, team: "Team M", score: 4000 },
    { rank: 14, team: "Team N", score: 3500 },
    { rank: 15, team: "Team O", score: 3000 },
    { rank: 16, team: "Team P", score: 2500 },
    { rank: 17, team: "Team Q", score: 2000 },
    { rank: 18, team: "Team R", score: 1500 },
    { rank: 19, team: "Team S", score: 1000 },
    { rank: 20, team: "Team T", score: 500 },
  ];

  // データを制限値に従って加工（順位5桁, チーム名10文字, スコア6桁）
  const rankingData = rawData.map((item) => clampData(item));

  return (
    <>
      <div style={{ position: "relative", height: "100vh" }}>
        {/* タイトル */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontWeight: "bold", fontSize: "3rem", margin: 0 }}>
            ランキング
          </h1>
        </div>

        {/* ランキング本体 (テーブル) */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            overflowY: "auto",
            textAlign: "center",
          }}
        >
          <table
            style={{
              margin: "0 auto",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              width: "60%", // テーブル全体の幅を調整
            }}
          >
            <colgroup>
              {/* 順位, チーム名, スコア の列幅を固定 or 割合指定 */}
              <col style={{ width: "20%" }} />
              <col style={{ width: "40%" }} />
              <col style={{ width: "40%" }} />
            </colgroup>
            <thead>
              <tr style={{ borderBottom: "2px solid #000" }}>
                <th style={{ padding: "0.5rem", fontSize: "1.5rem" }}>順位</th>
                <th style={{ padding: "0.5rem", fontSize: "1.5rem" }}>チーム名</th>
                <th style={{ padding: "0.5rem", fontSize: "1.5rem" }}>スコア</th>
              </tr>
            </thead>
            <tbody>
              {rankingData.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #ccc",
                    backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff",
                  }}
                >
                  <td
                    style={{
                      padding: "0.5rem",
                      verticalAlign: "middle",
                      fontSize: "1.3rem",
                    }}
                  >
                    {item.rank}位
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      verticalAlign: "middle",
                      fontSize: "1.3rem",
                    }}
                  >
                    {item.team}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      verticalAlign: "middle",
                      fontSize: "1.3rem",
                    }}
                  >
                    {item.score}点
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 以下 装飾 */}
        <div
          style={{
            position: "fixed",
            top: "80%",
            left: "15%",
            transform: "translate(-50%, -50%)",
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
            top: "80%",
            left: "85%",
            transform: "translate(-50%, -50%) scale(1.4)",
          }}
        >
          <Image
            src="/images/ApplePie.jpeg"
            alt="アップルパイの画像"
            width={200}
            height={200}
          />
        </div>
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(2.4,2)",
          }}
        >
          <Image
            src="/images/Frame.png"
            alt="フレームの画像"
            width={1000}
            height={1000}
          />
        </div>
      </div>

      <div style={{ position: "relative", height: "100vh" }}>
        <span
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: "bold",
            fontSize: "2rem",
          }}
        >
          {/* 追加要素用スペース */}
        </span>
      </div>
    </>
  );
}

function clampData(item) {
  const clampedRank = Math.min(item.rank, 99999);
  const clampedTeam = item.team.slice(0, 10);
  const clampedScore = Math.min(item.score, 999999);
  return {
    rank: clampedRank,
    team: clampedTeam,
    score: clampedScore,
  };
}
