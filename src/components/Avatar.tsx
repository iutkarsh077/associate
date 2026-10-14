import React from 'react';

interface AvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-purple-500 to-violet-600',
  'from-sky-500 to-cyan-600',
];

function getInitials(name?: string): string {
  if (!name || name.trim() === '') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getGradient(name?: string): string {
  if (!name) return 'from-stone-400 to-stone-500';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'sm', className = '' }) => {
  const initials = getInitials(name);
  const gradient = getGradient(name);

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-11 h-11 text-sm font-semibold',
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-tr ${gradient} text-white font-medium shrink-0 shadow-xs select-none ${sizeClasses} ${className}`}
      title={name || 'Unknown'}
    >
      {initials}
    </div>
  );
};
