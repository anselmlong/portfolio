"use client";
import React from "react";

export type SelectionItem = {
  key: string;
  title: string;
  subtitle?: string;
  imgSrc: string;
  alt?: string;
};

type Props = {
  items: SelectionItem[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  columnsMd?: number; // defaults to 3
  imageWidth?: number; // defaults to 240
  imageHeight?: number; // defaults to 240
  centerSingle?: boolean; // center a single item
};

export const SelectionGrid: React.FC<Props> = ({
  items,
  selectedKey,
  onSelect,
  columnsMd = 3,
  imageWidth = 240,
  imageHeight = 240,
  centerSingle = false,
}) => {
  const mdColsClass = `md:grid-cols-${columnsMd}` as const;
  const gridBase = `grid grid-cols-3 ${mdColsClass} gap-4`;
  const gridClass = centerSingle && items.length === 1 ? `${gridBase} place-items-center` : gridBase;

  return (
    <div className={gridClass}>
      {items.map((it) => {
        const isSelected = selectedKey === it.key;
        return (
          <button
            key={it.key}
            onClick={() => onSelect(it.key)}
            aria-pressed={isSelected}
            className="group relative rounded-lg p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col h-full bg-white shadow-md text-left"
          >
            <div className="w-full aspect-square grid place-items-center mb-3">
              <img
                src={it.imgSrc}
                alt={it.alt ?? it.title}
                width={imageWidth}
                height={imageHeight}
                className="max-w-[85%] max-h-[85%] object-contain group-hover:opacity-90 transition-opacity"
              />
            </div>
            <div className="mt-auto font-medium text-center text-slate-800">
              <div className="font-bold text-center">{it.title}</div>
              {it.subtitle && <div className="text-sm font-medium text-center">{it.subtitle}</div>}
            </div>
            {isSelected && (
              <div className="absolute top-2 right-2 bg-white text-stone-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                ✓
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
