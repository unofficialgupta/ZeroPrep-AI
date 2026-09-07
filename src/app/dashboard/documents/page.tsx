'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DocumentItem {
  id: string;
  name: string;
  type: 'Resume' | 'Cheat Sheet' | 'Behavioral STAR' | 'System Design';
  updatedAt: string;
  size: string;
}

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Candidate_Resume_Senior_SWE_2025.pdf',
    type: 'Resume',
    updatedAt: '2 days ago',
    size: '240 KB',
  },
  {
    id: 'doc-2',
    name: 'STAR_Stories_Leadership_Failures_Conflicts.md',
    type: 'Behavioral STAR',
    updatedAt: 'Yesterday',
    size: '18 KB',
  },
  {
    id: 'doc-3',
    name: 'Distributed_Systems_Cheat_Sheet_Raft_Kafka.md',
    type: 'System Design',
    updatedAt: 'Aug 28, 2024',
    size: '42 KB',
  },
];

const STORAGE_KEY = 'zeroprep_documents';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(DEFAULT_DOCUMENTS);
  const [uploadToast, setUploadToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDocuments(JSON.parse(stored));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DOCUMENTS));
      }
    } catch (e) {
      console.warn('Storage read restricted:', e);
    }
  }, []);

  const saveDocuments = (items: DocumentItem[]) => {
    setDocuments(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Storage write restricted:', e);
    }
  };

  const handleDelete = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    saveDocuments(updated);
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Determine type
    const lower = file.name.toLowerCase();
    let type: DocumentItem['type'] = 'Cheat Sheet';
    if (lower.includes('resume') || lower.includes('cv')) {
      type = 'Resume';
    } else if (lower.includes('star') || lower.includes('behavioral')) {
      type = 'Behavioral STAR';
    } else if (lower.includes('system') || lower.includes('design') || lower.includes('arch')) {
      type = 'System Design';
    }

    // Format size
    const sizeKB = Math.max(1, Math.round(file.size / 1024));
    const sizeStr = sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type,
      updatedAt: 'Just now',
      size: sizeStr,
    };

    const updated = [newDoc, ...documents];
    saveDocuments(updated);
    setUploadToast(`"${file.name}" uploaded & injected into Gemini context!`);
    setTimeout(() => setUploadToast(null), 4000);

    // Reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hidden file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Documents & Resumes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload your resume and interview cheat sheets. Gemini uses these to tailor talking points and behavioral answers.
          </p>
        </div>

        <button
          onClick={handleTriggerUpload}
          className="flex items-center gap-2 rounded-xl bg-[#0052cc] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#0052cc]/25 hover:bg-[#0043a8] active:scale-95 transition cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {uploadToast && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-800 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{uploadToast}</span>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white space-y-3">
          <FileText className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">No documents uploaded yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload your resume or cheat sheets so ZeroPrep AI can craft answers aligned with your experience.
          </p>
          <button
            onClick={handleTriggerUpload}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0052cc] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#0052cc]/25 hover:bg-[#0043a8] transition cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Select File</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs hover:border-[#0052cc]/50 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052cc]/10 border border-[#0052cc]/25 text-[#0052cc]">
                  <FileText className="h-5 w-5" />
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  title="Remove document"
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 truncate" title={doc.name}>
                  {doc.name}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 font-semibold border border-slate-200">
                    {doc.type}
                  </span>
                  <span>•</span>
                  <span>{doc.size}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Updated {doc.updatedAt}</span>
                <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Injected
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
