'use client';

import { useState } from 'react';

export default function CapturePage() {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Aktif');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Fungsi Helper untuk mengirim log
  const sendAuditLog = async (action: string, targetId: string, details: string) => {
    try {
      await fetch('http://localhost:3001/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action,
          performedBy: 'Arsiparis / Admin Aktif', // Idealnya ambil dari User Session/Cookie
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
    if (file) formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3001/archives', {
        method: 'POST',
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
        setCode(''); setTitle(''); setDescription(''); setFile(null);
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
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-2">
          Capture <span className="italic text-[#0a8270]">Arsip Baru.</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
          Digitalisasi Fisik & Pendaftaran Metadata
        </p>
      </div>

      {/* KONTAINER FORM (Glassmorphism Gelap) */}
      <div className="max-w-4xl bg-[#1a1a1a] rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* Ornamen Latar Belakang Form */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0a8270]/10 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Kode Klasifikasi</label>
              <input 
                type="text" required value={code} onChange={(e)=>setCode(e.target.value)} 
                className="w-full p-4 bg-[#111111] border border-slate-800 text-white rounded-2xl focus:outline-none focus:border-[#0a8270] focus:ring-1 focus:ring-[#0a8270] transition-all font-mono text-sm placeholder:text-slate-700 shadow-inner" 
                placeholder="SKP.01.02" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Kategori Saat Ini</label>
              <select 
                value={category} onChange={(e)=>setCategory(e.target.value)} 
                className="w-full p-4 bg-[#111111] border border-slate-800 text-white rounded-2xl focus:outline-none focus:border-[#0a8270] focus:ring-1 focus:ring-[#0a8270] transition-all font-mono text-sm shadow-inner appearance-none"
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
              <div className={`w-full p-6 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all duration-300 ${
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