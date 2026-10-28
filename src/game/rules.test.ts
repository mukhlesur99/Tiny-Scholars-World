/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStars,
  createDefaultSaveData,
  validateAndMigrateSave,
  recordLevelCompletion,
} from './saveManager';
import { LOCALES } from './localization';
import { ALL_LEVELS, MODULES } from './levelsData';

test('scoring and star calculation rewards completion without punishment', () => {
  assert.equal(calculateStars(1, 0), 3, 'Flawless attempt awards 3 stars');
  assert.equal(calculateStars(2, 1), 2, 'One retry awards 2 stars');
  assert.equal(calculateStars(3, 2), 2, 'Two retries award 2 stars');
  assert.equal(calculateStars(5, 4), 1, 'Multiple retries still award at least 1 star');
});

test('save data validation recovers safely from null or corrupted input', () => {
  const fallbackFromNull = validateAndMigrateSave(null);
  assert.equal(fallbackFromNull.save_version, 1);
  assert.equal(fallbackFromNull.total_stars, 0);
  assert.equal(fallbackFromNull.settings.language, 'en');

  const fallbackFromMalformed = validateAndMigrateSave({
    save_version: 'bad_version',
    settings: { language: 'invalid_lang', volume: 999 },
    modules: 'corrupted_string',
  });
  assert.equal(fallbackFromMalformed.save_version, 1);
  assert.equal(fallbackFromMalformed.settings.language, 'en');
  assert.equal(fallbackFromMalformed.settings.volume, 1.0);
  assert.ok(fallbackFromMalformed.modules.number_adventure);
});

test('level completion unlocks next level and updates total stars correctly', () => {
  const save = createDefaultSaveData();
  assert.equal(save.modules.number_adventure.highest_unlocked_level, 1);
  assert.equal(save.total_stars, 0);

  // Complete level 1 with 3 stars
  const updated = recordLevelCompletion(save, 'number_adventure', 1, 3, 1);
  assert.equal(updated.modules.number_adventure.levels[1].completed, true);
  assert.equal(updated.modules.number_adventure.levels[1].stars, 3);
  assert.equal(updated.modules.number_adventure.highest_unlocked_level, 2);
  assert.equal(updated.total_stars, 3);
  assert.ok(updated.unlocked_stickers.includes('star_explorer'));
});

test('curriculum contains at least 10 playable levels per module (60 total)', () => {
  assert.equal(MODULES.length, 6, 'Must have 6 modules');
  for (const mod of MODULES) {
    const levels = ALL_LEVELS[mod.id];
    assert.ok(levels, `Module ${mod.id} must exist in ALL_LEVELS`);
    assert.ok(levels.length >= 10, `Module ${mod.id} must have at least 10 levels, found ${levels.length}`);
    
    // Check level continuity
    for (let i = 1; i <= 10; i++) {
      const lvl = levels.find((l) => l.id === i);
      assert.ok(lvl, `Module ${mod.id} missing level ${i}`);
      assert.ok(lvl.config, `Level ${i} in ${mod.id} missing config`);
    }
  }
});

test('localization completeness across all 4 supported languages', () => {
  const supported = ['en', 'es', 'fr', 'bn'] as const;
  const enKeys = Object.keys(LOCALES.en.strings);

  for (const lang of supported) {
    const locale = LOCALES[lang];
    assert.ok(locale, `Locale ${lang} must exist`);
    assert.ok(locale.strings, `Locale ${lang} must have strings dictionary`);
    
    // Check all keys from English exist in target locale
    for (const key of enKeys) {
      assert.ok(
        (locale.strings as any)[key] !== undefined && (locale.strings as any)[key] !== '',
        `Locale ${lang} missing translation for key "${key}"`
      );
    }
  }
});
