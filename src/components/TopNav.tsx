/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Eye, Lock, Code2, Smartphone, Monitor, Star } from 'lucide-react';
import { LanguageCode } from '../game/types';
import { LOCALES } from '../game/localization';

interface TopNavProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  totalStars: number;
  onOpenParentGate: () => void;
  onOpenStickerBook: () => void;
  studioMode: boolean;
  onToggleStudioMode: () => void;
  viewportMode: 'responsive' | 'mobile_360' | 'tablet_720';
  onViewportChange: (mode: 'responsive' | 'mobile_360' | 'tablet_720') => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentLang,
  onLanguageChange,
  soundEnabled,
  onToggleSound,
  highContrast,
  onToggleHighContrast,
  totalStars,
  onOpenParentGate,
  onOpenStickerBook,
  studioMode,
  onToggleStudioMode,
  viewportMode,
  onViewportChange,
}) => {
  const currentLocale = LOCALES[currentLang];

  return (
    <header
      className={`w-full px-3 py-2.5 transition-colors border-b ${
        highContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : 'bg-white/95 backdrop-blur-md text-slate-800 border-slate-200 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-sm text-white font-black text-lg">
            ⭐
          </div>
          <div>
            <h1 className="font-extrabold tracking-tight text-base sm:text-lg leading-tight">
              {currentLocale.strings.appName}
            </h1>
            <span className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {currentLocale.strings.offlineModeNotice.split(':')[0]}
            </span>
          </div>
        </div>

        {/* Center Utilities: Stars & Stickers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenStickerBook}
            aria-label="Open Sticker Album"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{totalStars} {currentLocale.strings.stars}</span>
            <span className="text-base">📚</span>
          </button>

          {/* Viewport Simulator Toggle (For Testing Low-End Android vs Tablet) */}
          <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => onViewportChange('responsive')}
              title="Responsive Viewport"
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                viewportMode === 'responsive' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full</span>
            </button>
            <button
              onClick={() => onViewportChange('mobile_360')}
              title="Low-End Android Screen (360x640 dp)"
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                viewportMode === 'mobile_360' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android 360p</span>
            </button>
            <button
              onClick={() => onViewportChange('tablet_720')}
              title="Android Tablet / 720p HD"
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                viewportMode === 'tablet_720' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 rotate-90" />
              <span>Tablet 720p</span>
            </button>
          </div>
        </div>

        {/* Right Controls: Sound, Contrast, Language, Parent Area, Studio Toggle */}
        <div className="flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                : 'bg-rose-50 text-rose-500 hover:bg-rose-100'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={onToggleHighContrast}
            aria-label="Toggle High Contrast Mode"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              highContrast
                ? 'bg-yellow-400 text-black font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Language Selector */}
          <select
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
            aria-label="Select Game Language"
            className="px-2 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <option value="en">English (EN)</option>
            <option value="es">Español (ES)</option>
            <option value="fr">Français (FR)</option>
            <option value="bn">বাংলা (BN)</option>
          </select>

          {/* Parent Zone (Locked by arithmetic challenge) */}
          <button
            onClick={onOpenParentGate}
            aria-label={currentLocale.strings.parentZone}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs cursor-pointer active:scale-95 transition-transform"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentLocale.strings.parentZone}</span>
          </button>

          {/* Godot 4 & Android Export Studio Toggle */}
          <button
            onClick={onToggleStudioMode}
            aria-label="Godot 4 & Android Export Studio"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
              studioMode
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Godot & AAB Hub</span>
          </button>
        </div>
      </div>
    </header>
  );
};
