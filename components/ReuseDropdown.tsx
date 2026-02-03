import React, { FC } from 'react';

type TProps = {
  selectedOption: string;
  setSelectedOption: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: any[];
  label?: string;
  id: string;
};

const ReuseDropdown: FC<TProps> = ({
  selectedOption,
  setSelectedOption,
  options = [],
  label,
  id,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e);
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}

      <select
        id={id}
        value={selectedOption}
        onChange={handleChange}
        className="w-[100%] block px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((option: { name: string; value: string }) => {
          return (
            <option
              className="text-black"
              key={option.value}
              value={option.value}
            >
              {`${option.name}`}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default ReuseDropdown;
