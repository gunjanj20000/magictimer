import React from 'react';
import { CharacterId } from '../../types';
import { Bunny } from './Bunny';
import { Panda } from './Panda';
import { Elephant } from './Elephant';
import { Dinosaur } from './Dinosaur';
import { Cat } from './Cat';
import { Bear } from './Bear';

interface CharacterAvatarProps {
  characterId: CharacterId;
  mood?: 'idle' | 'walk' | 'happy' | 'almost' | 'celebrate';
  size?: number;
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  mood = 'idle',
  size = 120,
  className = '',
}) => {
  switch (characterId) {
    case 'panda':
      return <Panda mood={mood} size={size} className={className} />;
    case 'elephant':
      return <Elephant mood={mood} size={size} className={className} />;
    case 'dinosaur':
      return <Dinosaur mood={mood} size={size} className={className} />;
    case 'cat':
      return <Cat mood={mood} size={size} className={className} />;
    case 'bear':
      return <Bear mood={mood} size={size} className={className} />;
    case 'bunny':
    default:
      return <Bunny mood={mood} size={size} className={className} />;
  }
};

export const CHARACTER_META: { id: CharacterId; name: string; color: string; label: string }[] = [
  { id: 'bunny', name: 'Bella Bunny', color: 'bg-pink-100 text-pink-700 border-pink-300', label: '🐰 Bunny' },
  { id: 'panda', name: 'Pip Panda', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', label: '🐼 Panda' },
  { id: 'elephant', name: 'Ellie Elephant', color: 'bg-sky-100 text-sky-800 border-sky-300', label: '🐘 Elephant' },
  { id: 'dinosaur', name: 'Dino Danny', color: 'bg-green-100 text-green-800 border-green-300', label: '🦕 Dino' },
  { id: 'cat', name: 'Cookie Cat', color: 'bg-orange-100 text-orange-800 border-orange-300', label: '🐱 Cat' },
  { id: 'bear', name: 'Barnaby Bear', color: 'bg-amber-100 text-amber-800 border-amber-300', label: '🐻 Bear' },
];
