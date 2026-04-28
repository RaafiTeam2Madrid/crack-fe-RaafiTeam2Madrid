'use client';

import { useState, useEffect } from 'react';

interface Archive {
  id: string;
  code: string;
  title: string;
  category: string;
  fileUrl: string;
  uploadDate: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [results, setResults] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/archives/search?q=${query}&category=${category}`);
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error("Gagal mencari:", e);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan pencarian otomatis saat kategori berubah
  useEffect(() => {
    handleSearch();
  }, [category]);

  // Fungsi pintar untuk menentukan warna berdasarkan kategori arsip
  const getCategoryColor = (cat: string) => {
    const lowerCat = cat.toLowerCase();
    if (lowerCat === 'aktif') return 'bg-[#0a8270] shadow-teal-900/50'; // Hijau Teal
    if (lowerCat === 'inaktif') return 'bg-[#411b99] shadow-purple-900/50'; // Ungu Tua
    if (lowerCat === 'vital') return 'bg-[#eb3434] shadow-red-900/50'; // Merah
    return 'bg-[#2358d8] shadow-blue-900/50'; // Biru default
  };

  return (
    <div className="text-slate-200 font-sans min-h-full">
      
      {/* HEADER PENCARIAN */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-2">
          Pencarian <span className="italic text-[#ffe227]">Terpadu.</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
          Temukan Rekod Berdasarkan Metadata
        </p>
      </div>

      {/* --- KOTAK KENDALI PENCARIAN (Glassmorphism Gelap) --- */}
      <div className="bg-[#1a1a1a] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden mb-10">
        
        {/* Ornamen Cahaya Kuning */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ffe227]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          {/* Input Teks */}
          <div className="flex-1 relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-lg">🔍</span>
            <input 
              type="text" 
              placeholder="Cari berdasarkan judul dokumen atau kode klasifikasi..."
              className="w-full pl-14 pr-6 py-5 bg-[#111111] border border-slate-800 rounded-2xl focus:outline-none focus:border-[#ffe227] focus:ring-1 focus:ring-[#ffe227] font-mono text-sm text-white placeholder:text-slate-600 transition-all shadow-inner"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          {/* Dropdown Kategori */}
          <select 
            className="px-6 py-5 bg-[#111111] border border-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none focus:border-[#ffe227] cursor-pointer shadow-inner appearance-none min-w-[200px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Aktif">Arsip Aktif</option>
            <option value="Inaktif">Arsip Inaktif</option>
            <option value="Vital">Arsip Vital</option>
          </select>
          
          {/* Tombol Eksekusi */}
          <button 
            onClick={handleSearch}
            className="px-10 py-5 bg-[#ffe227] hover:bg-yellow-400 text-black font-black rounded-2xl transition-all shadow-lg shadow-yellow-500/10 uppercase tracking-[0.2em] text-xs hover:-translate-y-1"
          >
            Cari Berkas
          </button>
        </div>
      </div>

      {/* --- DAFTAR HASIL PENCARIAN --- */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20">
            <p className="font-serif text-xl italic tracking-widest text-[#ffe227] animate-pulse">Menelusuri brankas digital...</p>
          </div>
        ) : results.length > 0 ? (
          results.map((archive) => (
            <div key={archive.id} className="p-6 bg-[#1a1a1a] border border-white/5 rounded-[2rem] hover:border-white/20 transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              
              <div className="flex items-center gap-6 overflow-hidden w-full">
                {/* Ikon Map Berwarna Dinamis */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg flex-shrink-0 transition-transform group-hover:scale-105 ${getCategoryColor(archive.category)}`}>
                  {archive.code.split('.')[0]}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-lg truncate group-hover:text-[#ffe227] transition-colors">{archive.title}</h3>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">{archive.code}</span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{archive.category}</span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
                      {new Date(archive.uploadDate).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Lihat Berkas */}
              {archive.fileUrl && (
                <a 
                  href={`http://localhost:3001/uploads/${archive.fileUrl}`} 
                  target="_blank"
                  rel="noreferrer"
                  className="w-full md:w-auto text-center px-8 py-4 bg-[#111111] hover:bg-[#ffe227] hover:text-black text-slate-300 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all border border-slate-800 hover:border-[#ffe227] flex-shrink-0"
                >
                  Lihat File PDF
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-[#1a1a1a] rounded-[2.5rem] border border-dashed border-slate-800">
            <span className="text-4xl block mb-4">📭</span>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Tidak ada arsip yang cocok dengan kata kunci.</p>
          </div>
        )}
      </div>
    </div>
  );
}