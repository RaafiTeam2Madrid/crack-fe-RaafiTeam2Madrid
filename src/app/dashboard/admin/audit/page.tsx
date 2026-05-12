'use client';

import { useState, useEffect } from 'react';

// Sesuaikan interface murni dengan Entity database TypeORM
interface AuditLog {
  id: string;
  createdAt: string; 
  performedBy: string;
  action: string;
  targetId: string;
  details: string;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/audit-logs`);
      if (response.ok) {
        const data = await response.json();
        const sortedData = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLogs(sortedData);
      }
    } catch (error) {
      console.error('Gagal mengambil audit log riil:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.performedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.targetId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionBadge = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'CREATE': return 'bg-[#0a8270]/20 text-[#0a8270] border-[#0a8270]/50';
      case 'DELETE': return 'bg-[#eb3434]/20 text-[#eb3434] border-[#eb3434]/50 shadow-[0_0_10px_rgba(235,52,52,0.4)]';
      case 'UPDATE': return 'bg-[#ffe227]/20 text-[#ffe227] border-[#ffe227]/50';
      case 'LOGIN': return 'bg-[#2358d8]/20 text-[#2358d8] border-[#2358d8]/50';
      case 'LOGOUT': return 'bg-slate-700/20 text-slate-400 border-slate-600/50';
      default: return 'bg-slate-800 text-slate-300 border-slate-600';
    }
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return { time: '-', date: '-' };
    const dateObj = new Date(isoString);
    return {
      time: dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    };
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Audit Log <span className="italic text-[#ffe227]">Sistem.</span></h1>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">Rekam Jejak Aktivitas Terhubung Database</p>
        </div>
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Cari aktor, tindakan, atau detail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-[#ffe227] focus:ring-1 focus:ring-[#ffe227] transition-all font-mono text-xs placeholder:text-slate-600"
          />
          <span className="absolute right-4 top-3.5 text-slate-500 text-sm">🔍</span>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl relative">
        <div className="h-1 w-full bg-gradient-to-r from-[#ffe227] via-[#111111] to-[#ffe227] opacity-50"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111111] border-b border-white/5">
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Waktu & Tanggal</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identitas Aktor</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tindakan</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID Target</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Detail Peristiwa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">Sinkronisasi Pangkalan Data...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">Tidak ada jejak yang terekam.</td></tr>
              ) : (
                filteredLogs.map((log) => {
                  const { time, date } = formatTime(log.createdAt);
                  return (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-6">
                        <p className="font-mono text-xs text-white/80 font-bold">{time}</p>
                        <p className="text-slate-500 text-[9px] font-mono uppercase tracking-widest mt-1">{date}</p>
                      </td>
                      <td className="p-6">
                        <p className="text-white font-semibold text-sm">{log.performedBy}</p>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getActionBadge(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-6 font-mono text-xs text-slate-300">{log.targetId || '-'}</td>
                      <td className="p-6 text-slate-400 text-xs font-mono leading-relaxed group-hover:text-white transition-colors">{log.details}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}