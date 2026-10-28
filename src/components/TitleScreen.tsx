/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Play, Sparkles, ShieldCheck, WifiOff, Star, BookOpen } from 'lucide-react';
import { LanguageCode } from '../game/types';
import { LOCALES } from '../game/localization';

interface TitleScreenProps {
  currentLang: LanguageCode;
  onStart: () => void;
  onOpenStickerAlbum: () => void;
  totalStars: number;
  hasProgress: boolean;
  highContrast: boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  currentLang,
  onStart,
  onOpenStickerAlbum,
  totalStars,
  hasProgress,
  highContrast,
}) => {
  const currentLocale = LOCALES[currentLang];

  // Ultra-mode Title-to-Start handshake: Enter or Space triggers Start
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div
      className={`relative min-h-[540px] flex flex-col items-center justify-center p-4 sm:p-8 text-center select-none overflow-hidden ${
        highContrast ? 'bg-black text-yellow-300' : 'bg-gradient-to-b from-sky-100 via-blue-50 to-amber-50 text-slate-800'
      }`}
    >
      {/* Playful Floating Background Motifs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <span className="absolute top-8 left-10 text-5xl animate-bounce">🎈</span>
        <span className="absolute top-16 right-12 text-5xl animate-pulse">🌟</span>
        <span className="absolute bottom-16 left-16 text-5xl">🎨</span>
        <span className="absolute bottom-20 right-20 text-5xl animate-bounce">🚀</span>
        <span className="absolute top-1/2 left-4 text-4xl">🍎</span>
        <span className="absolute top-1/3 right-8 text-4xl">🦁</span>
      </div>

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
        {/* Animated Friendly Mascot Emblem */}
        <div className="relative mb-3">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 p-1.5 shadow-xl rotate-3 hover:rotate-0 transition-transform">
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-6xl shadow-inner">
              🦁
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-amber-400 text-amber-950 font-black text-xs rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 100% Fun
          </span>
        </div>

        {/* Title Lockup */}
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-2 drop-shadow-xs">
          {currentLocale.strings.appName}
        </h2>
        <p className="text-base sm:text-lg font-medium text-slate-600 max-w-md mx-auto mb-6">
          {currentLocale.strings.tagline}
        </p>

        {/* Primary Start Action (with required data-start="true" attribute) */}
        <div className="w-full max-w-xs flex flex-col gap-3">
          <button
            data-start="true"
            onClick={onStart}
            aria-label={currentLocale.strings.playNow}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-extrabold text-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 border-b-4 border-emerald-700"
          >
            <Play className="w-7 h-7 fill-white" />
            <span>{hasProgress ? currentLocale.strings.continueGame : currentLocale.strings.playNow}</span>
          </button>

          {/* Sticker Album shortcut */}
          <button
            onClick={onOpenStickerAlbum}
            aria-label="View Sticker Album"
            className="w-full py-2.5 px-4 rounded-xl bg-white/90 hover:bg-white active:scale-95 text-slate-700 font-bold text-sm shadow-xs border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>{currentLocale.strings.stickers} ({totalStars} {currentLocale.strings.stars})</span>
          </button>
        </div>

        {/* Child Safety and Offline Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-xs">
            <WifiOff className="w-3.5 h-3.5 text-blue-500" />
            100% Offline
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            No Ads • No Accounts • Child Safe
          </span>
        </div>

        {/* Flat control hint */}
        <p className="mt-4 text-[11px] text-slate-400 font-medium">
          Press Space or Enter to Start · Touch friendly
        </p>
      </div>
    </div>
  );
};
