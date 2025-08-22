export default function Loading() {
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
      </div>
    </div>
  );
}
