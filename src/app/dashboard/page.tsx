'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Archive {
  id: string;
  code: string;
  title: string;
  category: string;
  uploadDate: string;
}

export default function DashboardPage() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Menarik data dari gudang arsip (Database Asli)
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch('http://localhost:3001/archives');
        const data = await response.json();
        setArchives(data);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArchives();
  }, []);

  // 2. Mesin Kalkulasi Statistik Otomatis
  const totalArsip = archives.length;
  const aktif = archives.filter(a => a.category.toLowerCase() === 'aktif').length;
  const inaktif = archives.filter(a => a.category.toLowerCase() === 'inaktif').length;
  const vital = archives.filter(a => a.category.toLowerCase() === 'vital').length;

  // 3. Menyiapkan Data untuk Grafik
  const chartDataMap: Record<string, number> = {};
  archives.forEach(archive => {
    // Memotong kode (Misal: SKP.01.01 menjadi SKP saja)
    const baseCode = archive.code.split('.')[0]; 
    chartDataMap[baseCode] = (chartDataMap[baseCode] || 0) + 1;
  });

  const chartData = Object.keys(chartDataMap).map(key => ({
    name: key,
    jumlah: chartDataMap[key]
  }));

  // 4. Mengambil 5 arsip terbaru untuk tabel ringkasan
  const recentArchives = [...archives]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 5);

  // Palet warna estetis untuk ikon aktivitas (bergantian otomatis)
  const badgeColors = ['bg-[#411b99]', 'bg-[#0a8270]', 'bg-[#eb3434]', 'bg-[#ffe227] text-black', 'bg-[#2358d8]'];

  // Layar Loading Premium
  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center p-8">
        <div className="text-center text-[#ffe227] animate-pulse font-serif text-2xl italic tracking-widest">
          Mengsinkronisasi Pangkalan Data...
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-200 font-sans min-h-full">
      
      {/* HEADER DASHBOARD */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-2">
          Dashboard <span className="italic text-[#eb3434]">Sistem.</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
          Ringkasan Statistik & Analitik Real-Time
        </p>
      </div>

      {/* KARTU STATISTIK (GAYA MAP ARSIP RETRO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        
        {/* Card 1: Merah (Total) */}
        <div className="bg-[#eb3434] rounded-[2rem] p-8 relative overflow-hidden shadow-[0_10px_30px_rgba(235,52,52,0.3)] hover:-translate-y-2 transition-transform duration-300">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <p className="text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Total Arsip</p>
          <h2 className="text-7xl font-serif italic text-white leading-none">{totalArsip}</h2>
        </div>

        {/* Card 2: Hijau Teal (Aktif) */}
        <div className="bg-[#0a8270] rounded-[2rem] p-8 relative overflow-hidden shadow-[0_10px_30px_rgba(10,130,112,0.3)] hover:-translate-y-2 transition-transform duration-300">
          <p className="text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Arsip Aktif</p>
          <h2 className="text-7xl font-serif italic text-white leading-none">{aktif}</h2>
        </div>

        {/* Card 3: Ungu Tua (Inaktif) */}
        <div className="bg-[#411b99] rounded-[2rem] p-8 relative overflow-hidden shadow-[0_10px_30px_rgba(65,27,153,0.3)] hover:-translate-y-2 transition-transform duration-300">
          <p className="text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Arsip Inaktif</p>
          <h2 className="text-7xl font-serif italic text-white leading-none">{inaktif}</h2>
        </div>

        {/* Card 4: Kuning (Vital) */}
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
                const baseCode = archive.code.split('.')[0];
                const colorClass = badgeColors[index % badgeColors.length]; // Warna bergantian

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

          <button className="w-full mt-6 py-4 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] transition-all">
            Lihat Daftar Arsip 
          </button>
        </div>

      </div>
    </div>
  );
}