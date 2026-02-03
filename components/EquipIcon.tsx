'use client';

import { FC, useState } from 'react';
import { toLower } from 'lodash';
import EquipPopupDetails from './EquipPopupDetails';
import { useFloating, autoPlacement, shift } from '@floating-ui/react';
import { Rarity, RARITY_CLASSES } from '@/styles/rarity';

type TProps = {
  equip: { [key: string]: any } | undefined;
};

const EquipIcon: FC<TProps> = ({ equip }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const inventoryId = equip?.inventoryId;
  const rarity: Rarity = equip?.rarity || 'normal';

  const { refs, floatingStyles } = useFloating({
    placement: 'right',
    middleware: [autoPlacement(), shift()],
  });

  let backgroundColor = RARITY_CLASSES[toLower(rarity)];

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleOnClick = () => {
    setIsHovered(!isHovered);
  };

  return (
    <div
      ref={refs.setReference}
      className={`${backgroundColor} flex items-center place-content-center w-full h-full relative`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleOnClick}
    >
      {inventoryId && (
        <>
          {equip?.icon && (
            <img src={equip.icon} alt={inventoryId} className="rounded-md" />
          )}

          <EquipPopupDetails
            isHovered={isHovered}
            backgroundColor={backgroundColor}
            equip={equip}
            floatingStyles={floatingStyles}
            refs={refs}
          />
        </>
      )}
    </div>
  );
};

export default EquipIcon;
