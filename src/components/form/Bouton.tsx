import { classed } from '@tw-classed/react';

export const Button = classed(
  'button',
  'inline-flex items-center justify-center font-bold rounded-xl text-base px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all focus:ring-4 focus:ring-blue-500/50 outline-none w-full sm:w-auto'
);
