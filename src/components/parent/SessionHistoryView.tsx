import React, { useState } from 'react';
import { SessionRecord } from '../../types';
import { CheckCircle, Trash2, Calendar, Star, Clock } from 'lucide-react';

interface SessionHistoryViewProps {
  history: SessionRecord[];
  onClearHistory: () => void;
}

export const SessionHistoryView: React.FC<SessionHistoryViewProps> = ({
  history,
  onClearHistory,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  function formatTime(sec: number): string {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const rem = sec % 60;
    return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
  }

  function formatDate(timestamp: number): string {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-slate-800">
          Sitting History ({history.length} Sessions)
        </h3>

        {history.length > 0 && (
          <div>
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClearHistory();
                    setConfirmClear(false);
                  }}
                  className="px-3 py-1 rounded-xl bg-red-600 text-white font-bold text-xs"
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="w-full p-8 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
          <Calendar className="w-10 h-10 text-slate-300 mb-2" />
          <p className="font-bold text-slate-600 text-sm">No sessions recorded yet</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Sessions will appear here as your child completes sitting timers.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
          {history.map((record) => (
            <div
              key={record.id}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    record.completed
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  {record.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800 text-sm">
                      {record.completed ? 'Completed' : 'Gentle Pause'}
                    </span>
                    {record.activityTitle && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-pink-50 text-pink-700">
                        {record.activityTitle}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {formatDate(record.timestamp)} • Mode: {record.mode}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-black text-slate-700 text-sm">
                  {formatTime(record.durationCompletedSec)} / {formatTime(record.durationSelectedSec)}
                </span>
                {record.starsEarned > 0 && (
                  <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>+{record.starsEarned} Star</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
