'use client';

import { useState, useEffect } from 'react';

interface RequestData {
  id: string;
  archiveId: string;
  archiveTitle: string;
  staffName: string;
  reason: string;
  status: string;
  requestDate: string;
}

export default function AccessApprovalPage() {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/access-requests`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data permintaan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Panggil data saat halaman pertama dibuka
    fetchRequests();

    // 2. FITUR BARU: Polling (Auto-refresh) setiap 5 detik
    const interval = setInterval(() => {
      fetchRequests();
    }, 5000);

    // Bersihkan interval saat pindah halaman agar tidak bocor memorinya
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/access-requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });

      if (res.ok) {
        // Update tampilan langsung tanpa refresh
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
      }
    } catch (error) {
      alert('Gagal mengeksekusi tindakan.');
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="border-b border-white/5 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">
            Otorisasi <span className="italic text-[#f59e0b]">Akses.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
            Persetujuan Permintaan Dokumen Terbatas
          </p>
        </div>
        
        {/* Indikator Real-time (Kosmetik visual agar terlihat canggih) */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse shadow-[0_0_8px_#f59e0b]"></span>
          <span className="text-[#f59e0b] text-[8px] font-black uppercase tracking-widest">Live Sync</span>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative">
        <div className="h-1 w-full bg-gradient-to-r from-[#f59e0b] via-[#111111] to-[#f59e0b] opacity-50"></div>
        
        <div className="p-8">
          {loading ? (
            <p className="text-center text-slate-500 text-xs font-mono uppercase">Memuat antrean...</p>
          ) : requests.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-4xl block mb-4">🛡️</span>
              <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Belum ada permintaan akses dokumen.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className="p-6 bg-[#111111] border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 hover:border-white/20 transition-all">
                  
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-slate-800 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase shadow-inner">
                        Dari: {req.staffName}
                      </span>
                      <span className="text-slate-400 text-xs font-mono">
                        {new Date(req.requestDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">{req.archiveTitle}</h3>
                    <p className="text-slate-500 text-[11px] italic">" {req.reason} "</p>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    {req.status === 'PENDING' ? (
                      <>
                        <button onClick={() => handleAction(req.id, 'APPROVED')} className="px-5 py-2 bg-[#0a8270] hover:bg-teal-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(10,130,112,0.2)]">
                          Setujui
                        </button>
                        <button onClick={() => handleAction(req.id, 'REJECTED')} className="px-5 py-2 bg-[#eb3434] hover:bg-red-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(235,52,52,0.2)]">
                          Tolak
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        req.status === 'APPROVED' ? 'bg-[#0a8270]/20 text-[#0a8270] border-[#0a8270]/50' : 
                        req.status === 'USED' ? 'bg-slate-800 text-slate-400 border-slate-600' : 
                        'bg-[#eb3434]/20 text-[#eb3434] border-[#eb3434]/50'
                      }`}>
                        {req.status === 'APPROVED' ? 'DIIZINKAN' : req.status === 'USED' ? 'TELAH DIPAKAI' : 'DITOLAK'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}