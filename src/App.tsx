/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ModuleId,
  ScreenState,
  PlayerSaveData,
  LanguageCode,
  LevelData,
} from './game/types';
import {
  loadSaveData,
  recordLevelCompletion,
  saveToStorage,
} from './game/saveManager';
import { ALL_LEVELS } from './game/levelsData';
import { audioEngine } from './game/audioEngine';
import { TopNav } from './components/TopNav';
import { TitleScreen } from './components/TitleScreen';
import { ModuleSelectScreen } from './components/ModuleSelectScreen';
import { LevelSelectScreen } from './components/LevelSelectScreen';
import { GameplayScreen } from './components/GameplayScreen';
import { VictoryModal } from './components/VictoryModal';
import { ParentalGateModal } from './components/ParentalGateModal';
import { ParentSettingsModal } from './components/ParentSettingsModal';
import { StickerAlbum } from './components/StickerAlbum';
import { GodotDevStudio } from './components/GodotDevStudio';

export default function App() {
  const [saveData, setSaveData] = useState<PlayerSaveData>(() => loadSaveData());
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('title');
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>('number_adventure');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);

  // Modals
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [lastStarsEarned, setLastStarsEarned] = useState<number>(3);
  const [showParentGate, setShowParentGate] = useState<boolean>(false);
  const [showParentSettings, setShowParentSettings] = useState<boolean>(false);
  const [showStickerAlbum, setShowStickerAlbum] = useState<boolean>(false);
  const [showStudio, setShowStudio] = useState<boolean>(false);

  // Viewport mode: responsive vs simulated budget Android device
  const [viewportMode, setViewportMode] = useState<'responsive' | 'mobile_360' | 'tablet_720'>('responsive');

  // Ultra-mode document.body.dataset.state sync
  useEffect(() => {
    const stateMap: Record<ScreenState, string> = {
      title: 'title',
      module_select: 'playing',
      level_select: 'playing',
      gameplay: 'playing',
      level_complete: 'gameover',
      parent_settings: 'paused',
      parent_gate: 'paused',
      sticker_book: 'paused',
    };
    document.body.dataset.state = stateMap[currentScreen] || 'title';
  }, [currentScreen]);

  // Audio settings sync
  useEffect(() => {
    audioEngine.setSettings(
      saveData.settings.sound_enabled,
      saveData.settings.voice_narration,
      saveData.settings.volume,
      saveData.settings.speech_rate
    );
  }, [saveData.settings]);

  // Handle ?autostart=1 query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setCurrentScreen('module_select');
    }
  }, []);

  const handleLanguageChange = (lang: LanguageCode) => {
    const updated = {
      ...saveData,
      settings: {
        ...saveData.settings,
        language: lang,
      },
    };
    saveToStorage(updated);
    setSaveData(updated);
  };

  const handleToggleSound = () => {
    const updated = {
      ...saveData,
      settings: {
        ...saveData.settings,
        sound_enabled: !saveData.settings.sound_enabled,
      },
    };
    saveToStorage(updated);
    setSaveData(updated);
    audioEngine.setSettings(
      updated.settings.sound_enabled,
      updated.settings.voice_narration,
      updated.settings.volume,
      updated.settings.speech_rate
    );
  };

  const handleToggleHighContrast = () => {
    const updated = {
      ...saveData,
      settings: {
        ...saveData.settings,
        high_contrast: !saveData.settings.high_contrast,
      },
    };
    saveToStorage(updated);
    setSaveData(updated);
  };

  const handleStartGame = () => {
    audioEngine.playPop();
    setCurrentScreen('module_select');
  };

  const handleSelectModule = (modId: ModuleId) => {
    audioEngine.playPop();
    setActiveModuleId(modId);
    setCurrentScreen('level_select');
  };

  const handleSelectLevel = (lvlId: number) => {
    audioEngine.playPop();
    setActiveLevelId(lvlId);
    setCurrentScreen('gameplay');
  };

  const handleLevelCompleted = useCallback(
    (stars: number, attempts: number) => {
      setLastStarsEarned(stars);
      setShowVictory(true);

      const updated = recordLevelCompletion(
        saveData,
        activeModuleId,
        activeLevelId,
        stars,
        attempts
      );
      setSaveData({ ...updated });
    },
    [activeModuleId, activeLevelId, saveData]
  );

  const handleNextLevel = () => {
    setShowVictory(false);
    if (activeLevelId < 10) {
      setActiveLevelId((prev) => prev + 1);
      setCurrentScreen('gameplay');
    } else {
      setCurrentScreen('level_select');
    }
  };

  const handleReplayLevel = () => {
    setShowVictory(false);
    setCurrentScreen('gameplay');
  };

  const handleReturnHome = () => {
    setShowVictory(false);
    setCurrentScreen('module_select');
  };

  // Find active level data
  const currentLevels = ALL_LEVELS[activeModuleId] || ALL_LEVELS.number_adventure;
  const currentLevelData = currentLevels.find((l) => l.id === activeLevelId) || currentLevels[0];

  const hasAnyProgress = saveData.total_stars > 0;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        saveData.settings.high_contrast
          ? 'bg-black text-yellow-300'
          : 'bg-gradient-to-b from-sky-50 via-slate-50 to-blue-50 text-slate-900'
      }`}
    >
      {/* Top Application Bar */}
      <TopNav
        currentLang={saveData.settings.language}
        onLanguageChange={handleLanguageChange}
        soundEnabled={saveData.settings.sound_enabled}
        onToggleSound={handleToggleSound}
        highContrast={saveData.settings.high_contrast}
        onToggleHighContrast={handleToggleHighContrast}
        totalStars={saveData.total_stars}
        onOpenParentGate={() => setShowParentGate(true)}
        onOpenStickerBook={() => setShowStickerAlbum(true)}
        studioMode={showStudio}
        onToggleStudioMode={() => setShowStudio((prev) => !prev)}
        viewportMode={viewportMode}
        onViewportChange={setViewportMode}
      />

      {/* Main Container with Optional Viewport Simulation for low-end devices */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        {showStudio ? (
          <div className="w-full max-w-7xl">
            <GodotDevStudio
              onClose={() => setShowStudio(false)}
              highContrast={saveData.settings.high_contrast}
            />
          </div>
        ) : (
          <div
            className={`w-full transition-all duration-300 ${
              viewportMode === 'mobile_360'
                ? 'max-w-[360px] min-h-[640px] rounded-[36px] border-8 border-slate-800 shadow-2xl overflow-hidden bg-white my-4'
                : viewportMode === 'tablet_720'
                ? 'max-w-[800px] min-h-[580px] rounded-[28px] border-8 border-slate-700 shadow-2xl overflow-hidden bg-white my-4'
                : 'max-w-5xl rounded-3xl border border-slate-200/80 shadow-md overflow-hidden bg-white'
            }`}
          >
            {/* Viewport Frame Header if in simulated mode */}
            {viewportMode !== 'responsive' && (
              <div className="bg-slate-800 text-slate-300 px-4 py-1 text-[11px] font-mono flex items-center justify-between">
                <span>
                  {viewportMode === 'mobile_360' ? 'Android Device Simulator (360x640 dp)' : 'Tablet Simulator (800x1280 dp)'}
                </span>
                <span className="text-emerald-400 font-bold">60 FPS Offline</span>
              </div>
            )}

            {/* Screen Router */}
            {currentScreen === 'title' && (
              <TitleScreen
                currentLang={saveData.settings.language}
                onStart={handleStartGame}
                onOpenStickerAlbum={() => setShowStickerAlbum(true)}
                totalStars={saveData.total_stars}
                hasProgress={hasAnyProgress}
                highContrast={saveData.settings.high_contrast}
              />
            )}

            {currentScreen === 'module_select' && (
              <ModuleSelectScreen
                currentLang={saveData.settings.language}
                saveData={saveData}
                onSelectModule={handleSelectModule}
                onBack={() => setCurrentScreen('title')}
                highContrast={saveData.settings.high_contrast}
              />
            )}

            {currentScreen === 'level_select' && (
              <LevelSelectScreen
                moduleId={activeModuleId}
                currentLang={saveData.settings.language}
                saveData={saveData}
                onSelectLevel={handleSelectLevel}
                onBack={() => setCurrentScreen('module_select')}
                highContrast={saveData.settings.high_contrast}
              />
            )}

            {currentScreen === 'gameplay' && (
              <GameplayScreen
                levelData={currentLevelData}
                currentLang={saveData.settings.language}
                onComplete={handleLevelCompleted}
                onExit={() => setCurrentScreen('level_select')}
                highContrast={saveData.settings.high_contrast}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      {showVictory && (
        <VictoryModal
          stars={lastStarsEarned}
          levelId={activeLevelId}
          moduleId={activeModuleId}
          currentLang={saveData.settings.language}
          onNextLevel={handleNextLevel}
          onReplay={handleReplayLevel}
          onHome={handleReturnHome}
          highContrast={saveData.settings.high_contrast}
        />
      )}

      {showParentGate && (
        <ParentalGateModal
          currentLang={saveData.settings.language}
          onSuccess={() => {
            setShowParentGate(false);
            setShowParentSettings(true);
          }}
          onCancel={() => setShowParentGate(false)}
          highContrast={saveData.settings.high_contrast}
        />
      )}

      {showParentSettings && (
        <ParentSettingsModal
          currentLang={saveData.settings.language}
          saveData={saveData}
          onUpdateSave={(newSave) => setSaveData(newSave)}
          onClose={() => setShowParentSettings(false)}
          highContrast={saveData.settings.high_contrast}
        />
      )}

      {showStickerAlbum && (
        <StickerAlbum
          currentLang={saveData.settings.language}
          totalStars={saveData.total_stars}
          unlockedStickers={saveData.unlocked_stickers}
          onClose={() => setShowStickerAlbum(false)}
          highContrast={saveData.settings.high_contrast}
        />
      )}
    </div>
  );
}
