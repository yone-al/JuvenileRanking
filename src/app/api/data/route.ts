import { NextResponse } from 'next/server';
import { ApiEntry, TeamData } from '@/interface';

// 各項目に上限制限をかける関数
function clampData(item: TeamData): TeamData {
  return {
    team: item.team.slice(0, 10),
    total: Math.min(item.total, 99999),
    falling: Math.min(item.falling, 999999),
    cut: Math.min(item.cut, 999999),
    number: Math.min(item.number, 999999),
  };
}

// API Route for fetching data from Google Apps Script
export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      return NextResponse.json(
        { error: 'API URL not configured' },
        { status: 500 }
      );
    }

    const payload = {
      mode: "readAll"
    };

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'JuvenileRanking/1.0.0'
      },
      body: JSON.stringify(payload),
      // Add cache control
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    // データが配列でない場合は、配列に変換
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

    return NextResponse.json(clamped, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error("API fetch error:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Enable CORS for development
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}