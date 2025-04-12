//NextJSにはサーバーコンポーネントという機能があります
//ブラウザ(クライアントコンポーネント)からGASを叩くとlocalhost:3000というオリジンがあるため、CORSに引っ掛かります
//なのでサーバーコンポーネントで書き直してる
'use server';


// 各項目に上限制限をかける関数（任意の調整）
import {ApiEntry, TeamData} from "@/interface";

function clampData(item: TeamData): TeamData {
    return {
        team: item.team.slice(0, 10),
        total: Math.min(item.total, 99999),
        falling: Math.min(item.falling, 999999),
        cut: Math.min(item.cut, 999999),
        number: Math.min(item.number, 999999),
    };
}
// サーバーアクションはデータを返し、クライアントコンポーネントがそれを状態に設定する
export async function getItems(url: string): Promise<TeamData[]> {

    const payload = {
        mode: "readAll"
    };
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        // もしデータが配列でない場合は、配列に変換
        const entries: ApiEntry[] = Array.isArray(data) ? data : [data];

        // 各エントリーを TeamData 型に変換
        const fetchedData: TeamData[] = entries.map((entry: ApiEntry) => {
            const team = entry["名前"] || "";
            const falling = Number(entry["落下物"]) || 0;
            const cut = Number(entry["調理"]) || 0;
            const numberVal = Number(entry["レジ"]) || 0;
            const total = entry["総計"] !== undefined
                ? Number(entry["総計"])
                : falling + cut + numberVal;
            return { team, total, falling, cut, number: numberVal };
        });

        // 各項目の上限を適用
        const clamped = fetchedData.map(clampData);
        return clamped;

    } catch (err) {
        console.error("Failed to fetch data:", err);
        throw err; // エラーをクライアントに伝播
    }
}