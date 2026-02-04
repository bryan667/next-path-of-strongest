'use client';

import { useEffect, useState } from 'react';
import { fetchCharacterData, fetchCharactersByRealm } from '../../lib/apiFetch';
import EquipmentGrid from '@/components/EquipmentGrid';
import CharacterDropdown from '@/components/CharacterDropdown';
import { isEmpty, sortBy, toLower } from 'lodash';
import { TEXT_CLASSES } from '@/styles/text';
import { useRouter } from 'next/navigation';

export default function CharacterViewerPage() {
  const [selectedCharacterName, setSelectedCharacterName] =
    useState<string>('');
  const [rawCharacterData, setRawCharacterData] =
    useState<CharacterDataWithItems>();
  const [characterOptions, setCharacterOptions] = useState<CharacterOptions[]>(
    []
  );
  const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(false);
  const [localStorageValues, setLocalStorageValues] = useState<
    Record<string, string>
  >({});

  const router = useRouter();

  useEffect(() => {
    setLocalStorageValues({
      accountName: localStorage.getItem('accountName') || '',
      realm: localStorage.getItem('realm') || '',
    });
  }, []);

  const accountName = localStorageValues.accountName;
  const realm = localStorageValues.realm;

  useEffect(() => {
    const getCharacterOptions = async () => {
      if (!accountName || !realm) return;

      setIsLoadingOptions(true);
      const rawData = await fetchCharactersByRealm({ accountName, realm });
      const data = rawData?.data || [];

      if (!rawData?.error && !isEmpty(data)) {
        const sortedData: CharacterOptions[] =
          sortBy(data, d => d.league) || [];
        setCharacterOptions(sortedData);
        const latestCharacter = sortedData.find((d: CharacterOptions) => {
          return toLower(d.league) === 'settlers';
        });
        setSelectedCharacterName(latestCharacter?.name || sortedData[0].name);
      } else {
        setCharacterOptions([]);
        setSelectedCharacterName('');
      }
      setIsLoadingOptions(false);
    };
    getCharacterOptions();
  }, [accountName, realm]);

  useEffect(() => {
    if (selectedCharacterName) {
      const getData = async () => {
        const data = await fetchCharacterData({
          accountName: accountName,
          characterName: selectedCharacterName,
        });
        setRawCharacterData(data);
      };
      getData();
    }
  }, [selectedCharacterName]);

  const characterData = rawCharacterData?.characterData;
  const character = characterData?.character;
  const items = characterData?.items;
  const charLevel = character?.level;

  return (
    <div className="min-h-screen h-auto bg-[#0b0a0aa7] max-md:bg-[#28242476]">
      {isLoadingOptions && (
        <div className="flex flex-col items-center bg-[#080808b9] max-md:bg-[#070707a0] py-50 px-5">
          Loading character data...
        </div>
      )}
      {!isLoadingOptions && characterOptions.length === 0 && (
        <div className="flex items-center bg-[#080808b9] max-md:bg-[#070707a0] py-50 px-5">
          <div className="m-auto">
            <button
              onClick={() => router.push('/')}
              className="mr-[8px] bg-black border hover:bg-gray-800  focus:outline-none rounded-lg text-sm px-[10px] py-[2px] mb-[8px]"
            >
              {'<'}
            </button>{' '}
            No characters found
          </div>
        </div>
      )}

      {rawCharacterData?.hasError && (
        <div className="flex flex-col items-center bg-[#080808b9] max-md:bg-[#070707a0] py-3 px-3">
          {rawCharacterData.error}
        </div>
      )}

      {characterOptions.length > 0 && (
        <div className="flex flex-col items-center bg-[#080808b9] max-md:bg-[#070707a0] py-3 px-3">
          <CharacterDropdown
            characterOptions={characterOptions}
            setSelectedCharacterName={setSelectedCharacterName}
            selectedCharacterName={selectedCharacterName}
          />
        </div>
      )}

      {characterData && (
        <div className="flex flex-col items-center bg-[#080808b9] max-md:bg-[#070707a0] py-3 px-3">
          <div>
            <h1
              data-component="char-name"
              className={`mt-4 mb-1 text-2xl md:text-4xl ${TEXT_CLASSES.titleFont} ${TEXT_CLASSES.gold1}`}
            >
              {character?.name}
            </h1>
            {charLevel && (
              <h2
                data-component="char-level"
                className={`${TEXT_CLASSES.gold2} mb-3`}
              >{`Level ${character.level} ${character.class}`}</h2>
            )}
          </div>
          {items && items.length > 0 ? (
            <div>
              <EquipmentGrid items={items} />
              {items.map((item: any, index: number) => (
                <div className="flex items-center mt-5" key={index}>
                  <img
                    src={item.icon}
                    alt="Profile"
                    className="rounded-full mr-4"
                  />
                  <div key={item.id}>
                    <div
                      className={`${TEXT_CLASSES.titleFont} ${TEXT_CLASSES.gold1}}`}
                    >
                      {`${item.name} ${item.typeLine}`}
                    </div>
                    <div className={`${TEXT_CLASSES.gold2}`}>
                      {item.baseType}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No items found.</p>
          )}
        </div>
      )}
    </div>
  );
}
