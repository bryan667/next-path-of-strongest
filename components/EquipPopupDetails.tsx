import { type CSSProperties, type FC, type RefCallback } from 'react';

type ApiRecord = Record<string, unknown>;

const asRecord = (value: unknown): ApiRecord | undefined =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as ApiRecord)
    : undefined;

const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

// Some item payloads wrap modifier text in a description object.
const asText = (value: unknown): string => {
  const text = asRecord(value)?.description ?? value;
  return typeof text === 'string' || typeof text === 'number'
    ? String(text)
    : '';
};

const firstValue = (values: unknown): string =>
  asText(asArray(asArray(values)[0])[0]);

type TProps = {
  isHovered?: boolean;
  backgroundColor?: string;
  equip: ApiRecord;
  refs: { setFloating: RefCallback<HTMLDivElement> };
  floatingStyles: CSSProperties;
};

const EquipPopupDetails: FC<TProps> = ({
  isHovered = false,
  backgroundColor = 'normal',
  equip,
  refs: { setFloating },
  floatingStyles,
}) => {
  const renderByDisplayMode = (value: unknown) => {
    const property = asRecord(value);
    if (property?.displayMode !== 0) return null;

    const name = asText(property.name);
    const mainValue = firstValue(property.values);

    return (
      <>
        {name !== '' && <span className="text-gray-400">{`${name}:`}</span>}
        {mainValue !== '' && (
          <span className="text-white">{` ${mainValue}`}</span>
        )}
      </>
    );
  };

  const renderModifiers = (value: unknown, className: string) => {
    const modifiers = asArray(value).map(asText).filter((text) => text !== '');
    if (modifiers.length === 0) return null;

    return (
      <>
        {modifiers.map((text, index) => (
          <div className={className} key={index}>
            {text}
          </div>
        ))}
        <div className="pb-[5px]" />
      </>
    );
  };

  const requirements = asArray(equip.requirements);

  return (
    <>
      {isHovered && (
        <div
          data-component="popup-details-tooltip"
          ref={setFloating}
          style={floatingStyles}
          className={`pointer-events-none relative w-fit min-h-[100%] max-w-[calc(100vw-16px)] max-h-[calc(100vh-16px)] overflow-auto z-100 px-[0px] py-[10px]`}
        >
          <div
            aria-hidden="true"
            className={`absolute inset-0 ${backgroundColor} opacity-90`}
          />
          <div className="relative z-6 text-center opacity-100">
            <div className="pb-3">
              <h3 className="font-bold text-shadow-lg/30">{asText(equip.name)}</h3>
              <h3 className="font-bold text-shadow-lg/30">{asText(equip.baseType)}</h3>
            </div>
            <div className="bg-black/60 min-h-[150px] p-[10px] text-sm/6">
              {asArray(equip.properties).map((property, index) => {
                return <div key={index}>{renderByDisplayMode(property)}</div>;
              })}

              {requirements.map((value, index) => {
                const requirement = asRecord(value);
                if (!requirement) return null;
                const name = asText(requirement.name);
                const reqVals = firstValue(requirement.values);

                return (
                  <span key={index}>
                    <span className="text-gray-400">{name}</span>
                    {reqVals !== '' && (
                      <span className="text-white">{` ${reqVals} `}</span>
                    )}
                  </span>
                );
              })}

              {requirements.length > 0 && <div className="pb-[5px]" />}

              {renderModifiers(equip.enchantMods, 'text-blue-200')}
              {renderModifiers(equip.implicitMods, 'text-blue-200')}
              {renderModifiers(equip.utilityMods, 'text-blue-200')}
              {renderModifiers(equip.explicitMods, 'text-blue-400')}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EquipPopupDetails;
