/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Star, Sparkles, Shapes, Palette, Cat, Puzzle, Brain } from 'lucide-react';
import { ModuleId, LanguageCode, PlayerSaveData } from '../game/types';
import { MODULES } from '../game/levelsData';
import { LOCALES } from '../game/localization';

interface ModuleSelectScreenProps {
  currentLang: LanguageCode;
  saveData: PlayerSaveData;
  onSelectModule: (moduleId: ModuleId) => void;
  onBack: () => void;
  highContrast: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <span className="text-3xl">🔢</span>,
  Shapes: <span className="text-3xl">🔺</span>,
  Palette: <span className="text-3xl">🎨</span>,
  Cat: <span className="text-3xl">🦁</span>,
  Puzzle: <span className="text-3xl">🧩</span>,
  Brain: <span className="text-3xl">🃏</span>,
};

export const ModuleSelectScreen: React.FC<ModuleSelectScreenProps> = ({
  currentLang,
  saveData,
  onSelectModule,
  onBack,
  highContrast,
}) => {
  const currentLocale = LOCALES[currentLang];

  const getModuleStars = (modId: ModuleId) => {
    const mod = saveData.modules[modId];
    if (!mod) return 0;
    return Object.values(mod.levels).reduce((sum, lvl) => sum + (lvl.completed ? lvl.stars : 0), 0);
  };

  return (
    <div
      className={`min-h-[540px] p-4 sm:p-6 flex flex-col ${
        highContrast ? 'bg-black text-yellow-300' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Header with Back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          aria-label={currentLocale.strings.back}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm shadow-xs border border-slate-200 cursor-pointer active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentLocale.strings.back}</span>
        </button>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-center">
          {currentLocale.strings.selectModule}
        </h2>

        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>{saveData.total_stars}</span>
        </div>
      </div>

      {/* Grid of 6 Learning Adventures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto w-full flex-1">
        {MODULES.map((mod) => {
          const starsEarned = getModuleStars(mod.id);
          const maxStars = mod.totalLevels * 3;
          const title = (currentLocale.strings as any)[mod.titleKey] || mod.id;
          const desc = (currentLocale.strings as any)[mod.descKey] || '';
          const unlockedCount = saveData.modules[mod.id]?.highest_unlocked_level || 1;

          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              aria-label={`Open ${title}`}
              className={`group text-left p-5 rounded-3xl transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between active:scale-[0.98] ${
                highContrast
                  ? 'bg-neutral-900 border-2 border-yellow-400 text-yellow-300'
                  : 'bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs bg-gradient-to-tr ${mod.bgGradient} text-white`}
                  >
                    {ICON_MAP[mod.iconName]}
                  </div>

                  {/* Stars counter pill */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{starsEarned}/{maxStars}</span>
                  </div>
                </div>

                <h3 className="text-lg font-black tracking-tight mb-1 group-hover:text-blue-600 transition-colors">
                  {title}
                </h3>
                <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">
                  {desc}
                </p>
              </div>

              {/* Progress Bar & Level Count */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                  <span>Level {unlockedCount} of 10</span>
                  <span>{Math.round((starsEarned / maxStars) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${Math.max(5, (starsEarned / maxStars) * 100)}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
