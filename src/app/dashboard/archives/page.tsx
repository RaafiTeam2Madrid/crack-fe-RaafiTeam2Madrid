'use client';

import { useEffect, useState } from 'react';

interface Archive {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  uploadDate: string;
}

export default function ArchivesPage() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal Detail (Mesin Aslimu)
  const [selectedArchive, setSelectedArchive] = useState<Archive | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchArchives = async () => {
    try {
      const res = await fetch('http://localhost:3001/archives');
      const data = await res.json();
      setArchives(data);
    } catch (e) { 
      console.error("Gagal mengambil data:", e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchArchives(); }, []);

  const openDetail = (archive: Archive) => {
    setSelectedArchive(archive);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArchive(null);
  };

  // Fungsi pewarnaan cerdas untuk badge kategori
  const getCategoryBadge = (cat: string) => {
    const lowerCat = cat.toLowerCase();
    if (lowerCat === 'aktif') return 'text-[#0a8270] bg-[#0a8270]/10 border-[#0a8270]/20';
    if (lowerCat === 'inaktif') return 'text-[#411b99] bg-[#411b99]/10 border-[#411b99]/20';
    if (lowerCat === 'vital') return 'text-[#eb3434] bg-[#eb3434]/10 border-[#eb3434]/20';
    return 'text-slate-400 bg-white/5 border-white/10';
  };

  return (
    <div className="text-slate-200 font-sans min-h-full relative">
      
      {/* HEADER DAFTAR ARSIP */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-2">
            Daftar <span className="italic text-[#2358d8]">Arsip Digital.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
            Inventarisasi Rekod Terpusat
          </p>
        </div>
        <div className="px-6 py-3 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-inner flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Total Entri:</span>
          <span className="text-xl font-serif italic text-[#2358d8]">{archives.length}</span>
        </div>
      </div>

      {/* KONTAINER DAFTAR (Glassmorphism Gelap) */}
      <div className="bg-[#1a1a1a] rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* Ornamen Latar Belakang Biru */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-[#2358d8]/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Tabel Header Custom */}
        <div className="hidden md:grid grid-cols-12 gap-6 px-6 pb-6 border-b border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] relative z-10">
          <div className="col-span-2">Kode</div>
          <div className="col-span-5">Judul Arsip & Registrasi</div>
          <div className="col-span-3">Kategori</div>
          <div className="col-span-2 text-center">Aksi</div>
        </div>

        {/* Isi Daftar Arsip */}
        <div className="relative z-10 flex flex-col mt-4">
          {loading ? (
            <div className="py-20 text-center">
              <p className="font-serif text-xl italic tracking-widest text-[#2358d8] animate-pulse">Menarik entri terekoveri...</p>
            </div>
          ) : archives.length > 0 ? (
            archives.map((archive) => (
              <div 
                key={archive.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 border-b border-white/5 hover:bg-white/5 transition-colors rounded-2xl group"
              >
                {/* Kode Klasifikasi */}
                <div className="md:col-span-2 font-mono font-bold text-[#2358d8] text-sm tracking-widest">
                  {archive.code}
                </div>

                {/* Judul & Tanggal */}
                <div className="md:col-span-5 flex flex-col min-w-0">
                  <h3 className="font-bold text-white text-base truncate group-hover:text-[#2358d8] transition-colors">
                    {archive.title}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">
                    Reg: {new Date(archive.uploadDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Kategori Badge */}
                <div className="md:col-span-3">
                  <span className={`inline-block px-4 py-2 border rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${getCategoryBadge(archive.category)}`}>
                    {archive.category}
                  </span>
                </div>

                {/* Tombol Aksi (Membuka Modal) */}
                <div className="md:col-span-2 flex md:justify-center">
                  <button 
                    onClick={() => openDetail(archive)}
                    className="w-full md:w-auto px-8 py-3 bg-[#111111] hover:bg-[#2358d8] text-white font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all border border-slate-800 hover:border-[#2358d8] shadow-lg"
                  >
                    Detail
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <span className="text-4xl block mb-4 opacity-50">📂</span>
              <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Pangkalan Data Arsip Masih Kosong.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL DETAIL METADATA (TEMA GELAP PREMIUM) --- */}
      {isModalOpen && selectedArchive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          
          {/* Backdrop Blur Gelap */}
          <div className="absolute inset-0 bg-[#0b1120]/80 backdrop-blur-md" onClick={closeModal}></div>
          
          {/* Modal Card */}
          <div className="relative bg-[#1a1a1a] w-full max-w-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
            
            {/* Ornamen Modal */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#2358d8]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="p-10 relative z-10">
              <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-8">
                <div>
                  <h2 className="text-3xl font-serif italic text-white tracking-tight leading-tight">
                    Rincian <span className="text-[#2358d8]">Metadata.</span>
                  </h2>
                  <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em] mt-2">
                    ID Entri: {selectedArchive.id.slice(0, 12)}...
                  </p>
                </div>
                <button 
                  onClick={closeModal} 
                  className="w-12 h-12 bg-[#111111] border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-[#eb3434] hover:border-[#eb3434] transition-all"
                >
                  <span className="text-xl leading-none">×</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Judul Arsip</p>
                  <p className="text-lg font-bold text-white leading-tight">{selectedArchive.title}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Kode Klasifikasi</p>
                  <p className="text-lg font-mono font-bold text-[#2358d8]">{selectedArchive.code}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Kategori Arsip</p>
                  <span className={`inline-block mt-1 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${getCategoryBadge(selectedArchive.category)}`}>
                    {selectedArchive.category}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Waktu Registrasi</p>
                  <p className="text-sm font-mono text-slate-300">
                    {new Date(selectedArchive.uploadDate).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-10 p-6 bg-[#111111] rounded-2xl border border-white/5 shadow-inner">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deskripsi Lengkap</p>
                <p className="text-slate-400 text-sm leading-relaxed font-serif italic">
                  "{selectedArchive.description || 'Tidak ada deskripsi tambahan untuk entri rekod ini.'}"
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={closeModal}
                  className="flex-1 py-4 bg-[#111111] hover:bg-slate-800 border border-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all"
                >
                  Tutup Jendela
                </button>
                {selectedArchive.fileUrl && (
                  <a 
                    href={`http://localhost:3001/uploads/${selectedArchive.fileUrl}`} 
                    target="_blank"
                    rel="noreferrer"
                    className="flex-[2] py-4 bg-[#2358d8] hover:bg-[#1a4099] text-white font-black text-[10px] text-center uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-900/20 transition-all"
                  >
                    Buka Berkas PDF Terenkripsi ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}