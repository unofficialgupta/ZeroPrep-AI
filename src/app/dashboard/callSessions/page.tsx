'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Play,
  Pause,
  MessageSquare,
  LayoutGrid,
  List,
  Clock
} from 'lucide-react';
import MetricCards from '@/components/MetricCards';
import SessionDetailDrawer from '@/components/SessionDetailDrawer';
import { CallSession, getStoredSessions, deleteStoredSession } from '@/lib/storage';
import { useSearch } from '@/context/SearchContext';

export default function CallSessionsPage() {
  const [sessions, setSessions] = useState<CallSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<CallSession | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const { searchQuery, setSearchQuery } = useSearch();
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getStoredSessions();
    setSessions(loaded);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('drawer') === 'true' && loaded.length > 0) {
        setSelectedSession(loaded[0]);
        setIsDrawerOpen(true);
      }
    }

    const handleCreated = () => {
      setSessions(getStoredSessions());
    };
    window.addEventListener('session-created', handleCreated);
    return () => window.removeEventListener('session-created', handleCreated);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this call session log?')) {
      const updated = deleteStoredSession(id);
      setSessions(updated);
      if (selectedSession?.id === id) {
        setIsDrawerOpen(false);
        setSelectedSession(null);
      }
    }
  };

  const handleOpenDetail = (session: CallSession) => {
    setSelectedSession(session);
    setIsDrawerOpen(true);
  };

  const toggleAudio = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.analysis.problemTitle &&
        s.analysis.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' || s.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPlatform =
      platformFilter === 'All' || s.platform.toLowerCase() === platformFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPlatform;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Call Sessions</h1>
            <span className="rounded-full bg-[#0052cc]/10 border border-[#0052cc]/20 px-2.5 py-0.5 text-xs font-semibold text-[#0052cc]">
              {sessions.length} Recorded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse past interview audio recordings, live transcripts, and Gemini code fixes.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center rounded-xl bg-white border border-slate-200 p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('table')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'table'
                  ? 'bg-[#0052cc] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'grid'
                  ? 'bg-[#0052cc] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ZeroPrep Metrics Overview Grid */}
      <MetricCards sessions={sessions} />

      {/* Filter and Search Bar Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by session title, topic, platform..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0052cc] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Platform Filter Dropdown */}
          <div className="relative">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-xs text-slate-700 focus:border-[#0052cc] focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Platforms</option>
              <option value="Google Meet">Google Meet</option>
              <option value="Zoom">Zoom</option>
              <option value="Microsoft Teams">Microsoft Teams</option>
              <option value="HackerRank">HackerRank</option>
              <option value="LeetCode">LeetCode</option>
            </select>
          </div>
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 mr-1 flex items-center gap-1 font-medium">
            <Filter className="h-3 w-3" /> Status:
          </span>
          {['All', 'Completed', 'Live', 'Saved'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === status
                  ? 'bg-[#0052cc] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Table View */}
      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-4">Session Title</th>
                  <th scope="col" className="px-4 py-3.5">Platform</th>
                  <th scope="col" className="px-4 py-3.5">Date & Time</th>
                  <th scope="col" className="px-4 py-3.5">Duration</th>
                  <th scope="col" className="px-4 py-3.5">Transcripts</th>
                  <th scope="col" className="px-4 py-3.5">Status</th>
                  <th scope="col" className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No call sessions match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((s) => {
                    const isAudioPlaying = playingAudioId === s.id;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => handleOpenDetail(s)}
                        className="cursor-pointer transition-colors duration-150 hover:bg-slate-50 group"
                      >
                        {/* Title & Preview */}
                        <td className="py-4 pl-6 pr-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => toggleAudio(s.id, e)}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                isAudioPlaying
                                  ? 'bg-[#0052cc] border-[#0052cc] text-white animate-pulse'
                                  : 'border-slate-200 bg-slate-50 text-slate-500 group-hover:text-[#0052cc] group-hover:border-[#0052cc]/50 group-hover:bg-white'
                              }`}
                              title={isAudioPlaying ? 'Pause Audio' : 'Preview Audio Recording'}
                            >
                              {isAudioPlaying ? (
                                <Pause className="h-3.5 w-3.5" />
                              ) : (
                                <Play className="h-3.5 w-3.5 ml-0.5" />
                              )}
                            </button>
                            <div>
                              <div className="font-semibold text-slate-900 group-hover:text-[#0052cc] transition-colors">
                                {s.title}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                                <span>{s.analysis.problemTitle || 'General Technical Screen'}</span>
                                {s.analysis.timeComplexity && (
                                  <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-mono font-semibold text-emerald-700 border border-slate-200">
                                    {s.analysis.timeComplexity}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Platform Badge */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold border ${
                              s.platform === 'Google Meet'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : s.platform === 'Zoom'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : s.platform === 'HackerRank'
                                ? 'bg-teal-50 text-teal-700 border-teal-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}
                          >
                            {s.platform}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-4 whitespace-nowrap text-slate-500 text-xs">
                          {s.date}
                        </td>

                        {/* Duration */}
                        <td className="px-4 py-4 whitespace-nowrap text-slate-800 font-mono text-xs font-medium">
                          {s.duration}
                        </td>

                        {/* Transcripts Count */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                            <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                            <span>{s.transcripts.length || s.transcriptCount} lines</span>
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                              s.status === 'Live'
                                ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                                : s.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                s.status === 'Live'
                                  ? 'bg-red-500 animate-ping'
                                  : s.status === 'Completed'
                                  ? 'bg-emerald-500'
                                  : 'bg-blue-500'
                              }`}
                            />
                            {s.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(s);
                              }}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-[#0052cc] hover:text-white transition"
                              title="View Session Log"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(s.id, e)}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                              title="Delete Session"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((s) => (
            <div
              key={s.id}
              onClick={() => handleOpenDetail(s)}
              className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 hover:border-[#0052cc]/50 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border ${
                    s.platform === 'Google Meet'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : s.platform === 'Zoom'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}
                >
                  {s.platform}
                </span>

                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                    s.status === 'Live'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0052cc] transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {s.analysis.bugError || s.analysis.optimalApproach}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="h-3 w-3" /> {s.duration}
                </span>
                <span className="text-emerald-700 font-mono font-semibold text-[11px]">
                  {s.latencyMs}ms AI
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session Detail Drawer */}
      <SessionDetailDrawer
        session={selectedSession}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedSession(null);
        }}
      />
    </div>
  );
}
