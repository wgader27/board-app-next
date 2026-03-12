import { ComponentPropsWithoutRef } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label: string;
};

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={props.name || "default-input"}
        className="block mb-2 text-sm font-semibold text-slate-300"
      >
        {label}
      </label>
      <input
        type="text"
        id={props.name || "default-input"}
        className="border text-base rounded-xl block w-full p-4 bg-slate-900/50 border-slate-700/50 placeholder-slate-500 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner outline-none"
        {...props}
      />
    </div>
  );
};
