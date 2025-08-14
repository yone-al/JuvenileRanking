// Google Apps Script から受け取るレスポンスの各項目の型
export interface ApiEntry {
  名前?: string;
  落下物?: string | number;
  調理?: string | number;
  レジ?: string | number;
  総計?: string | number;
}

// クライアント側で扱うデータの型
export interface TeamData {
  team: string; // チーム名（名前）
  total: number; // 総計（API の「総計」があればそれ、なければ各項目の合計）
  falling: number; // 落下物
  cut: number; // 調理
  number: number; // レジ
}
