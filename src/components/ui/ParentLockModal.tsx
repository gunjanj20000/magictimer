import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, X } from 'lucide-react';

interface ParentLockModalProps {
  isOpen: boolean;
  correctPin: string;
  onSuccess: () => void;
  onClose: () => void;
  title?: string;
}

export const ParentLockModal: React.FC<ParentLockModalProps> = ({
  isOpen,
  correctPin = '1234',
  onSuccess,
  onClose,
  title = 'Grown-Up Check 🌻',
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (d: string) => {
    if (pin.length < 4) {
      const next = pin + d;
      setPin(next);
      if (next.length === 4) {
        if (next === correctPin) {
          onSuccess();
          setPin('');
          setError(false);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  // Hold button logic for 3 seconds as alternative
  let holdInterval: any = null;
  const startHold = () => {
    setIsHolding(true);
    let p = 0;
    holdInterval = setInterval(() => {
      p += 10;
      setHoldProgress(p);
      if (p >= 100) {
        clearInterval(holdInterval);
        onSuccess();
      }
    }, 200);
  };

  const endHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdInterval) clearInterval(holdInterval);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-white rounded-4xl p-6 sm:p-7 shadow-2xl border-4 border-amber-200 flex flex-col items-center relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-black text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 font-medium mb-4 text-center">
          Enter PIN (default 1234) or press & hold below
        </p>

        {/* PIN Dots */}
        <div className={`flex gap-3 mb-5 ${error ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                pin.length > i
                  ? 'bg-amber-400 border-amber-500 scale-110'
                  : 'bg-slate-100 border-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Numeric keypad */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
            <button
              key={btn}
              onClick={() => {
                if (btn === 'C') setPin('');
                else if (btn === '⌫') handleBackspace();
                else handleDigit(btn);
              }}
              className="py-3 rounded-2xl bg-slate-50 hover:bg-amber-50 active:bg-amber-100 text-slate-700 font-bold text-xl border border-slate-200 transition-colors"
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Alternative: Hold for 2 seconds */}
        <div className="w-full pt-3 border-t border-slate-100 flex flex-col items-center">
          <button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className="relative overflow-hidden w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center gap-2 border border-slate-200"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-amber-300/60 transition-all duration-75"
              style={{ width: `${holdProgress}%` }}
            />
            <Unlock className="w-4 h-4 relative z-10" />
            <span className="relative z-10">
              {isHolding ? 'Holding...' : 'Or Hold 2 Seconds'}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
