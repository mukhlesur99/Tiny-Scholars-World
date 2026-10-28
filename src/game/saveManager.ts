/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerSaveData, ModuleId, LanguageCode } from './types';
import { ALL_LEVELS, STICKERS } from './levelsData';

export const CURRENT_SAVE_VERSION = 1;
export const STORAGE_KEY = 'wondertots_game_save_v1';

export function createDefaultSaveData(): PlayerSaveData {
  const initialModules: PlayerSaveData['modules'] = {
    number_adventure: { highest_unlocked_level: 1, levels: {} },
    shape_explorer: { highest_unlocked_level: 1, levels: {} },
    color_quest: { highest_unlocked_level: 1, levels: {} },
    animal_world: { highest_unlocked_level: 1, levels: {} },
    logic_puzzle: { highest_unlocked_level: 1, levels: {} },
    memory_challenge: { highest_unlocked_level: 1, levels: {} },
  };

  return {
    save_version: CURRENT_SAVE_VERSION,
    updated_at: new Date().toISOString(),
    total_stars: 0,
    unlocked_stickers: [],
    settings: {
      language: 'en',
      sound_enabled: true,
      voice_narration: true,
      volume: 0.8,
      reduced_motion: false,
      high_contrast: false,
      speech_rate: 1.0,
    },
    modules: initialModules,
  };
}

/**
 * Validates and migrates raw parsed JSON into a guaranteed compliant PlayerSaveData object.
 * Recovers gracefully if fields are missing or corrupted.
 */
export function validateAndMigrateSave(raw: any): PlayerSaveData {
  const defaults = createDefaultSaveData();
  if (!raw || typeof raw !== 'object') {
    return defaults;
  }

  // Handle version migration if needed in the future
  const saveVersion = Number.isInteger(raw.save_version) ? raw.save_version : CURRENT_SAVE_VERSION;

  const validLang: LanguageCode = ['en', 'es', 'fr', 'bn'].includes(raw.settings?.language)
    ? raw.settings.language
    : 'en';

  const sanitizedSettings = {
    language: validLang,
    sound_enabled: typeof raw.settings?.sound_enabled === 'boolean' ? raw.settings.sound_enabled : true,
    voice_narration: typeof raw.settings?.voice_narration === 'boolean' ? raw.settings.voice_narration : true,
    volume: typeof raw.settings?.volume === 'number' ? Math.max(0, Math.min(1, raw.settings.volume)) : 0.8,
    reduced_motion: typeof raw.settings?.reduced_motion === 'boolean' ? raw.settings.reduced_motion : false,
    high_contrast: typeof raw.settings?.high_contrast === 'boolean' ? raw.settings.high_contrast : false,
    speech_rate: typeof raw.settings?.speech_rate === 'number' ? Math.max(0.6, Math.min(1.4, raw.settings.speech_rate)) : 1.0,
  };

  const moduleKeys: ModuleId[] = [
    'number_adventure',
    'shape_explorer',
    'color_quest',
    'animal_world',
    'logic_puzzle',
    'memory_challenge',
  ];

  const sanitizedModules: PlayerSaveData['modules'] = { ...defaults.modules };
  let calculatedStars = 0;

  for (const modId of moduleKeys) {
    const rawMod = raw.modules?.[modId];
    if (rawMod && typeof rawMod === 'object') {
      const highestUnlocked = Number.isInteger(rawMod.highest_unlocked_level)
        ? Math.max(1, Math.min(10, rawMod.highest_unlocked_level))
        : 1;

      const levelsObj: PlayerSaveData['modules'][ModuleId]['levels'] = {};
      if (rawMod.levels && typeof rawMod.levels === 'object') {
        for (const [lvlKey, lvlData] of Object.entries(rawMod.levels)) {
          const lvlNum = parseInt(lvlKey, 10);
          if (!isNaN(lvlNum) && lvlData && typeof lvlData === 'object') {
            const data = lvlData as any;
            const stars = [1, 2, 3].includes(data.stars) ? data.stars : 1;
            const completed = Boolean(data.completed);
            levelsObj[lvlNum] = {
              completed,
              stars,
              bestScore: typeof data.bestScore === 'number' ? data.bestScore : 100,
              attempts: typeof data.attempts === 'number' ? data.attempts : 1,
              completedAt: typeof data.completedAt === 'string' ? data.completedAt : new Date().toISOString(),
            };
            if (completed) {
              calculatedStars += stars;
            }
          }
        }
      }

      sanitizedModules[modId] = {
        highest_unlocked_level: highestUnlocked,
        levels: levelsObj,
      };
    }
  }

  // Calculate unlocked stickers based on total stars
  const unlockedStickers: string[] = [];
  for (const sticker of STICKERS) {
    if (calculatedStars >= sticker.unlockedAtStars) {
      unlockedStickers.push(sticker.id);
    }
  }

  return {
    save_version: saveVersion,
    updated_at: typeof raw.updated_at === 'string' ? raw.updated_at : new Date().toISOString(),
    total_stars: calculatedStars,
    unlocked_stickers: unlockedStickers,
    settings: sanitizedSettings,
    modules: sanitizedModules,
  };
}

