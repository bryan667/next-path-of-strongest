'use client';

import { useRef, useState } from 'react';
import ReuseDropdown from '@/components/ReuseDropdown';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const DEFAULT_ACCOUNT_NAME = process.env.NEXT_PUBLIC_DEFAULT_ACCOUNT_NAME || '';
export default function MainAccountPage() {
  const searchParams = useSearchParams();
  const initialAccountName = searchParams.get('account-name');
  const debounceRef = useRef<number | null>(null);

  const [formState, setFormState] = useState({
    realm: 'pc',
    accountName: initialAccountName || DEFAULT_ACCOUNT_NAME,
  });

  const router = useRouter();
  const onSubmit = () => {
    localStorage.setItem('accountName', formState.accountName);
    localStorage.setItem('realm', formState.realm);
    router.push('/character-view');
  };

  const setSelectedOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const optionName = e?.target?.id;
    const optionValue = e?.target?.value;

    setFormState({
      ...formState,
      [optionName]: optionValue,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = e?.target?.id;
    const inputValue = e?.target?.value;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      const encodedInput = encodeURIComponent(inputValue);
      router.replace(`/?account-name=${encodedInput}`);
    }, 400);

    setFormState({
      ...formState,
      [inputName]: inputValue,
    });
  };

  return (
    <div className="block sm:flex items-center">
      <div className="w-[100%] mr-[5px] pb-[6px]">
        <ReuseDropdown
          id="realm"
          selectedOption={formState.realm}
          setSelectedOption={setSelectedOption}
          options={[
            { name: 'PC', value: 'pc' },
            { name: 'Xbox', value: 'xbox' },
            { name: 'PS4', value: 'ps4' },
          ]}
        />
      </div>
      <div className="pb-[6px]">
        <input
          type="text"
          id="accountName"
          onChange={handleInputChange}
          className="mr-[5px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="accountName#1234"
          defaultValue={initialAccountName || DEFAULT_ACCOUNT_NAME}
          required
        />
      </div>
      <div className="pb-[6px]">
        <button
          type="button"
          onClick={onSubmit}
          className="border w-[100%] focus:outline-none hover:bg-gray-800 font-medium rounded-lg text-sm px-3 py-2.5"
        >
          Import
        </button>
      </div>
    </div>
  );
}
