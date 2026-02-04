import fetch from 'node-fetch';
import { NextResponse } from 'next/server';

type CacheEntry = {
  expiresAt: number;
  data: any;
};

const CACHE_TTL_MS = 1000 * 60 * 10;

declare global {
  // eslint-disable-next-line no-var
  var __characterCache: Map<string, CacheEntry> | undefined;
}

const characterCache =
  global.__characterCache ?? (global.__characterCache = new Map());

const getCacheKey = (accountName: string, characterName: string) =>
  `${accountName}::${characterName}`;

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { hasError: true, error: 'API_URL is not configured.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const accountName = searchParams.get('account-name') || '';
  const characterName = searchParams.get('character-name') || '';

  if (!accountName || !characterName) {
    return NextResponse.json(
      {
        hasError: true,
        error: 'account-name and character-name are required.',
      },
      { status: 400 }
    );
  }

  const cacheKey = getCacheKey(accountName, characterName);
  const cached = characterCache.get(cacheKey);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return NextResponse.json(cached);
  }

  try {
    const params = new URLSearchParams({
      accountName,
      character: characterName,
    });
    const response = await fetch(`${apiUrl}/api/v1/poe1/items?${params}`);

    if (!response.ok) {
      return NextResponse.json(
        { hasError: true, error: `Upstream error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    characterCache.set(cacheKey, {
      characterData: data,
      hasError: false,
      expiresAt: now + CACHE_TTL_MS,
    });
    return NextResponse.json(
      {
        characterData: data,
        hasError: false,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { hasError: true, error: 'Error fetching items data.' },
      { status: 500 }
    );
  }
}
