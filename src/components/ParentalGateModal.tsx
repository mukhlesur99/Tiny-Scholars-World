/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, X, Check } from 'lucide-react';
import { LanguageCode } from '../game/types';
import { LOCALES } from '../game/localization';

interface ParentalGateModalProps {
  currentLang: LanguageCode;
  onSuccess: () => void;
  onCancel: () => void;
  highContrast: boolean;
}

export const ParentalGateModal: React.FC<ParentalGateModalProps> = ({
  currentLang,
  onSuccess,
  onCancel,
  highContrast,
}) => {
  const currentLocale = LOCALES[currentLang];

  // Random multiplication numbers (e.g., 6 x 7 = 42)
  const [numA] = useState(() => Math.floor(Math.random() * 6) + 4); // 4 to 9
  const [numB] = useState(() => Math.floor(Math.random() * 6) + 3); // 3 to 8
  const expected = numA * numB;

  const [inputVal, setInputVal] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  const handleKeypadPress = (digit: string) => {
    if (inputVal.length < 3) {
      setInputVal((prev) => prev + digit);
      setHasError(false);
    }
  };

  const handleClear = () => {
    setInputVal('');
    setHasError(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (parseInt(inputVal, 10) === expected) {
      onSuccess();
    } else {
      setHasError(true);
      setInputVal('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl border-2 relative ${
          highContrast
            ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <button
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-black mb-1">{currentLocale.strings.parentGateTitle}</h3>
        <p className="text-xs text-slate-500 mb-4">{currentLocale.strings.parentGateHint}</p>

        {/* Math Challenge */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 mb-4">
          <span className="text-2xl font-black tracking-widest text-slate-800">
            {numA} × {numB} = {inputVal || '?'}
          </span>
        </div>

        {hasError && (
          <p className="text-xs font-bold text-rose-500 mb-3 animate-shake">
            {currentLocale.strings.parentGateFailed}
          </p>
        )}

        {/* On-Screen Touch Keypad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map((key) => {
            if (key === 'C') {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={handleClear}
                  className="py-3 rounded-xl bg-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-300 active:scale-95 cursor-pointer"
                >
                  Clear
                </button>
              );
            }
            if (key === 'OK') {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSubmit()}
                  className="py-3 rounded-xl bg-purple-600 text-white font-black text-sm hover:bg-purple-700 active:scale-95 cursor-pointer"
                >
                  OK
                </button>
              );
            }
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleKeypadPress(key)}
                className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-lg active:scale-95 cursor-pointer"
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
