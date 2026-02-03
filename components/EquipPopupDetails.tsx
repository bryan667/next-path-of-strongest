import { isEmpty } from 'lodash';
import { FC } from 'react';

type TProps = {
  isHovered?: boolean;
  backgroundColor?: string;
  equip: { [key: string]: any };
  refs: any;
  floatingStyles: any;
};

const EquipPopupDetails: FC<TProps> = ({
  isHovered = false,
  backgroundColor = 'bg-normal-color',
  equip,
  refs,
  floatingStyles,
}) => {
  const renderByDisplayMode = (property: any) => {
    let renderComp = <div></div>;

    switch (property.displayMode) {
      case 0: {
        const mainValue = property?.values?.[0]?.[0] ?? null;

        renderComp = (
          <>
            <span className="text-gray-500">{`${property.name}:`}</span>
            {!isEmpty(mainValue) && (
              <span className="text-white">{` ${mainValue}`}</span>
            )}
          </>
        );
        break;
      }
    }

    return <>{renderComp}</>;
  };

  return (
    <>
      {isHovered && (
        <div
          data-component="popup-details-tooltip"
          ref={refs.setFloating}
          style={floatingStyles}
          className={`${backgroundColor} pointer-events-none w-fit opacity-95 min-h-[100%] max-w-[calc(100vw-16px)] max-h-[calc(100vh-16px)] overflow-auto z-100 px-[0px] py-[10px]`}
        >
          <div className="text-center">
            <div className="pb-3">
              <h3 className="font-bold">{equip.name}</h3>
              <h3 className="font-bold">{equip.baseType}</h3>
            </div>
            <div className="bg-black min-h-[150px] p-[10px] text-sm/6">
              {equip?.properties?.map((property: any, index: number) => {
                return <div key={index}>{renderByDisplayMode(property)}</div>;
              })}

              {equip?.requirements?.map((requirements: any, index: number) => {
                const reqVals = requirements?.values?.[0]?.[0];

                return (
                  <span key={index}>
                    <span className="text-gray-500">{`${requirements.name}`}</span>
                    {!isEmpty(reqVals) && (
                      <span className="text-white">{` ${reqVals} `}</span>
                    )}
                  </span>
                );
              })}

              {equip?.requirements && <div className="pb-[5px]" />}

              {equip?.enchantMods?.map((enMod: any, index: number) => {
                return (
                  <div className="text-blue-200" key={index}>
                    {enMod}
                  </div>
                );
              })}

              {equip?.enchantMods && <div className="pb-[5px]" />}

              {equip?.implicitMods?.map((iMod: any, index: number) => {
                return (
                  <div className="text-blue-200" key={index}>
                    {iMod}
                  </div>
                );
              })}

              {equip?.implicitMods && <div className="pb-[5px]" />}

              {equip?.utilityMods?.map((utMod: any, index: number) => {
                return (
                  <div className="text-blue-200" key={index}>
                    {utMod}
                  </div>
                );
              })}

              {equip?.utilityMods && <div className="pb-[5px]" />}

              {equip?.explicitMods?.map((exMod: any, index: number) => {
                return (
                  <div className="text-blue-400" key={index}>
                    {exMod}
                  </div>
                );
              })}

              {equip?.explicitMods && <div className="pb-[5px]" />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EquipPopupDetails;
