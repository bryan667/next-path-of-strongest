'use client';

import { useEffect, useState } from 'react';
import { fetchCharacterData, fetchCharactersByRealm } from '../../lib/apiFetch';
import EquipmentGrid from '../../components/EquipmentGrid';
import CharacterDropdown from '../../components/CharacterDropdown';
import { isEmpty, sortBy, toLower } from 'lodash';

const CharacterViewer = () => {
  const [rawCharacterData, setRawCharacterData] = useState<CharacterData>();
  const [selectedCharacterName, setSelectedCharacterName] =
    useState<string>('');
  const [characterOptions, setCharacterOptions] = useState<any[]>([]);

  useEffect(() => {
    const getCharacterOptions = async () => {
      const accountName = localStorage.getItem('accountName');
      const realm = localStorage.getItem('realm');
      const data = await fetchCharactersByRealm({ accountName, realm });

      if (!data?.error && !isEmpty(data)) {
        const sortedData = sortBy(data, d => d.league) || [];
        setCharacterOptions(sortedData);
        const latestCharacter = data.find((d: any) => {
          return toLower(d.league) === 'settlers';
        });
        setSelectedCharacterName(latestCharacter?.name || sortedData[0].name);
      }
    };
    getCharacterOptions();
  }, []);

  useEffect(() => {
    const accountName = localStorage.getItem('accountName');
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

  console.log('characterData', rawCharacterData);

  return (
    <div className="app-main">
      <div className="bg-main-opaque">
        {!selectedCharacterName && (
          <div className="flex flex-col items-center bg-main-vertical py-5 px-5">
            Loading character data...
          </div>
        )}
        {rawCharacterData?.hasError && (
          <div className="flex flex-col items-center bg-main-vertical py-5 px-5">
            {rawCharacterData.error}
          </div>
        )}

        {selectedCharacterName && (
          <div className="flex flex-col items-center bg-main-vertical py-5 px-5">
            <CharacterDropdown
              characterOptions={characterOptions}
              setSelectedCharacterName={setSelectedCharacterName}
              selectedCharacterName={selectedCharacterName}
            />
          </div>
        )}

        {characterData && (
          <div className="flex flex-col items-center bg-main-vertical py-5 px-5">
            <div>
              <h1
                data-component="char-name"
                className="mt-4 mb-1 text-2xl md:text-4xl title-item gold-text1"
              >
                {character?.name}
              </h1>
              {charLevel && (
                <h2
                  data-component="char-level"
                  className="gold-text2 mb-3"
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
                      <div className="title-item gold-text1">
                        {`${item.name} ${item.typeLine}`}
                      </div>
                      <div className="gold-text2">{item.baseType}</div>
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
    </div>
  );
};

export default CharacterViewer;
