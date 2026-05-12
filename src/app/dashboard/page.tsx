'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

interface Archive {
  id: string;
  code: string;
  title: string;
  category: string;
  uploadDate: string;
}

interface AccessRequest {
  id: string;
  archiveId: string;
  archiveTitle: string;
  staffName: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'USED';
  requestDate: string;
}

export default function DashboardPage() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [userRole, setUserRole] = useState<string>('STAFF');
  const [userName, setUserName] = useState<string>('Akun Staf');

  // 1. Menarik data dari gudang arsip dan akses
  useEffect(() => {
    // Ambil sesi user dari Cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    
    const roleFromCookie = getCookie('userRole');
    const nameFromCookie = getCookie('userName');
    
    if (roleFromCookie) setUserRole(roleFromCookie.toUpperCase());
    if (nameFromCookie) setUserName(decodeURIComponent(nameFromCookie));

    const fetchData = async () => {
      try {
        const [resArchives, resRequests] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/archives`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/access-requests`)
        ]);

        if (resArchives.ok) setArchives(await resArchives.json());
        if (resRequests.ok) setAccessRequests(await resRequests.json());
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Mesin Kalkulasi Statistik Admin (Tetap menggunakan kodemu)
  const totalArsip = archives.length;
  const aktif = archives.filter(a => (a.category || '').toLowerCase() === 'aktif').length;
  const inaktif = archives.filter(a => (a.category || '').toLowerCase() === 'inaktif').length;
  const vital = archives.filter(a => (a.category || '').toLowerCase() === 'vital').length;

  const pendingRequestsAdmin = accessRequests.filter(req => req.status === 'PENDING');

  // 3. Menyiapkan Data untuk Grafik (Tetap menggunakan kodemu)
  const chartDataMap: Record<string, number> = {};
  archives.forEach(archive => {
    const baseCode = (archive.code || 'NA').split('.')[0]; 
    chartDataMap[baseCode] = (chartDataMap[baseCode] || 0) + 1;
  });

  const chartData = Object.keys(chartDataMap).map(key => ({
    name: key,
    jumlah: chartDataMap[key]
  }));

  // 4. Mengambil 5 arsip terbaru
  const recentArchives = [...archives]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 5);

  const badgeColors = ['bg-[#411b99]', 'bg-[#0a8270]', 'bg-[#eb3434]', 'bg-[#ffe227] text-black', 'bg-[#2358d8]'];

  // Bantuan visual status untuk Staf
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="px-3 py-1 bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/50 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-max"><span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse"></span> MENUNGGU</span>;
      case 'APPROVED': return <span className="px-3 py-1 bg-[#0a8270]/20 text-[#0a8270] border border-[#0a8270]/50 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-max"><span className="w-1.5 h-1.5 rounded-full bg-[#0a8270]"></span> DISETUJUI</span>;
      case 'REJECTED': return <span className="px-3 py-1 bg-[#eb3434]/20 text-[#eb3434] border border-[#eb3434]/50 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-max"><span className="w-1.5 h-1.5 rounded-full bg-[#eb3434]"></span> DITOLAK</span>;
      case 'USED': return <span className="px-3 py-1 bg-slate-800 text-slate-400 border border-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-max"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> SELESAI DIGUNAKAN</span>;
      default: return null;
    }
  };

  // Layar Loading Premium (Tetap menggunakan kodemu)
  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center p-8">
        <div className="text-center text-[#ffe227] animate-pulse font-serif text-2xl italic tracking-widest">
          Mengsinkronisasi Pangkalan Data...
        </div>
      </div>
    );
  }

  // ==========================================
  // WAJAH 1: TAMPILAN KHUSUS STAF (END-USER)
  // ==========================================
  if (userRole === 'STAFF') {
    return (
      <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
        <div className="border-b border-white/5 pb-6">
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">
            Selamat Datang, <span className="italic text-[#f59e0b]">{userName}.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
            Portal Layanan Peminjaman Rekod Institusi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1a1a1a] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2358d8] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <h3 className="text-white font-bold mb-2">Eksplorasi Arsip</h3>
            <p className="text-slate-400 text-sm mb-6">Cari dan ajukan permohonan akses untuk dokumen yang Anda butuhkan.</p>
            <Link href="/dashboard/archives" className="inline-block px-6 py-3 bg-[#2358d8] hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/50 hover:-translate-y-1">
              Buka Katalog Arsip 
            </Link>
          </div>

          <div className="bg-[#1a1a1a] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
             <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-slate-400 text-[10px] font-black tracking-widest uppercase mb-1">Tiket Aktif Anda</h3>
                  <p className="text-4xl font-serif text-white">{accessRequests.filter(r => r.status === 'PENDING' || r.status === 'APPROVED').length}</p>
               </div>
               <div className="w-12 h-12 rounded-full bg-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b] text-xl">🎟️</div>
             </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative">
          <div className="h-1 w-full bg-gradient-to-r from-[#f59e0b] to-[#111111] opacity-50"></div>
          <div className="p-6 border-b border-white/5">
            <h2 className="text-white font-bold">Riwayat Pengajuan Akses Anda</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111111] border-b border-white/5">
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Dokumen</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Alasan Keperluan</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status Tiket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {accessRequests.length === 0 ? (
                  <tr><td colSpan={3} className="p-10 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">Belum ada riwayat pengajuan.</td></tr>
                ) : (
                  accessRequests.map(req => (
                    <tr key={req.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-6 font-semibold text-white text-sm">{req.archiveTitle}</td>
                      <td className="p-6 text-slate-400 text-xs italic">"{req.reason}"</td>
                      <td className="p-6">{getStatusBadge(req.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // WAJAH 2: TAMPILAN KHUSUS ADMIN (DESAIN ASLI)
  // ==========================================
  return (
    <div className="text-slate-200 font-sans min-h-full animate-[fadeIn_0.5s_ease-out]">
      
      {/* HEADER DASHBOARD */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-2">
          Dashboard <span className="italic text-[#eb3434]">Sistem.</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
          Ringkasan Statistik & Analitik Real-Time
        </p>
      </div>

      {/* NOTIFIKASI ADMIN */}
      {pendingRequestsAdmin.length > 0 && (
        <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between mb-8 animate-pulse">
           <div>
             <h3 className="text-[#f59e0b] font-bold mb-1 flex items-center gap-2">⚠️ Perhatian: Ada {pendingRequestsAdmin.length} Permintaan Akses Baru!</h3>
             <p className="text-slate-400 text-sm">Staf menunggu persetujuan Anda untuk membuka dokumen.</p>
           </div>
           <Link href="/dashboard/admin/access" className="mt-4 md:mt-0 px-5 py-2.5 bg-[#f59e0b] text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-colors">
             Tinjau Sekarang
           </Link>
        </div>
      )}

      {/* KARTU STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-[#eb3434] rounded-[2rem] p-8 relative overflow-hidden shadow-[0_10px_30px_rgba(235,52,52,0.3)] hover:-translate-y-2 transition-transform duration-300">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <p className="text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Total Arsip</p>
          <h2 className="text-7xl font-serif italic text-white leading-none">{totalArsip}</h2>
        </div>
        <div className="bg-[#0a8270] rounded-[2rem] p-8 relative overflow-hidden shadow-[0_10px_30px_rgba(10,130,112,0.3)] hover:-translate-y-2 transition-transform duration-300">
          <p className="text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Arsip Aktif</p>
          <h2 className="text-7xl font-serif italic text-white leading-none">{aktif}</h2>
        </div>
        <div className="bg-[#411b99] rounded-[2rem] p-8 relative overflow-hidden shadow-[0_10px_30px_rgba(65,27,153,0.3)] hover:-translate-y-2 transition-transform duration-300">
          <p className="text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Arsip Inaktif</p>
          <h2 className="text-7xl font-serif italic text-white leading-none">{inaktif}</h2>
        </div>
        <div className="bg-[#ffe227] rounded-[2rem] p-8 relative overflow-hidden shadow-[0_10px_30px_rgba(255,226,39,0.2)] hover:-translate-y-2 transition-transform duration-300">
          <p className="text-black/60 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Arsip Vital</p>
          <h2 className="text-7xl font-serif italic text-black leading-none">{vital}</h2>
        </div>
      </div>

      {/* AREA BAWAH: GRAFIK & AKTIVITAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Box Grafik */}
        <div className="lg:col-span-2 bg-[#1a1a1a] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#eb3434]/10 rounded-full blur-3xl pointer-events-none"></div>
          <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Distribusi Klasifikasi Arsip</p>
          
          {chartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', fontSize: '12px' }} 
                  />
                  <Bar dataKey="jumlah" fill="#ffe227" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-slate-500 text-sm font-mono uppercase tracking-widest">
              Belum ada data klasifikasi
            </div>
          )}
        </div>

        {/* Box Aktivitas Terbaru */}
        <div className="bg-[#1a1a1a] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl flex flex-col">
          <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Arsip Baru Diregistrasi</p>
          
          <div className="space-y-6 flex-1">
            {recentArchives.length === 0 ? (
              <div className="text-center text-slate-500 text-xs py-10 font-mono uppercase tracking-widest border-b border-white/5">
                Kosong
              </div>
            ) : (
              recentArchives.map((archive, index) => {
                const baseCode = (archive.code || 'NA').split('.')[0];
                const colorClass = badgeColors[index % badgeColors.length];

                return (
                  <div key={archive.id} className="flex gap-4 items-center border-b border-white/10 pb-5 last:border-0 last:pb-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs shadow-lg ${colorClass}`}>
                      {baseCode}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-white font-bold text-sm tracking-tight truncate">{archive.title}</p>
                      <p className="text-slate-500 text-[10px] font-mono mt-1 uppercase">
                        {new Date(archive.uploadDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <Link href="/dashboard/archives" className="w-full mt-6 py-4 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] transition-all text-center block">
            Lihat Daftar Arsip 
          </Link>
        </div>

      </div>
    </div>
  );
}