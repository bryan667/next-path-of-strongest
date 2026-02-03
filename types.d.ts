interface CharacterDataWithItems {
  characterData: Record<string, any>;
  items: Array<Record<string, any>>;
  hasError?: boolean;
  [key: string]: any;
}

interface CharacterOptions {
  name: string;
  level: string;
  league: string;
  pinnable: boolean;
  realm: string;
}
