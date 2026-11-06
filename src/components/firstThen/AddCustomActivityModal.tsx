import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ActivityItem } from '../../types';
import { X, Upload, Sparkles } from 'lucide-react';

interface AddCustomActivityModalProps {
  isOpen: boolean;
  category: 'first' | 'then';
  onAdd: (activity: ActivityItem) => void;
  onClose: () => void;
}

export const AddCustomActivityModal: React.FC<AddCustomActivityModalProps> = ({
  isOpen,
  category,
  onAdd,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setError('Image too large (max 3MB)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageDataUrl(event.target?.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please provide a short name');
      return;
    }
    const newAct: ActivityItem = {
      id: 'custom_' + Date.now(),
      title: title.trim(),
      iconName: category === 'first' ? 'chair' : 'gamepad-2',
      category,
      customImageDataUrl: imageDataUrl || undefined,
      isCustom: true,
    };
    onAdd(newAct);
    setTitle('');
    setImageDataUrl(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-white rounded-4xl p-6 shadow-2xl border-4 border-pink-200 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-black text-slate-800 text-center mb-1">
          Add Custom {category === 'first' ? 'First' : 'Then'} Card 🎨
        </h3>
        <p className="text-xs text-slate-500 text-center mb-4">
          Upload a photo from your device or camera
        </p>

        {/* Photo Upload Area */}
        <div className="w-full flex flex-col items-center mb-4">
          <label className="w-full aspect-video rounded-3xl border-2 border-dashed border-pink-300 hover:border-pink-500 bg-pink-50/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors relative">
            {imageDataUrl ? (
              <img src={imageDataUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-pink-400 p-4">
                <Upload className="w-8 h-8 mb-1" />
                <span className="font-bold text-xs">Tap to choose photo</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* Short Title */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-600 mb-1">Card Name</label>
          <input
            type="text"
            placeholder={category === 'first' ? 'e.g. Quiet Table' : 'e.g. Bluey Cartoon'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-400 font-bold text-slate-800"
          />
        </div>

        {error && <p className="text-red-500 text-xs font-bold text-center mb-3">{error}</p>}

        {/* Submit button */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-500 text-white font-black text-lg shadow-lg shadow-pink-200 border-2 border-white flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>Save Activity Card</span>
        </button>
      </motion.div>
    </div>
  );
};
