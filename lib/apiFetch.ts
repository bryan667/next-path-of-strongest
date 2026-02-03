const DEFAULT_ACCOUNT_NAME = process.env.NEXT_PUBLIC_DEFAULT_ACCOUNT_NAME || '';

export const fetchCharacterData = async ({
  accountName,
  characterName,
}: {
  accountName?: string | null;
  characterName?: string;
}) => {
  const params = new URLSearchParams({
    accountName: accountName || DEFAULT_ACCOUNT_NAME,
  });

  if (characterName) {
    params.append('characterName', characterName);
  }

  try {
    const response = await fetch(`/api/character?${params}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching items data:', error);
    return { error, hasError: true };
  }
};

export const fetchCharactersByRealm = async ({
  accountName,
  realm,
}: {
  accountName?: string | null;
  realm?: string | null;
}) => {
  const params = new URLSearchParams({
    accountName: accountName || DEFAULT_ACCOUNT_NAME,
  });

  if (realm) {
    params.append('realm', realm);
  }

  try {
    const response = await fetch(`/api/characters?${params}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching character data:', error);
    return { error, hasError: true };
  }
};