export function loadSaveData(): PlayerSaveData {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return createDefaultSaveData();
    }
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      const initial = createDefaultSaveData();
      saveToStorage(initial);
      return initial;
    }
    const parsed = JSON.parse(serialized);
    return validateAndMigrateSave(parsed);
  } catch (err) {
    console.warn('[WonderTots SaveSystem] Recovered from corrupted save data, resetting to safe defaults:', err);
    const fallback = createDefaultSaveData();
    saveToStorage(fallback);
    return fallback;
  }
}

export function saveToStorage(data: PlayerSaveData): boolean {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return true;
    }
    data.updated_at = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('[WonderTots SaveSystem] Failed to write save to localStorage:', err);
    return false;
  }
}

export function calculateStars(attempts: number, errorCount: number): number {
  // Fair, positive learning reward model:
  // - 0 errors = 3 stars
  // - 1-2 minor retries = 2 stars
  // - 3+ retries = 1 star (never 0 stars for finishing!)
  if (errorCount === 0) return 3;
  if (errorCount <= 2) return 2;
  return 1;
}

export function recordLevelCompletion(
  save: PlayerSaveData,
  moduleId: ModuleId,
  levelId: number,
  starsAwarded: number,
  attemptsCount: number
): PlayerSaveData {
  const modData = save.modules[moduleId];
  const existing = modData.levels[levelId];
  const bestStars = existing ? Math.max(existing.stars, starsAwarded) : starsAwarded;

  modData.levels[levelId] = {
    completed: true,
    stars: bestStars,
    bestScore: 100,
    attempts: (existing?.attempts || 0) + attemptsCount,
    completedAt: new Date().toISOString(),
  };

  // Unlock next level if currently at highest
  if (levelId >= modData.highest_unlocked_level && levelId < 10) {
    modData.highest_unlocked_level = levelId + 1;
  }

  // Recalculate stars across all modules
  let totalStars = 0;
  for (const m of Object.values(save.modules)) {
    for (const lvl of Object.values(m.levels)) {
      if (lvl.completed) {
        totalStars += lvl.stars;
      }
    }
  }
  save.total_stars = totalStars;

  // Check new sticker unlocks
  const unlocked = new Set(save.unlocked_stickers);
  for (const sticker of STICKERS) {
    if (totalStars >= sticker.unlockedAtStars) {
      unlocked.add(sticker.id);
    }
  }
  save.unlocked_stickers = Array.from(unlocked);

  saveToStorage(save);
  return { ...save };
}

export function resetSaveData(): PlayerSaveData {
  const fresh = createDefaultSaveData();
  saveToStorage(fresh);
  return fresh;
}
