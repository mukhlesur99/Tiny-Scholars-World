/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ModuleId =
  | 'number_adventure'
  | 'shape_explorer'
  | 'color_quest'
  | 'animal_world'
  | 'logic_puzzle'
  | 'memory_challenge';

export type LanguageCode = 'en' | 'es' | 'fr' | 'bn';

export type ScreenState =
  | 'title'
  | 'module_select'
  | 'level_select'
  | 'gameplay'
  | 'level_complete'
  | 'parent_settings'
  | 'parent_gate'
  | 'sticker_book';

export interface LevelData {
  id: number;
  moduleId: ModuleId;
  titleKey: string;
  promptKey: string;
  ageTier: '3-4' | '5-6' | '7-8';
  type: string;
  config: Record<string, any>;
}

export interface ModuleDefinition {
  id: ModuleId;
  titleKey: string;
  descKey: string;
  iconName: string;
  accentColor: string;
  bgGradient: string;
  totalLevels: number;
}

export interface LevelProgress {
  completed: boolean;
  stars: number; // 1, 2, or 3
  bestScore: number;
  attempts: number;
  completedAt?: string;
}

export interface PlayerSaveData {
  save_version: number;
  updated_at: string;
  total_stars: number;
  unlocked_stickers: string[];
  settings: {
    language: LanguageCode;
    sound_enabled: boolean;
    voice_narration: boolean;
    volume: number; // 0.0 to 1.0
    reduced_motion: boolean;
    high_contrast: boolean;
    speech_rate: number; // 0.7 to 1.3
  };
  modules: Record<ModuleId, {
    highest_unlocked_level: number;
    levels: Record<number, LevelProgress>;
  }>;
}

export interface StickerReward {
  id: string;
  nameKey: string;
  emoji: string;
  category: string;
  unlockedAtStars: number;
}
