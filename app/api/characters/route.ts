import fetch from 'node-fetch';
import { NextResponse } from 'next/server';

type CacheEntry = {
  expiresAt: number;
  data: any;
};

const CACHE_TTL_MS = 1000 * 60 * 10;

declare global {
  // eslint-disable-next-line no-var
  var __charactersCache: Map<string, CacheEntry> | undefined;
}

const charactersCache =
  global.__charactersCache ?? (global.__charactersCache = new Map());

const getCacheKey = (accountName: string, realm: string) =>
  `${accountName}::${realm}`;

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
  const realm = searchParams.get('realm') || '';

  if (!accountName) {
    return NextResponse.json(
      { hasError: true, error: 'account-name is required.' },
      { status: 400 }
    );
  }

  const cacheKey = getCacheKey(accountName, realm);
  const cached = charactersCache.get(cacheKey);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return NextResponse.json({ data: cached.data }, { status: 200 });
  }

  try {
    const params = new URLSearchParams({ accountName });
    if (realm) {
      params.append('realm', realm);
    }

    const response = await fetch(`${apiUrl}/api/v1/poe1/characters?${params}`);

    if (!response.ok) {
      return NextResponse.json(
        { hasError: true, error: `Upstream error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    charactersCache.set(cacheKey, { data, expiresAt: now + CACHE_TTL_MS });
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { hasError: true, error: 'Error fetching character data.' },
      { status: 500 }
    );
  }
}
