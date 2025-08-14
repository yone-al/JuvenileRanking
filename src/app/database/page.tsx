import { getAllDataByTotal, type ScoreData } from "@/lib/database";

export default async function DatabasePage() {
  const data: ScoreData[] = await getAllDataByTotal();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">スコア ランキング</h1>

      {data.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-12">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-2">
              まだデータが登録されていません
            </p>
            <p className="text-gray-400">最初のスコアを登録してください！</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="ranking-table min-w-full">
            <thead>
              <tr>
                <th>
                  順位
                </th>
                <th>
                  プレイヤー名
                </th>
                <th>
                  Game 1
                </th>
                <th>
                  Game 2
                </th>
                <th>
                  Game 3
                </th>
                <th>
                  合計スコア
                </th>
                <th>
                  登録日時
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row.id}>
                  <td className="rank-cell">
                    {index === 0 && "🥇 1位"}
                    {index === 1 && "🥈 2位"}
                    {index === 2 && "🥉 3位"}
                    {index > 2 && `${index + 1}位`}
                  </td>
                  <td className="player-cell">
                    {row.name}
                  </td>
                  <td className="score-cell">
                    {row.game1.toLocaleString()}
                  </td>
                  <td className="score-cell">
                    {row.game2.toLocaleString()}
                  </td>
                  <td className="score-cell">
                    {row.game3.toLocaleString()}
                  </td>
                  <td className="total-cell">
                    {row.total.toLocaleString()}点
                  </td>
                  <td className="date-cell">
                    {new Date(row.created_at).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        総レコード数: {data.length}
      </div>
    </div>
  );
}
