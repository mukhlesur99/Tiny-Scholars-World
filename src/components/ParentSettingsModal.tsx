/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Volume2,
  Mic,
  Eye,
  Activity,
  RotateCcw,
  Download,
  Upload,
  ShieldCheck,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { PlayerSaveData, LanguageCode } from '../game/types';
import { LOCALES } from '../game/localization';
import { resetSaveData, saveToStorage, validateAndMigrateSave } from '../game/saveManager';
import { audioEngine } from '../game/audioEngine';

interface ParentSettingsModalProps {
  currentLang: LanguageCode;
  saveData: PlayerSaveData;
  onUpdateSave: (newSave: PlayerSaveData) => void;
  onClose: () => void;
  highContrast: boolean;
}

export const ParentSettingsModal: React.FC<ParentSettingsModalProps> = ({
  currentLang,
  saveData,
  onUpdateSave,
  onClose,
  highContrast,
}) => {
  const currentLocale = LOCALES[currentLang];
  const [activeTab, setActiveTab] = useState<'settings' | 'privacy'>('settings');
  const [resetConfirm, setResetConfirm] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const updateSetting = (key: keyof PlayerSaveData['settings'], val: any) => {
    const updated = {
      ...saveData,
      settings: {
        ...saveData.settings,
        [key]: val,
      },
    };
    saveToStorage(updated);
    onUpdateSave(updated);
    audioEngine.setSettings(
      updated.settings.sound_enabled,
      updated.settings.voice_narration,
      updated.settings.volume,
      updated.settings.speech_rate
    );
  };

  const handleReset = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }
    const fresh = resetSaveData();
    onUpdateSave(fresh);
    setResetConfirm(false);
    showToast(currentLocale.strings.resetSuccess);
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(saveData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'wondertots_save_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Save file downloaded!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const validated = validateAndMigrateSave(parsed);
        saveToStorage(validated);
        onUpdateSave(validated);
        showToast(currentLocale.strings.importSuccess);
      } catch (err) {
        showToast(currentLocale.strings.importError);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full max-w-xl max-h-[90vh] rounded-3xl p-5 sm:p-6 shadow-2xl border-2 flex flex-col overflow-hidden ${
          highContrast
            ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black">{currentLocale.strings.parentSettings}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Settings vs Privacy Policy */}
        <div className="flex gap-2 my-3">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              activeTab === 'settings'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Controls & Save Data
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Child Privacy & Compliance
          </button>
        </div>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="mb-2 p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Tab 1: Controls & Save Data */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
            {/* Audio Settings Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-2 text-slate-700">
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  {currentLocale.strings.sound}
                </span>
                <input
                  type="checkbox"
                  checked={saveData.settings.sound_enabled}
                  onChange={(e) => updateSetting('sound_enabled', e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                  <span>{currentLocale.strings.volume}</span>
                  <span>{Math.round(saveData.settings.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={saveData.settings.volume}
                  onChange={(e) => updateSetting('volume', parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="font-bold flex items-center gap-2 text-slate-700">
                  <Mic className="w-4 h-4 text-emerald-500" />
                  {currentLocale.strings.voice}
                </span>
                <input
                  type="checkbox"
                  checked={saveData.settings.voice_narration}
                  onChange={(e) => updateSetting('voice_narration', e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                  <span>{currentLocale.strings.speechRate}</span>
                  <span>{saveData.settings.speech_rate}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.1"
                  value={saveData.settings.speech_rate}
                  onChange={(e) => updateSetting('speech_rate', parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Accessibility Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-2 text-slate-700">
                  <Eye className="w-4 h-4 text-amber-500" />
                  {currentLocale.strings.highContrast}
                </span>
                <input
                  type="checkbox"
                  checked={saveData.settings.high_contrast}
                  onChange={(e) => updateSetting('high_contrast', e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="font-bold flex items-center gap-2 text-slate-700">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  {currentLocale.strings.reducedMotion}
                </span>
                <input
                  type="checkbox"
                  checked={saveData.settings.reduced_motion}
                  onChange={(e) => updateSetting('reduced_motion', e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Data Management & Backup */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-700 block mb-1">Save Data & Backup</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleExport}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-500" />
                  <span>{currentLocale.strings.exportData}</span>
                </button>

                <label className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                  <Upload className="w-4 h-4 text-emerald-500" />
                  <span>{currentLocale.strings.importData}</span>
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={handleReset}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    resetConfirm
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>
                    {resetConfirm ? currentLocale.strings.resetConfirm : currentLocale.strings.resetProgress}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Child Privacy & Legal Compliance */}
        {activeTab === 'privacy' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs text-slate-600 leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{currentLocale.strings.dataSafetyBadge}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">1. Children’s Online Privacy Protection Act (COPPA)</h4>
              <p>
                WonderTots is strictly designed for young children (ages 3–8) and their families. We do not collect,
                store, share, transmit, or sell ANY personally identifiable information (PII) such as child names,
                emails, precise or approximate locations, microphone recordings, camera feeds, device identifiers,
                advertising IDs, or IP addresses.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">2. Zero Third-Party Trackers & Offline Sovereignty</h4>
              <p>
                This application contains zero advertising SDKs, zero social networking SDKs, zero analytics trackers,
                and zero marketing pixels. All game state, unlocked stars, and settings are saved exclusively on the
                local device via sandboxed local storage (<code className="bg-slate-200 px-1 rounded">wondertots_save_v1</code>)
                and are wiped completely upon uninstallation.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">3. Google Play Families Policy Compliance</h4>
              <p>
                • Target age group: 5 & under, 6–8 years old.<br />
                • Content rating: ESRB Everyone / PEGI 3 / IARC 3+.<br />
                • No in-app purchases or subscription paywalls.<br />
                • Parental gate protects all adult-directed options.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
