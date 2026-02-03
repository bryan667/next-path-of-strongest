'use client';

import React, { FC } from 'react';
import { useRouter } from 'next/navigation';

type TProps = {
  characterOptions: any[];
  setSelectedCharacterName: React.Dispatch<React.SetStateAction<string>>;
  selectedCharacterName: string;
};

const CharacterDropdown: FC<TProps> = ({
  characterOptions,
  setSelectedCharacterName,
  selectedCharacterName,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCharacterName(e.target.value);
  };

  const router = useRouter();

  return (
    <div className="w-100%">
      <div className="flex">
        <button
          onClick={() => router.push('/')}
          className="mr-[8px] bg-black border hover:bg-gray-800  focus:outline-none rounded-lg text-sm px-[10px] py-[2px] mb-[8px]"
        >
          {'<'}
        </button>
        <label
          htmlFor="dropdown"
          className="content-center block text-sm font-medium mb-[7px]"
        >
          Strongest characters:
        </label>
      </div>

      <select
        id="dropdown"
        value={selectedCharacterName}
        onChange={handleChange}
        className="block w-[100%] px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {characterOptions.map(
          (char: { name: string; level: string; league: string }) => {
            return (
              <option className="text-black" key={char.name} value={char.name}>
                {`${char.name}  lvl ${char.level} - ${char.league}`}
              </option>
            );
          }
        )}
      </select>
    </div>
  );
};

export default CharacterDropdown;
