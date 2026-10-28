/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Star, Lock, Sparkles } from 'lucide-react';
import { LanguageCode } from '../game/types';
import { LOCALES } from '../game/localization';
import { STICKERS } from '../game/levelsData';

interface StickerAlbumProps {
  currentLang: LanguageCode;
  totalStars: number;
  unlockedStickers: string[];
  onClose: () => void;
  highContrast: boolean;
}

export const StickerAlbum: React.FC<StickerAlbumProps> = ({
  currentLang,
  totalStars,
  unlockedStickers,
  onClose,
  highContrast,
}) => {
  const currentLocale = LOCALES[currentLang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full max-w-lg max-h-[85vh] rounded-3xl p-5 sm:p-6 shadow-2xl border-2 flex flex-col overflow-hidden ${
          highContrast
            ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
            : 'bg-white border-amber-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <div>
              <h3 className="text-lg font-black">{currentLocale.strings.stickers}</h3>
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{totalStars} {currentLocale.strings.totalStars}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sticker Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 overflow-y-auto flex-1 pr-1">
          {STICKERS.map((sticker) => {
            const isUnlocked = unlockedStickers.includes(sticker.id) || totalStars >= sticker.unlockedAtStars;
            const starsNeeded = Math.max(0, sticker.unlockedAtStars - totalStars);

            return (
              <div
                key={sticker.id}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all border-2 ${
                  isUnlocked
                    ? 'bg-amber-50 border-amber-300 shadow-sm'
                    : 'bg-slate-100 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-2 ${
                    isUnlocked ? 'bg-white shadow-xs' : 'bg-slate-200'
                  }`}
                >
                  {isUnlocked ? sticker.emoji : <Lock className="w-5 h-5 text-slate-400" />}
                </div>

                <span className="text-xs font-black leading-tight mb-1 text-slate-800">
                  {sticker.nameKey}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isUnlocked
                      ? 'bg-emerald-100 text-emerald-800 flex items-center gap-0.5'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Unlocked</span>
                    </>
                  ) : (
                    <span>{starsNeeded} ⭐ more</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
