import { FC } from 'react';
import EquipIcon from './EquipIcon';
import {
  defaultGridStyle,
  equipmentFlaskStyles,
  equipmentSetStyles,
} from '@/styles/gridstyles';

type TProps = {
  items: Array<Record<string, any>>;
};

const EquipmentGrid: FC<TProps> = ({ items }) => {
  const equipmentSet: Record<string, any> = {};
  const equipmentFlasks: Record<string, any> = {};

  for (const item of items) {
    const inventoryId = item?.inventoryId.toLowerCase();
    equipmentSet[inventoryId] = { ...item };

    if (inventoryId === 'flask') {
      const flaskPosition = String(item.x);
      const flaskId = `flask${flaskPosition}`;
      equipmentFlasks[flaskId] = { ...item };
    }
  }

  const renderEquips = () => {
    const equips = [];
    for (const key in equipmentSetStyles) {
      equips.push(
        <div
          key={key}
          className={`${equipmentSetStyles[key]} ${defaultGridStyle}`}
        >
          <EquipIcon equip={equipmentSet[key]} />
        </div>
      );
    }
    return equips;
  };

  const renderFlasks = () => {
    const flasks = [];
    for (const key in equipmentFlaskStyles) {
      flasks.push(
        <div
          key={key}
          className={`${equipmentFlaskStyles[key]} ${defaultGridStyle}`}
        >
          <EquipIcon equip={equipmentFlasks[key]} />
        </div>
      );
    }
    return flasks;
  };

  return (
    <div className="border border-gray-400 p-4">
      {/* Equips here*/}
      <div
        data-equip-grid="equips"
        className="grid grid-cols-8 grid-rows-6 gap-1 min-w-[240px] min-h-[200px] sm:min-w-[484px] sm:min-h-[400px] p-0"
      >
        {renderEquips()}
      </div>

      {/* Flasks here*/}
      <div
        data-equip-grid="flasks"
        className="pt-1 grid grid-cols-9 grid-rows-2 gap-1 min-w-[240px] min-h-[50px] sm:min-w-[484px] sm:min-h-[102px]"
      >
        {renderFlasks()}
      </div>
    </div>
  );
};

export default EquipmentGrid;
