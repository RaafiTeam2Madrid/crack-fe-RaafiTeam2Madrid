'use client';

import { useEffect, useState } from 'react';

interface DisposalItem {
  id: string;
  code: string;
  title: string;
  statusJRA: string;
  action: string;
  inactiveDate: string;
  finalDate: string;
}

export default function DisposalPage() {
  const [items, setItems] = useState<DisposalItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDisposal = async () => {
    try {
      const res = await fetch('http://localhost:3001/archives/disposal');
      const data = await res.json();
      setItems(data.filter((i: any) => i.statusJRA !== 'Masih Aktif'));
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchDisposal(); }, []);

  // KUNCI INTEGRASI: Fungsi ini dipertahankan utuh untuk menembak API Audit Log
  const handleExecute = async (item: DisposalItem) => {
    if (!confirm(`Konfirmasi tindakan ${item.action} untuk arsip: ${item.title}?`)) return;
    
    try {
      if (item.action === 'MUSNAHKAN') {
        // 1. Eksekusi pemusnahan di backend
        await fetch(`http://localhost:3001/archives/${item.id}`, { method: 'DELETE' });

        // 2. Catat ke Audit Log secara otomatis
        await fetch('http://localhost:3001/audit', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pengguna: 'Aditya Admin', 
            aksi: 'DESTROY_ARCHIVE',
            targetId: 'SYSTEM',
            detailAktivitas: `Mengeksekusi pemusnahan arsip: ${item.title} (${item.code})`
          })
        });
      } else if (item.action === 'PERMANENKAN' || item.action === 'DINILAI KEMBALI') {
        // Logika untuk mencatat jika arsip dipermanenkan
        await fetch('http://localhost:3001/audit', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pengguna: 'Aditya Admin', 
            aksi: 'RETAIN_ARCHIVE',
            targetId: 'SYSTEM',
            detailAktivitas: `Menetapkan status permanen/dinilai kembali untuk arsip: ${item.title} (${item.code})`
          })
        });
      }
      
      alert(`Tindakan ${item.action} berhasil dieksekusi dan dicatat di Audit Log.`);
      fetchDisposal();
    } catch (error) {
      console.error("Gagal mengeksekusi:", error);
      alert("Terjadi kesalahan saat mencatat ke Audit Log.");
    }
  };

  return (
    <div className="text-slate-200 font-sans min-h-full">
      
      {/* HEADER PENYUSUTAN */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-2">
          Pusat <span className="italic text-[#eb3434]">Penyusutan Arsip.</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
          Eksekusi Jadwal Retensi Arsip (JRA)
        </p>
      </div>

      {/* KONTAINER UTAMA (Glassmorphism Gelap) */}
      <div className="bg-[#1a1a1a] rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* Ornamen Latar Belakang Peringatan */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#eb3434]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10">
          {loading ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl italic tracking-widest text-[#eb3434] animate-pulse">Menghitung batas retensi dokumen...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="p-20 border border-dashed border-white/10 rounded-[3rem] text-center bg-[#111111]">
              <span className="text-4xl block mb-4 opacity-50">🛡️</span>
              <p className="text-slate-500 font-mono font-bold uppercase tracking-widest text-xs">Semua arsip masih dalam masa retensi aman.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {items.map((item) => {
                const isMusnah = item.action === 'MUSNAHKAN';
                
                // Menghindari error "Invalid Date" jika datanya kosong/salah format
                const finalDateObj = new Date(item.finalDate);
                const displayDate = isNaN(finalDateObj.getTime()) 
                  ? 'Format Tanggal Invalid' 
                  : finalDateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

                return (
                  <div key={item.id} className={`p-6 md:p-8 rounded-[2rem] border flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all shadow-xl group relative overflow-hidden ${
                    isMusnah ? 'bg-[#111111] border-red-900/30 hover:border-red-500/50' : 'bg-[#111111] border-yellow-900/30 hover:border-yellow-500/50'
                  }`}>
                    
                    {/* Aksen cahaya tipis di pinggir card saat di-hover */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none ${
                      isMusnah ? 'bg-gradient-to-r from-[#eb3434] to-transparent' : 'bg-gradient-to-r from-[#ffe227] to-transparent'
                    }`}></div>

                    {/* INFO ARSIP */}
                    <div className="flex gap-6 items-center relative z-10 w-full md:w-auto">
                      {/* Ikon Map Kode */}
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-sm shadow-lg flex-shrink-0 ${
                        isMusnah ? 'bg-[#eb3434] text-white shadow-red-900/50' : 'bg-[#ffe227] text-black shadow-yellow-900/50'
                      }`}>
                        {item.code.split('.')[0]}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white tracking-tight truncate">{item.title}</h3>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                            Status: <span className={isMusnah ? 'text-rose-400' : 'text-amber-400'}>{item.statusJRA}</span>
                          </p>
                          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                            Nasib: <span className="text-white">{item.action}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* AKSI & TANGGAL */}
                    <div className="flex items-center justify-between md:justify-end gap-8 relative z-10 border-t border-white/5 md:border-0 pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Batas Akhir</p>
                        <p className="text-xs font-mono font-bold text-slate-300">{displayDate}</p>
                      </div>
                      
                      <button 
                        onClick={() => handleExecute(item)}
                        className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg hover:-translate-y-1 ${
                          isMusnah 
                            ? 'bg-[#eb3434] text-white hover:bg-red-700 shadow-red-900/20' 
                            : 'bg-[#ffe227] text-black hover:bg-yellow-400 shadow-yellow-900/20'
                        }`}
                      >
                        Eksekusi {item.action}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}