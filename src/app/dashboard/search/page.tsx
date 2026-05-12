'use client';

import { useState, useEffect } from 'react';

interface Archive {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  uploadDate: string;
  isLegalHold?: boolean;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [results, setResults] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('STAFF');

  // Ambil Role User dari Cookie (untuk proteksi arsip Vital)
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    const roleFromCookie = getCookie('userRole');
    if (roleFromCookie) setUserRole(roleFromCookie.toUpperCase());

    // Jalankan pencarian awal (tanpa filter) saat halaman pertama dibuka
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/archives/search`;
      const params = new URLSearchParams();
      
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (category !== 'ALL') params.append('category', category);

      // Jika ada parameter, gunakan endpoint search. Jika tidak, ambil semua.
      if (params.toString()) {
        url += `?${params.toString()}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/archives`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        // Urutkan dari yang paling baru diupload
        const sortedData = data.sort((a: any, b: any) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        setResults(sortedData);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDocument = (fileUrl: string) => {
    if (!fileUrl) {
      alert('Maaf, file PDF tidak ditemukan pada arsip ini.');
      return;
    }
    const fileLink = fileUrl.startsWith('http') 
      ? fileUrl 
      : `${process.env.NEXT_PUBLIC_API_URL}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
    window.open(fileLink, '_blank');
  };

  // Proteksi Frontend: Sembunyikan arsip VITAL dari akun STAFF
  const visibleResults = results.filter(archive => {
    if (userRole === 'STAFF' && archive.category?.toUpperCase() === 'VITAL') return false;
    return true;
  });

  const getCategoryBadge = (cat: string, isLegalHold?: boolean) => {
    if (isLegalHold) return 'bg-[#2358d8]/20 text-[#60a5fa] border-[#2358d8]/50 shadow-[0_0_10px_rgba(35,88,216,0.3)]';
    const c = (cat || '').toUpperCase();
    if (c === 'AKTIF') return 'bg-[#0a8270]/20 text-[#0a8270] border-[#0a8270]/50';
    if (c === 'INAKTIF') return 'bg-[#ffe227]/20 text-[#ffe227] border-[#ffe227]/50';
    if (c === 'VITAL') return 'bg-[#eb3434]/20 text-[#eb3434] border-[#eb3434]/50';
    return 'bg-slate-800 text-slate-300 border-slate-600';
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* HEADER */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-4xl font-serif text-white tracking-tight mb-2">
          Pencarian <span className="italic text-[#ffe227]">Terpadu.</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
          Temukan Rekod Berdasarkan Metadata
        </p>
      </div>

      {/* KOTAK PENCARIAN (SEARCH BOX) */}
      <form onSubmit={handleSearch} className="bg-[#1a1a1a] rounded-[2rem] p-6 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffe227]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          {/* Input Text */}
          <div className="flex-1 relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-slate-500">🔍</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul dokumen atau kode klasifikasi..." 
              className="w-full bg-[#111111] border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl focus:outline-none focus:border-[#ffe227] focus:ring-1 focus:ring-[#ffe227] transition-all font-mono text-sm placeholder:text-slate-600 placeholder:font-sans"
            />
          </div>

          {/* Dropdown Kategori */}
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#111111] border border-white/5 text-white px-8 py-5 rounded-2xl focus:outline-none focus:border-[#ffe227] focus:ring-1 focus:ring-[#ffe227] transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="AKTIF">Arsip Aktif</option>
            <option value="INAKTIF">Arsip Inaktif</option>
            <option value="VITAL">Arsip Vital</option>
          </select>

          {/* Tombol Cari */}
          <button 
            type="submit" 
            className="px-10 py-5 bg-[#ffe227] hover:bg-yellow-400 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,226,39,0.2)] hover:-translate-y-1 whitespace-nowrap"
          >
            Cari Berkas
          </button>
        </div>
      </form>

      {/* AREA HASIL PENCARIAN */}
      <div className="bg-[#1a1a1a] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative">
        <div className="h-1 w-full bg-gradient-to-r from-[#ffe227] via-[#111111] to-[#ffe227] opacity-50"></div>
        
        {loading ? (
          <div className="p-20 text-center text-[#ffe227] font-mono text-xs uppercase tracking-widest animate-pulse">
            Menyisir Pangkalan Data...
          </div>
        ) : visibleResults.length === 0 ? (
          // STATE KOSONG (EMPTY STATE) - Persis seperti Screenshotmu!
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <span className="text-5xl mb-6 drop-shadow-2xl">📭</span>
            <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">
              Tidak ada arsip yang cocok dengan kata kunci.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111111] border-b border-white/5">
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Konteks Arsip</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategori</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tanggal Registrasi</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visibleResults.map((archive) => (
                  <tr key={archive.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#ffe227]/10 border border-[#ffe227]/30 flex items-center justify-center text-[#ffe227] font-bold text-xs shadow-inner">
                          {archive.code?.split('.')[0] || '-'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {archive.isLegalHold && <span title="Dibekukan secara Hukum">❄️</span>}
                            <p className="text-white font-semibold text-sm">{archive.title}</p>
                          </div>
                          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">
                            KODE: {archive.code || 'TIDAK ADA'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getCategoryBadge(archive.category, archive.isLegalHold)}`}>
                        {archive.isLegalHold ? 'LEGAL HOLD' : archive.category || 'AKTIF'}
                      </span>
                    </td>
                    <td className="p-6 font-mono text-xs text-slate-400">
                      {new Date(archive.uploadDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-6 text-right">
                      {/* Kalau Staf, mereka hanya bisa melihat jika diizinkan (atau diarahkan ke halaman daftar arsip). 
                          Untuk mempermudah demo, kita buat tombol buka langsung, 
                          atau Admin bisa membukanya. */}
                      <button 
                        onClick={() => handleOpenDocument(archive.fileUrl)}
                        className="px-5 py-2 bg-transparent border border-[#ffe227]/50 text-[#ffe227] hover:bg-[#ffe227] hover:text-black rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        Lihat Berkas
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}