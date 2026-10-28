/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Star, Lock, Play } from 'lucide-react';
import { ModuleId, LanguageCode, PlayerSaveData } from '../game/types';
import { MODULES, ALL_LEVELS } from '../game/levelsData';
import { LOCALES } from '../game/localization';

interface LevelSelectScreenProps {
  moduleId: ModuleId;
  currentLang: LanguageCode;
  saveData: PlayerSaveData;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
  highContrast: boolean;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  moduleId,
  currentLang,
  saveData,
  onSelectLevel,
  onBack,
  highContrast,
}) => {
  const currentLocale = LOCALES[currentLang];
  const moduleDef = MODULES.find((m) => m.id === moduleId) || MODULES[0];
  const levels = ALL_LEVELS[moduleId] || [];
  const modProgress = saveData.modules[moduleId];
  const highestUnlocked = modProgress?.highest_unlocked_level || 1;

  const title = (currentLocale.strings as any)[moduleDef.titleKey] || moduleDef.id;

  return (
    <div
      className={`min-h-[540px] p-4 sm:p-6 flex flex-col ${
        highContrast ? 'bg-black text-yellow-300' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          aria-label={currentLocale.strings.back}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm shadow-xs border border-slate-200 cursor-pointer active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentLocale.strings.back}</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">{title}</h2>
          <p className="text-xs text-slate-500 font-semibold">{currentLocale.strings.selectLevel}</p>
        </div>

        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* Level Grid (1 to 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 max-w-3xl mx-auto w-full flex-1 items-center">
        {levels.map((lvl) => {
          const isUnlocked = lvl.id <= highestUnlocked;
          const levelRecord = modProgress?.levels[lvl.id];
          const isCompleted = levelRecord?.completed;
          const starsCount = levelRecord?.stars || 0;

          return (
            <button
              key={lvl.id}
              disabled={!isUnlocked}
              onClick={() => onSelectLevel(lvl.id)}
              aria-label={`Level ${lvl.id}: ${lvl.titleKey}`}
              className={`relative flex flex-col items-center justify-center p-4 rounded-3xl transition-all aspect-square cursor-pointer active:scale-95 ${
                !isUnlocked
                  ? 'bg-slate-200/70 border-2 border-slate-300 opacity-60 cursor-not-allowed text-slate-400'
                  : isCompleted
                  ? 'bg-white hover:bg-emerald-50 border-2 border-emerald-400 shadow-sm text-slate-800'
                  : 'bg-white hover:bg-blue-50 border-2 border-blue-400 shadow-md ring-2 ring-blue-200 text-slate-800'
              } ${highContrast ? 'bg-neutral-900 border-yellow-400 text-yellow-300' : ''}`}
            >
              {/* Age Tier Tag */}
              <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {lvl.ageTier}y
              </span>

              {/* Status Icon / Level Number */}
              {!isUnlocked ? (
                <div className="w-10 h-10 rounded-full bg-slate-300/80 flex items-center justify-center my-1 text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
              ) : (
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center my-1 text-xl font-black shadow-xs ${
                    isCompleted
                      ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 text-white'
                      : 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-white animate-pulse'
                  }`}
                >
                  {lvl.id}
                </div>
              )}

              {/* Star Rating Underneath */}
              <div className="flex items-center gap-0.5 mt-1.5">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-3.5 h-3.5 ${
                      starIdx <= starsCount
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-300 fill-slate-100'
                    }`}
                  />
                ))}
              </div>

              {/* Current Play Indicator */}
              {isUnlocked && !isCompleted && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
