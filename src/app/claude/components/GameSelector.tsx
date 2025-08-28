/**
 * ゲーム選択コンポーネント
 */
interface GameSelectorProps {
  selectedGames: string[];
  onGameToggle: (game: string) => void;
}

export const GameSelector: React.FC<GameSelectorProps> = ({
  selectedGames,
  onGameToggle,
}) => {
  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">
        表示するゲームを選択
      </h3>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
          <input
            type="checkbox"
            checked={selectedGames.includes("game1")}
            onChange={() => onGameToggle("game1")}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">Game 1</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
          <input
            type="checkbox"
            checked={selectedGames.includes("game2")}
            onChange={() => onGameToggle("game2")}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">Game 2</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
          <input
            type="checkbox"
            checked={selectedGames.includes("game3")}
            onChange={() => onGameToggle("game3")}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">Game 3</span>
        </label>
        <div className="ml-auto text-sm text-gray-500">
          選択中: {selectedGames.length}個のゲーム
        </div>
      </div>
    </div>
  );
};
