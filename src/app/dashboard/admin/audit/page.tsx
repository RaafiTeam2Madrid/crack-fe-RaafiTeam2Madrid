'use client';

import { useEffect, useState } from 'react';

interface AuditEntry {
  id: string;
  action: string;
  performedBy: string;
  targetId: string;
  details: string;
  createdAt: string;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:3001/audit-logs');
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Gagal mengambil data audit:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Fungsi cerdas untuk mewarnai badge AKSI dalam mode gelap
  const getActionStyle = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('DELETE') || act.includes('DESTROY')) return 'bg-[#eb3434]/10 text-[#eb3434] border-[#eb3434]/30 shadow-red-900/20';
    if (act.includes('CREATE') || act.includes('UPLOAD')) return 'bg-[#0a8270]/10 text-[#0a8270] border-[#0a8270]/30 shadow-teal-900/20';
    if (act.includes('UPDATE') || act.includes('RETAIN')) return 'bg-[#2358d8]/10 text-[#2358d8] border-[#2358d8]/30 shadow-blue-900/20';
    if (act.includes('LOGIN')) return 'bg-[#ffe227]/10 text-[#ffe227] border-[#ffe227]/30 shadow-yellow-900/20';
    return 'bg-[#411b99]/10 text-[#411b99] border-[#411b99]/30 shadow-purple-900/20';
  };

  return (
    <div className="text-slate-200 font-sans min-h-full">
      
      {/* HEADER AUDIT LOG */}
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-2">
            Audit <span className="italic text-[#ffe227]">Log Sistem.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
            Rekam Jejak Aktivitas & Integritas Data (ISO 15489)
          </p>
        </div>
        
        {/* Filter Aksi (Gaya Gelap) */}
        <div className="flex items-center gap-4 bg-[#1a1a1a] p-2 pr-4 rounded-2xl border border-white/10 shadow-inner">
          <div className="bg-[#111111] px-4 py-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Filter</span>
          </div>
          <select 
            className="bg-transparent text-white font-mono text-sm outline-none cursor-pointer appearance-none pr-8"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="ALL" className="bg-[#111111]">SEMUA AKTIVITAS</option>
            <option value="CREATE" className="bg-[#111111]">CREATE / UPLOAD</option>
            <option value="DELETE" className="bg-[#111111]">DELETE / DESTROY</option>
            <option value="LOGIN" className="bg-[#111111]">LOGIN</option>
          </select>
        </div>
      </div>

      {/* KONTAINER DAFTAR LOG (Glassmorphism Gelap) */}
      <div className="bg-[#1a1a1a] rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* Ornamen Latar Belakang Keamanan */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#111111] opacity-50 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col">
          
          {loading ? (
            <div className="py-20 text-center">
              <p className="font-serif text-xl italic tracking-widest text-[#ffe227] animate-pulse">Menghubungkan ke pusat log UI...</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Header Kolom (Desktop Only) */}
              <div className="hidden md:grid grid-cols-12 gap-6 px-6 pb-4 border-b border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                <div className="col-span-2">Waktu (Timestamp)</div>
                <div className="col-span-3">Pengguna</div>
                <div className="col-span-2 text-center">Tindakan (Aksi)</div>
                <div className="col-span-2 text-center">Target ID</div>
                <div className="col-span-3">Detail Aktivitas</div>
              </div>

              {/* Daftar Log */}
              {logs.length === 0 ? (
                <div className="text-center py-20 bg-[#111111] rounded-3xl border border-dashed border-white/10">
                  <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Belum ada aktivitas terekam.</p>
                </div>
              ) : (
                logs
                  .filter(log => filterAction === 'ALL' || log.action.toUpperCase().includes(filterAction))
                  .map((log) => (
                    <div 
                      key={log.id} 
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center p-6 bg-[#111111] border border-white/5 rounded-2xl hover:border-white/20 transition-all shadow-inner group"
                    >
                      
                      {/* Waktu Timestamp (Gaya Terminal) */}
                      <div className="md:col-span-2 flex flex-col">
                        <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider group-hover:text-white transition-colors">
                          {new Date(log.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: '2-digit' })}
                        </span>
                        <span className="text-slate-600 font-mono text-[10px] mt-0.5">
                          {new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>

                      {/* Info Pengguna */}
                      <div className="md:col-span-3">
                        <div className="font-bold text-white text-sm truncate">{log.performedBy}</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Otorisasi Sistem</div>
                      </div>

                      {/* Badge Aksi */}
                      <div className="md:col-span-2 flex md:justify-center">
                        <span className={`px-4 py-1.5 rounded-md text-[9px] font-black italic tracking-[0.2em] border shadow-sm ${getActionStyle(log.action)}`}>
                          {log.action}
                        </span>
                      </div>

                      {/* Target ID */}
                      <div className="md:col-span-2 flex md:justify-center">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-400 font-mono text-[10px] uppercase tracking-widest">
                          {log.targetId || 'SYSTEM'}
                        </span>
                      </div>

                      {/* Detail Aktivitas */}
                      <div className="md:col-span-3">
                        <p className="text-slate-400 text-xs font-mono leading-relaxed line-clamp-2 group-hover:text-slate-300 transition-colors">
                          {log.details}
                        </p>
                      </div>

                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}