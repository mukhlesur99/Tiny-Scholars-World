/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Star, Play, RotateCcw, Sparkles, Award } from 'lucide-react';
import { LanguageCode } from '../game/types';
import { LOCALES } from '../game/localization';
import { audioEngine } from '../game/audioEngine';

interface VictoryModalProps {
  stars: number;
  levelId: number;
  moduleId: string;
  currentLang: LanguageCode;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
  highContrast: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stars,
  levelId,
  currentLang,
  onNextLevel,
  onReplay,
  onHome,
  highContrast,
}) => {
  const currentLocale = LOCALES[currentLang];

  useEffect(() => {
    audioEngine.playFanfare();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl border-4 relative overflow-hidden transform animate-scaleUp ${
          highContrast
            ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
            : 'bg-white border-amber-300 text-slate-800'
        }`}
      >
        {/* Floating Confetti Badges */}
        <div className="absolute top-2 left-3 text-2xl animate-bounce">🎉</div>
        <div className="absolute top-2 right-3 text-2xl animate-bounce">✨</div>

        {/* Mascot / Trophy */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-4xl shadow-md mb-3">
          🏆
        </div>

        <h3 className="text-2xl font-black tracking-tight mb-1">
          {currentLocale.strings.greatJob}
        </h3>
        <p className="text-xs font-semibold text-slate-500 mb-4">
          {currentLocale.strings.level} {levelId} Complete!
        </p>

        {/* 3 Golden Stars */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`transform transition-all duration-500 ${
                starIdx <= stars ? 'scale-110' : 'scale-90 opacity-40'
              }`}
            >
              <Star
                className={`w-10 h-10 ${
                  starIdx <= stars
                    ? 'fill-amber-400 text-amber-500 filter drop-shadow-md animate-pulse'
                    : 'fill-slate-200 text-slate-300'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            data-start="true"
            onClick={onNextLevel}
            aria-label={currentLocale.strings.nextLevel}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-extrabold text-base shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{currentLocale.strings.nextLevel}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReplay}
              aria-label={currentLocale.strings.playAgain}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{currentLocale.strings.playAgain}</span>
            </button>
            <button
              onClick={onHome}
              aria-label={currentLocale.strings.home}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <span>{currentLocale.strings.home}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
