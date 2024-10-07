import React, { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
  haveSearch: boolean;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  buttons: ReactNode[];
};

const Options = ({
  haveSearch,
  buttons,
  searchValue,
  setSearchValue,
}: Props) => {
  return (
    <div
      className={`flex gap-x-2 ${
        haveSearch ? "justify-between" : "justify-end"
      }`}
    >
      {haveSearch && (
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="px-2 border focus:border-gray-500 transition ease-in-out border-gray-300 rounded-md outline-none"
          placeholder="search"
        />
      )}
      <div className="flex gap-x-4">{buttons}</div>
    </div>
  );
};

export default Options;
