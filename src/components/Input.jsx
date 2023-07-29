import React from "react";

export default function Input({ label, placeholder, type, value, setValue }) {
  return (
    <div className="flex flex-col">
      <label for={label} className="text-violet-800 font-semibold my-2">
        {label}
      </label>
      <input
        placeholder={placeholder}
        id={label}
        type={type}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className="w-[336px] py-[6px] px-2 outline-none border-solid border-[1px] rounded-sm focus:border-violet-400"
      ></input>
    </div>
  );
}
