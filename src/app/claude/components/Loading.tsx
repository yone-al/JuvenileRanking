/**
 * ローディング画面コンポーネント
 */
export const Loading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-center">
        {/* メインローディングアニメーション */}
        <div className="relative mb-6">
          <div className="animate-bounce text-6xl mb-4">🍎</div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
        </div>

        {/* ローディングテキスト */}
        <p className="text-lg text-gray-600">ランキングデータを読み込み中...</p>

        {/* ドットアニメーション */}
        <div className="flex justify-center mt-4 space-x-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
