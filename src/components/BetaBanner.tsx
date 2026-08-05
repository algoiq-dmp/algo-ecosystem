'use client';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function BetaBanner({ isBeta }: { isBeta: boolean }) {
  const [dismissed, setDismissed] = useState(false);

  if (!isBeta || dismissed) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-center text-[12px] font-medium flex items-center justify-center gap-2 shrink-0">
      <FiAlertTriangle size={14} className="shrink-0" />
      <span>
        <strong>BETA VERSION – Phase 1 (Local Network Only)</strong>
        {' '}Narad, Suraksha, Hanuman, Theta Yantra, Odin Platform, and Parikshak are disabled in this build and will be enabled in future production releases.
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="ml-2 p-0.5 rounded hover:bg-amber-600 transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <FiX size={14} />
      </button>
    </div>
  );
}
