'use client';

import React from 'react';
import { PhoneIncoming, Zap, Clock, Code2, TrendingUp } from 'lucide-react';
import { CallSession } from '@/lib/storage';

interface MetricCardsProps {
  sessions: CallSession[];
}

export default function MetricCards({ sessions }: MetricCardsProps) {
  const totalSessions = sessions.length;

  const avgLatency = sessions.length > 0
    ? Math.round(sessions.reduce((acc, s) => acc + (s.latencyMs || 650), 0) / sessions.length)
    : 640;

  const totalSolved = sessions.reduce((acc, s) => acc + (s.solvedProblems || 1), 0);

  const totalDurationMinutes = sessions.reduce((acc, s) => {
    const sec = s.audioDurationSec || 2400;
    return acc + Math.round(sec / 60);
  }, 0);

  const hours = Math.floor(totalDurationMinutes / 60);
  const mins = totalDurationMinutes % 60;
  const durationDisplay = `${hours}h ${mins}m`;

  const cards = [
    {
      title: 'Total Call Sessions',
      value: totalSessions.toString(),
      subtext: '+3 this week',
      trend: '+18%',
      icon: PhoneIncoming,
      iconBg: 'bg-[#0052cc]/10 text-[#0052cc]',
      borderHover: 'hover:border-[#0052cc]/50',
    },
    {
      title: 'Avg Answer Latency',
      value: `${avgLatency}ms`,
      subtext: 'Gemini 2.5 Flash Vision',
      trend: '-85ms',
      icon: Zap,
      iconBg: 'bg-emerald-50 text-emerald-600',
      borderHover: 'hover:border-emerald-300',
    },
    {
      title: 'Total Call Duration',
      value: durationDisplay,
      subtext: 'Dual-channel recorded',
      trend: '100% captured',
      icon: Clock,
      iconBg: 'bg-purple-50 text-purple-600',
      borderHover: 'hover:border-purple-300',
    },
    {
      title: 'Solved DSA Snippets',
      value: totalSolved.toString(),
      subtext: 'Optimal fixes generated',
      trend: '94% optimal O(1)',
      icon: Code2,
      iconBg: 'bg-blue-50 text-blue-600',
      borderHover: 'hover:border-blue-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 ${card.borderHover} hover:shadow-md hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">{card.title}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{card.value}</h3>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border border-slate-100 ${card.iconBg}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium truncate max-w-[140px]">{card.subtext}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 text-[11px]">
                <TrendingUp className="h-3 w-3" />
                {card.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
