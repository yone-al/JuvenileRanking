// Client-side data fetching utility
// Uses Next.js API Route to avoid CORS issues with Google Apps Script

import { TeamData } from "@/interface";

/**
 * Fetches team ranking data from the API route
 * @returns Promise<TeamData[]> - Array of team data
 */
export async function getItems(): Promise<TeamData[]> {
  try {
    const response = await fetch('/api/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Disable caching for real-time data
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: TeamData[] = await response.json();
    return data;
    
  } catch (error) {
    console.error('Client fetch error:', error);
    throw error;
  }
}

/**
 * Fetches data with retry logic for better reliability
 * @param maxRetries - Maximum number of retry attempts
 * @param retryDelay - Delay between retries in milliseconds
 */
export async function getItemsWithRetry(
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<TeamData[]> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await getItems();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      console.warn(`Attempt ${attempt} failed:`, lastError.message);
      
      if (attempt < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        // Exponential backoff
        retryDelay *= 2;
      }
    }
  }
  
  throw lastError!;
}