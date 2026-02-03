export type Rarity = 'normal' | 'magic' | 'rare' | 'unique';

export const RARITY_CLASSES: Record<Rarity, string> = {
  normal:
    'bg-[radial-gradient(circle,hsl(218,17%,28%),hsl(216,10%,20%))] border-2 border-[hsl(222,10%,20%)]',
  magic:
    'bg-[radial-gradient(circle,hsl(226,27%,21%),hsl(219,14%,20%))] border-2 border-[hsl(224,30%,15%)]',
  rare: 'bg-[radial-gradient(circle,hsl(90,9%,22%),hsl(87,19%,18%))] border-2 border-[hsl(77,30%,12%)]',
  unique:
    'bg-[radial-gradient(circle,hsl(0,6%,25%),hsl(0,5%,17%))] border-2 border-[hsl(0,19%,14%)]',
};
