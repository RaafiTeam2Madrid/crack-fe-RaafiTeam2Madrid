'use client';

import { useState } from 'react';

export default function CapturePage() {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Aktif');
  const [description, setDescription] = useState('');
  const [retentionDate, setRetentionDate] = useState(''); // <-- STATE BARU UNTUK TANGGAL RETENSI
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // 🚀 FUNGSI HELPER UNTUK MENGAMBIL TIKET DARI BRANKAS (COOKIES)
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  // Fungsi Helper untuk mengirim log
  const sendAuditLog = async (action: string, targetId: string, details: string) => {
    try {
      const token = getCookie('accessToken');
      const userName = getCookie('userName') ? decodeURIComponent(getCookie('userName') as string) : 'Admin';

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/audit-logs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // 👈 Menyelipkan tiket ke Satpam
        },
        body: JSON.stringify({
          action: action,
          performedBy: userName, // 👈 Sekarang namanya dinamis sesuai yang Login!
          targetId: targetId,
          details: details
        })
      });
    } catch (error) {
      console.error('Gagal mencatat audit log:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('code', code);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    
    // Pastikan tanggal retensi dikirim ke Backend jika diisi
    if (retentionDate) {
      formData.append('retentionDate', retentionDate); 
    }
    
    if (file) formData.append('file', file);

    try {
      const token = getCookie('accessToken');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/archives`, {
        method: 'POST',
        headers: {
          // Catatan: Jangan set Content-Type secara manual saat mengirim FormData, 
          // browser akan mengaturnya otomatis beserta boundary-nya.
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // 👈 Menyelipkan tiket ke Satpam
        },
        body: formData, 
      });

      if (res.ok) {
        // [INTEGRASI AUDIT LOG] - Catat aktivitas pembuatan arsip
        await sendAuditLog(
          'CREATE_ARCHIVE', 
          code, 
          `Mendaftarkan arsip baru: ${title} (${category})`
        );

        alert('Arsip dan PDF Berhasil Diregistrasi!');
        // Reset form termasuk tanggal retensi
        setCode(''); setTitle(''); setDescription(''); setRetentionDate(''); setFile(null);
      } else {
        const errorData = await res.json();
        alert(`Gagal: ${errorData.message || 'Cek kembali isian Anda'}`);
      }
    } catch (error) {
      alert('Gagal menghubungi server backend untuk mengunggah arsip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-slate-200 font-sans min-h-full">
      
      {/* HEADER CAPTURE */}
      <div className="mb-12 animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-2">
          Capture <span className="italic text-[#0a8270]">Arsip Baru.</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
          Digitalisasi Fisik & Pendaftaran Metadata
        </p>
      </div>

      {/* KONTAINER FORM (Glassmorphism Gelap) */}
      <div className="max-w-4xl bg-[#1a1a1a] rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden animate-[fadeIn_0.7s_ease-out]">
        
        {/* Ornamen Latar Belakang Form */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0a8270]/10 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Kode Klasifikasi</label>
              <input 
                type="text" required value={code} onChange={(e)=>setCode(e.target.value)} 
                className="w-full p-4 bg-[#111111] border border-slate-800 text-white rounded-2xl focus:outline-none focus:border-[#0a8270] focus:ring-1 focus:ring-[#0a8270] transition-all font-mono text-sm placeholder:text-slate-700 shadow-inner uppercase" 
                placeholder="SKP.01.02" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Kategori Saat Ini</label>
              <select 
                value={category} onChange={(e)=>setCategory(e.target.value)} 
                className="w-full p-4 bg-[#111111] border border-slate-800 text-white rounded-2xl focus:outline-none focus:border-[#0a8270] focus:ring-1 focus:ring-[#0a8270] transition-all font-mono text-sm shadow-inner appearance-none cursor-pointer"
              >
                <option value="Aktif">Arsip Aktif</option>
                <option value="Inaktif">Arsip Inaktif</option>
                <option value="Vital">Arsip Vital</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Judul Dokumen</label>
            <input 
              type="text" required value={title} onChange={(e)=>setTitle(e.target.value)} 
              className="w-full p-4 bg-[#111111] border border-slate-800 text-white rounded-2xl focus:outline-none focus:border-[#0a8270] focus:ring-1 focus:ring-[#0a8270] transition-all font-mono text-sm placeholder:text-slate-700 shadow-inner" 
              placeholder="Masukkan Judul Dokumen yang merepresentasikan isi..." 
            />
          </div>

          {/* INPUT RETENSI BARU - Highlight Merah untuk Penanda JRA */}
          <div className="space-y-2 border border-dashed border-[#eb3434]/30 p-5 rounded-3xl bg-[#eb3434]/5 group hover:border-[#eb3434]/50 transition-colors">
            <label className="text-[10px] font-black text-[#eb3434] uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <span>Jadwal Retensi JRA</span>
              <span className="bg-[#eb3434] text-white px-2 py-0.5 rounded-full text-[8px]">Otomatis Terhubung ke Penyusutan</span>
            </label>
            <input 
              type="date" 
              value={retentionDate} 
              onChange={(e)=>setRetentionDate(e.target.value)} 
              className="w-full p-4 bg-[#111111] border border-[#eb3434]/20 text-white rounded-2xl focus:outline-none focus:border-[#eb3434] focus:ring-1 focus:ring-[#eb3434] transition-all font-mono text-sm shadow-inner cursor-pointer" 
            />
            <p className="text-slate-500 text-[9px] mt-2 font-mono uppercase ml-1">
              *Kosongkan kolom ini jika arsip bersifat Permanen (tidak memiliki jadwal musnah).
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Deskripsi / Ringkasan</label>
            <textarea 
              rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} 
              className="w-full p-4 bg-[#111111] border border-slate-800 text-white rounded-2xl focus:outline-none focus:border-[#0a8270] focus:ring-1 focus:ring-[#0a8270] transition-all font-mono text-sm placeholder:text-slate-700 shadow-inner resize-none" 
              placeholder="Detail tambahan atau konteks penciptaan arsip..."
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Unggah Lampiran Digital (Wajib PDF)</label>
            <div className="relative group">
              <input 
                type="file" accept=".pdf" onChange={(e)=>setFile(e.target.files?.[0] || null)} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className={`w-full p-6 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl transition-all duration-300 ${
                file ? 'bg-[#0a8270]/20 border-[#0a8270] text-[#0a8270]' : 'bg-[#111111] border-slate-700 text-slate-500 group-hover:border-slate-500'
              }`}>
                <span className="text-3xl mb-2">{file ? '📄' : '📥'}</span>
                <span className="font-mono text-sm font-bold truncate max-w-xs text-center">
                  {file ? file.name : 'Klik atau seret file PDF ke area ini'}
                </span>
                {!file && <span className="text-[10px] uppercase tracking-widest mt-2 opacity-60">Maks. 5MB</span>}
              </div>
            </div>
          </div>

          <button 
            type="submit" disabled={loading} 
            className="w-full mt-8 py-5 bg-[#0a8270] hover:bg-[#086a5a] text-white font-black rounded-2xl shadow-lg shadow-teal-900/20 tracking-[0.2em] uppercase text-xs transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? 'Menyimpan Metadata...' : 'Registrasi Arsip ke Sistem'}
          </button>
        </form>
      </div>
    </div>
  );
}