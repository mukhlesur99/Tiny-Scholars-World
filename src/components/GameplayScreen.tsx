/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Volume2, Star, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { ModuleId, LevelData, LanguageCode } from '../game/types';
import { LOCALES } from '../game/localization';
import { audioEngine } from '../game/audioEngine';
import { calculateStars } from '../game/saveManager';

interface GameplayScreenProps {
  levelData: LevelData;
  currentLang: LanguageCode;
  onComplete: (stars: number, attempts: number) => void;
  onExit: () => void;
  highContrast: boolean;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  levelData,
  currentLang,
  onComplete,
  onExit,
  highContrast,
}) => {
  const currentLocale = LOCALES[currentLang];
  const { config, type } = levelData;

  // Local interaction states
  const [countedIndices, setCountedIndices] = useState<Set<number>>(new Set());
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'retry'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Memory card game state
  const memoryCards = useMemo(() => {
    if (type !== 'card_match') return [];
    const items = config.cardItems || ['🐱', '🐶'];
    const doubled = [...items, ...items].map((emoji, idx) => ({
      uniqueId: `${emoji}_${idx}`,
      pairKey: emoji,
      emoji,
      flipped: false,
      matched: false,
    }));
    // Fisher-Yates deterministic shuffle
    for (let i = doubled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
    }
    return doubled;
  }, [levelData.id, type, config.cardItems]);

  const [cardsState, setCardsState] = useState(memoryCards);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // Speak prompt on initial load or language switch
  useEffect(() => {
    setCountedIndices(new Set());
    setSelectedAnswer(null);
    setAttempts(0);
    setErrorCount(0);
    setFeedback('idle');
    setCardsState(memoryCards);
    setFlippedCards([]);

    // Narrate prompt text gently
    const timer = setTimeout(() => {
      audioEngine.speak(levelData.promptKey, currentLang);
    }, 300);
    return () => clearTimeout(timer);
  }, [levelData.id, currentLang, memoryCards]);

  const handleSpeakPrompt = () => {
    audioEngine.speak(levelData.promptKey, currentLang);
  };

  const handleItemTap = (idx: number) => {
    audioEngine.playPop();
    setCountedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleAnswerSubmit = (chosen: any) => {
    setSelectedAnswer(chosen);
    setAttempts((prev) => prev + 1);

    const isCorrect = chosen === config.correctAnswer;
    if (isCorrect) {
      audioEngine.playCorrect();
      setFeedback('correct');
      setFeedbackMessage(currentLocale.strings.greatJob);

      setTimeout(() => {
        const stars = calculateStars(attempts + 1, errorCount);
        onComplete(stars, attempts + 1);
      }, 1100);
    } else {
      audioEngine.playGentleRetry();
      setErrorCount((prev) => prev + 1);
      setFeedback('retry');
      setFeedbackMessage(currentLocale.strings.tryAgain);

      setTimeout(() => {
        setFeedback('idle');
        setSelectedAnswer(null);
      }, 1200);
    }
  };

  // Card Match Handler
  const handleCardClick = (index: number) => {
    if (flippedCards.length >= 2 || cardsState[index].flipped || cardsState[index].matched) {
      return;
    }

    audioEngine.playPop();
    const updated = [...cardsState];
    updated[index].flipped = true;
    setCardsState(updated);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = updated[firstIdx];
      const secondCard = updated[secondIdx];

      if (firstCard.pairKey === secondCard.pairKey) {
        audioEngine.playPop();
        firstCard.matched = true;
        secondCard.matched = true;
        setCardsState([...updated]);
        setFlippedCards([]);

        // Check if all cards are matched
        const allMatched = updated.every((c) => c.matched);
        if (allMatched) {
          audioEngine.playCorrect();
          setFeedback('correct');
          setFeedbackMessage(currentLocale.strings.greatJob);
          setTimeout(() => {
            const stars = calculateStars(attempts + 1, errorCount);
            onComplete(stars, attempts + 1);
          }, 1100);
        }
      } else {
        audioEngine.playGentleRetry();
        setErrorCount((prev) => prev + 1);
        setTimeout(() => {
          firstCard.flipped = false;
          secondCard.flipped = false;
          setCardsState([...updated]);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  // Render SVG Shape Icons
  const renderShapeIcon = (shapeName: string, isTargetSilhouette: boolean = false) => {
    const fillClass = isTargetSilhouette
      ? 'fill-slate-300 stroke-slate-500 stroke-2'
      : 'fill-emerald-500 stroke-emerald-600 stroke-2';

    switch (shapeName) {
      case 'circle':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xs">
            <circle cx="50" cy="50" r="42" className={fillClass} />
          </svg>
        );
      case 'square':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xs">
            <rect x="15" y="15" width="70" height="70" rx="8" className={fillClass} />
          </svg>
        );
      case 'triangle':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xs">
            <polygon points="50,12 88,85 12,85" className={fillClass} />
          </svg>
        );
      case 'star':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xs">
            <polygon
              points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36"
              className={fillClass}
            />
          </svg>
        );
      case 'rectangle':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xs">
            <rect x="8" y="24" width="84" height="52" rx="6" className={fillClass} />
          </svg>
        );
      case 'diamond':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xs">
            <polygon points="50,10 90,50 50,90 10,50" className={fillClass} />
          </svg>
        );
      case 'oval':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xs">
            <ellipse cx="50" cy="50" rx="42" ry="28" className={fillClass} />
          </svg>
        );
      case 'pentagon':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xs">
            <polygon points="50,10 90,40 75,88 25,88 10,40" className={fillClass} />
          </svg>
        );
      default:
        return <span className="text-4xl">🔺</span>;
    }
  };

  return (
    <div
      className={`min-h-[540px] p-4 sm:p-6 flex flex-col justify-between select-none ${
        highContrast ? 'bg-black text-yellow-300' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Top Bar: Back, Level Title, Audio Speak Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onExit}
          aria-label={currentLocale.strings.back}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm shadow-xs border border-slate-200 cursor-pointer active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentLocale.strings.back}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800">
            {currentLocale.strings.level} {levelData.id}
          </span>
          <span className="text-xs font-bold text-slate-500">Tier {levelData.ageTier}y</span>
        </div>

        <button
          onClick={handleSpeakPrompt}
          aria-label="Listen to Prompt Narration"
          className="p-2.5 rounded-full bg-amber-400 hover:bg-amber-500 active:scale-90 text-amber-950 font-bold shadow-md cursor-pointer transition-transform"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Educational Question Prompt Card */}
      <div className="max-w-2xl mx-auto w-full mb-4 text-center">
        <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-blue-200 shadow-sm">
          <p className="text-lg sm:text-2xl font-black text-slate-800 leading-snug">
            {levelData.promptKey}
          </p>
          {type === 'count_items' && (
            <p className="text-xs text-blue-600 font-semibold mt-1">
              {currentLocale.strings.touchToCount}
            </p>
          )}
        </div>
      </div>

      {/* Interactive Gameplay Arena Based on Level Type */}
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col items-center justify-center my-2">
        {/* Type 1: Counting Items */}
        {type === 'count_items' && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-white/80 rounded-3xl border border-slate-200 min-h-[140px] w-full">
              {Array.from({ length: config.count }).map((_, idx) => {
                const isTapped = countedIndices.has(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleItemTap(idx)}
                    aria-label={`Count item ${idx + 1}`}
                    className={`relative p-3 rounded-2xl transition-all transform active:scale-90 cursor-pointer ${
                      isTapped
                        ? 'bg-amber-100 ring-4 ring-amber-400 scale-105'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl">{config.itemEmoji}</span>
                    {isTapped && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-md animate-bounce">
                        {idx + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Number Buttons */}
            <div className="grid grid-cols-3 gap-3 w-full">
              {config.options.map((optVal: number) => (
                <button
                  key={optVal}
                  onClick={() => handleAnswerSubmit(optVal)}
                  aria-label={`Select number ${optVal}`}
                  className="py-4 px-6 rounded-2xl bg-white hover:bg-blue-50 border-3 border-blue-400 text-blue-800 font-black text-3xl shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {optVal}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type 2: Dot Match */}
        {type === 'dot_match' && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-32 h-32 bg-white rounded-3xl border-3 border-slate-300 shadow-md flex items-center justify-center p-4">
              <div className="flex gap-3">
                {Array.from({ length: config.dots }).map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-slate-800 shadow-xs" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
              {config.options.map((optVal: number) => (
                <button
                  key={optVal}
                  onClick={() => handleAnswerSubmit(optVal)}
                  aria-label={`Number ${optVal}`}
                  className="py-4 px-6 rounded-2xl bg-white hover:bg-blue-50 border-3 border-blue-400 text-blue-800 font-black text-3xl shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {optVal}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type 3: Visual Addition */}
        {type === 'visual_addition' && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-3xl border border-slate-200 shadow-sm w-full">
              {/* Group A */}
              <div className="flex gap-1.5 p-2 bg-blue-50 rounded-2xl border border-blue-200">
                {Array.from({ length: config.groupA }).map((_, i) => (
                  <span key={i} className="text-3xl sm:text-4xl">{config.itemEmoji}</span>
                ))}
              </div>

              <span className="text-3xl font-black text-slate-400">+</span>

              {/* Group B */}
              <div className="flex gap-1.5 p-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                {Array.from({ length: config.groupB }).map((_, i) => (
                  <span key={i} className="text-3xl sm:text-4xl">{config.itemEmoji}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
              {config.options.map((optVal: number) => (
                <button
                  key={optVal}
                  onClick={() => handleAnswerSubmit(optVal)}
                  aria-label={`Answer ${optVal}`}
                  className="py-4 px-6 rounded-2xl bg-white hover:bg-emerald-50 border-3 border-emerald-400 text-emerald-800 font-black text-3xl shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {optVal}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type 4: Missing Number in Train */}
        {type === 'missing_number' && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex items-center justify-center gap-2 p-4 bg-white rounded-3xl border border-slate-200 shadow-sm w-full">
              {config.sequence.map((num: number | null, i: number) => (
                <div
                  key={i}
                  className={`w-14 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xs ${
                    num === null
                      ? 'bg-amber-100 border-2 border-dashed border-amber-400 text-amber-700 animate-pulse'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {num === null ? '?' : num}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
              {config.options.map((optVal: number) => (
                <button
                  key={optVal}
                  onClick={() => handleAnswerSubmit(optVal)}
                  aria-label={`Choose ${optVal}`}
                  className="py-4 px-6 rounded-2xl bg-white hover:bg-amber-50 border-3 border-amber-400 text-amber-800 font-black text-3xl shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {optVal}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type 5: Match Shape */}
        {type === 'match_shape' && (
          <div className="flex flex-col items-center gap-6 w-full">
            {/* Target Silhouette */}
            <div className="p-4 bg-white rounded-3xl border-2 border-slate-200 shadow-inner flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                Target Silhouette
              </span>
              {renderShapeIcon(config.targetShape, true)}
            </div>

            {/* Shape Options */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full">
              {config.options.map((shapeKey: string) => (
                <button
                  key={shapeKey}
                  onClick={() => handleAnswerSubmit(shapeKey)}
                  aria-label={`Shape option ${shapeKey}`}
                  className="p-4 rounded-2xl bg-white hover:bg-emerald-50 border-3 border-emerald-400 shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                >
                  {renderShapeIcon(shapeKey, false)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type 6: Real World Shape */}
        {type === 'real_world_shape' && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="p-6 bg-white rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <span className="text-6xl mb-2">{config.objectEmoji}</span>
              <span className="text-sm font-bold text-slate-600">{config.objectName}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
              {config.options.map((shapeKey: string) => (
                <button
                  key={shapeKey}
                  onClick={() => handleAnswerSubmit(shapeKey)}
                  aria-label={`Shape ${shapeKey}`}
                  className="p-4 rounded-2xl bg-white hover:bg-emerald-50 border-3 border-emerald-400 shadow-md active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  {renderShapeIcon(shapeKey, false)}
                  <span className="text-xs font-bold capitalize text-slate-700">{shapeKey}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type 7: Pick Color */}
        {type === 'pick_color' && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="grid grid-cols-3 gap-4 w-full">
              {config.options.map((colOpt: any) => (
                <button
                  key={colOpt.hex}
                  onClick={() => handleAnswerSubmit(colOpt.hex)}
                  aria-label={`Color ${colOpt.name}`}
                  className="aspect-square rounded-3xl border-4 border-white shadow-lg active:scale-95 transition-transform cursor-pointer relative overflow-hidden"
                  style={{ backgroundColor: colOpt.hex }}
                >
                  <span className="absolute bottom-2 inset-x-0 text-center font-black text-sm text-white drop-shadow-md">
                    {colOpt.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type 8: Color Association / Mixing */}
        {(type === 'color_association' || type === 'color_mixing') && (
          <div className="flex flex-col items-center gap-6 w-full">
            {type === 'color_mixing' && (
              <div className="flex items-center gap-3 p-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: config.colorA.hex }}
                />
                <span className="text-2xl font-black text-slate-400">+</span>
                <div
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: config.colorB.hex }}
                />
                <span className="text-2xl font-black text-slate-400">= ?</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 w-full">
              {config.options.map((opt: any) => {
                const isObj = typeof opt === 'object';
                const answerVal = isObj ? (opt.emoji || opt.hex) : opt;
                return (
                  <button
                    key={answerVal}
                    onClick={() => handleAnswerSubmit(answerVal)}
                    aria-label={`Option ${isObj ? (opt.label || opt.name) : opt}`}
                    className="p-4 rounded-2xl bg-white hover:bg-amber-50 border-3 border-amber-400 shadow-md active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
                  >
                    {isObj && opt.emoji && <span className="text-4xl">{opt.emoji}</span>}
                    {isObj && opt.hex && (
                      <div
                        className="w-10 h-10 rounded-full border-2 border-white shadow-xs"
                        style={{ backgroundColor: opt.hex }}
                      />
                    )}
                    <span className="text-xs font-bold text-slate-700">
                      {isObj ? (opt.label || opt.name) : opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Type 9: Animal Matching (Sound, Habitat, Clue, Family) */}
        {(type === 'match_sound' || type === 'match_habitat' || type === 'match_clue' || type === 'match_family') && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="p-4 bg-white rounded-3xl border border-pink-200 shadow-xs flex items-center justify-center gap-3">
              <span className="text-4xl">
                {type === 'match_sound' ? '📢' : type === 'match_habitat' ? '🌍' : '🐾'}
              </span>
              <span className="text-base font-extrabold text-pink-700">
                {config.soundPrompt || config.habitat || config.clue || config.babyName}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
              {config.options.map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswerSubmit(opt.id)}
                  aria-label={`Animal ${opt.name}`}
                  className="p-4 rounded-2xl bg-white hover:bg-pink-50 border-3 border-pink-400 shadow-md active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <span className="text-4xl sm:text-5xl">{opt.emoji}</span>
                  <span className="text-xs font-black text-slate-700">{opt.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type 10: Pattern Complete */}
        {type === 'pattern_complete' && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex items-center justify-center gap-2 sm:gap-3 p-4 bg-white rounded-3xl border border-purple-200 shadow-sm w-full">
              {config.sequence.map((token: string, i: number) => (
                <span key={i} className="text-3xl sm:text-4xl">
                  {token}
                </span>
              ))}
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border-2 border-dashed border-purple-400 flex items-center justify-center text-purple-700 font-black text-xl animate-pulse">
                ?
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
              {config.options.map((tokenOpt: string) => (
                <button
                  key={tokenOpt}
                  onClick={() => handleAnswerSubmit(tokenOpt)}
                  aria-label={`Pattern token ${tokenOpt}`}
                  className="py-4 px-6 rounded-2xl bg-white hover:bg-purple-50 border-3 border-purple-400 text-4xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                >
                  {tokenOpt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type 11: Size Sorting & Odd One Out */}
        {(type === 'size_sorting' || type === 'odd_one_out' || type === 'sequence_logic' || type === 'silhouette_fit') && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full">
              {config.options.map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswerSubmit(opt.id)}
                  aria-label={`Choice ${opt.label || opt.id}`}
                  className="p-4 rounded-2xl bg-white hover:bg-violet-50 border-3 border-violet-400 shadow-md active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <span className={`${opt.scale || 'text-4xl'}`}>{opt.emoji}</span>
                  <span className="text-[11px] font-bold text-slate-600">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type 12: Memory Card Match */}
        {type === 'card_match' && (
          <div className="w-full">
            <div
              className={`grid gap-2.5 max-w-md mx-auto ${
                config.gridCols === 4 ? 'grid-cols-4' : 'grid-cols-3'
              }`}
            >
              {cardsState.map((card, idx) => (
                <button
                  key={card.uniqueId}
                  onClick={() => handleCardClick(idx)}
                  disabled={card.matched || card.flipped}
                  aria-label={`Card ${idx + 1}`}
                  className={`aspect-square rounded-2xl font-black text-3xl sm:text-4xl flex items-center justify-center transition-all duration-300 transform cursor-pointer ${
                    card.matched
                      ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-800 scale-95 opacity-80'
                      : card.flipped
                      ? 'bg-white border-3 border-blue-400 shadow-md rotate-y-180'
                      : 'bg-gradient-to-tr from-cyan-400 to-blue-500 border-2 border-cyan-300 shadow-sm text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  {card.flipped || card.matched ? card.emoji : '❓'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Encouragement / Positive Feedback Banner */}
      <div className="h-12 flex items-center justify-center">
        {feedback === 'correct' && (
          <div className="px-5 py-2 rounded-full bg-emerald-500 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-lg animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>{feedbackMessage}</span>
            <Sparkles className="w-4 h-4" />
          </div>
        )}
        {feedback === 'retry' && (
          <div className="px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs animate-shake">
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>{feedbackMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
