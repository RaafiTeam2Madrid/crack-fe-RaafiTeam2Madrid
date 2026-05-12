'use client';

import { useState, useEffect } from 'react';

interface RetentionRule {
  id: string;
  code: string;
  category: string;
  activeYears: number;
  inactiveYears: number;
  finalAction: string;
  description: string;
}

export default function JRAPage() {
  const [rules, setRules] = useState<RetentionRule[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- TAMBAHAN: State untuk mendeteksi mode Edit ---
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    category: '',
    activeYears: 1,
    inactiveYears: 1,
    finalAction: 'PERMANEN',
  });

  const fetchRetentionRules = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/retentions`);
      if (res.ok) {
        const data = await res.json();
        setRules(Array.isArray(data) ? data : []);
      } else {
        setRules([]);
      }
    } catch (error) {
      console.error('Gagal mengambil data JRA:', error);
      setRules([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetentionRules();
  }, []);

  // --- TAMBAHAN: Fungsi ketika tombol Pensil diklik ---
  const handleEditClick = (rule: RetentionRule) => {
    // Isi form dengan data yang sudah ada
    setFormData({
      code: rule.code,
      category: rule.category,
      activeYears: rule.activeYears,
      inactiveYears: rule.inactiveYears,
      finalAction: rule.finalAction,
    });
    // Tandai bahwa kita sedang dalam mode edit untuk ID ini
    setEditingId(rule.id);
    setIsModalOpen(true);
  };

  // --- TAMBAHAN: Fungsi ketika tombol Tambah diklik ---
  const handleAddClick = () => {
    setEditingId(null); // Pastikan bukan mode edit
    setFormData({ code: '', category: '', activeYears: 1, inactiveYears: 1, finalAction: 'PERMANEN' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        code: formData.code,
        seriesName: formData.category, 
        activeYears: Number(formData.activeYears),
        inactiveYears: Number(formData.inactiveYears),
        finalAction: formData.finalAction,
      };

      // --- TAMBAHAN: Logika URL & Method (POST untuk baru, PUT untuk edit) ---
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/retentions/${editingId}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/retentions`;
      
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ code: '', category: '', activeYears: 1, inactiveYears: 1, finalAction: 'PERMANEN' });
        fetchRetentionRules();
      } else {
        alert('Gagal menyimpan aturan JRA.');
      }
    } catch (error) {
      console.error('Error saat menyimpan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">
            Jadwal Retensi <span className="italic text-[#8b5cf6]">Arsip.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
            Manajemen Aturan Siklus Hidup Rekod (JRA)
          </p>
        </div>
        <button 
          onClick={handleAddClick} 
          className="px-6 py-4 bg-[#8b5cf6] hover:bg-purple-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-purple-900/50 hover:-translate-y-1"
        >
          + Tambah Aturan JRA
        </button>
      </div>

      <div className="bg-[#1a1a1a] rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8b5cf6] via-[#111111] to-[#8b5cf6] opacity-50"></div>

        <div className="p-8 space-y-6">
          <div className="hidden md:grid grid-cols-12 gap-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">
            <div className="col-span-2">Kode</div>
            <div className="col-span-3">Kategori Rekod</div>
            <div className="col-span-2 text-center">Masa Aktif</div>
            <div className="col-span-2 text-center">Masa Inaktif</div>
            <div className="col-span-2 text-center">Nasib Akhir</div>
            <div className="col-span-1 text-right">Aksi</div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-500 font-mono text-xs uppercase tracking-widest animate-pulse">
                Memuat regulasi JRA...
              </div>
            ) : rules.length === 0 ? (
              <div className="text-center py-16 bg-[#111111] rounded-[1.5rem] border border-dashed border-slate-800">
                <span className="text-4xl block mb-4">⚖️</span>
                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Belum ada aturan JRA yang dikonfigurasi.</p>
              </div>
            ) : (
              rules.map((rule) => (
                <div key={rule.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center p-6 bg-[#111111] border border-white/5 rounded-2xl hover:border-white/20 transition-all shadow-inner group">
                  <div className="md:col-span-2">
                    <span className="font-mono font-bold text-[#8b5cf6] text-lg tracking-widest bg-[#8b5cf6]/10 px-3 py-1 rounded-lg border border-[#8b5cf6]/20">
                      {rule.code}
                    </span>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-white font-semibold text-sm">{rule.category}</p>
                    <p className="text-slate-500 text-[10px] font-mono mt-1">{rule.description}</p>
                  </div>
                  <div className="md:col-span-2 flex items-center justify-start md:justify-center gap-2">
                    <span className="md:hidden text-slate-500 text-[10px] uppercase font-black">Aktif:</span>
                    <div className="flex items-center gap-1.5 bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-lg border border-teal-500/20">
                      <span className="font-black">{rule.activeYears}</span>
                      <span className="text-[9px] uppercase tracking-widest font-bold">Tahun</span>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-center justify-start md:justify-center gap-2">
                    <span className="md:hidden text-slate-500 text-[10px] uppercase font-black">Inaktif:</span>
                    <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                      <span className="font-black">{rule.inactiveYears}</span>
                      <span className="text-[9px] uppercase tracking-widest font-bold">Tahun</span>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-center justify-start md:justify-center gap-2">
                    <span className="md:hidden text-slate-500 text-[10px] uppercase font-black">Nasib Akhir:</span>
                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border
                      ${rule.finalAction?.toUpperCase() === 'MUSNAH' ? 'bg-[#eb3434]/10 text-[#eb3434] border-[#eb3434]/30' : 
                        rule.finalAction?.toUpperCase() === 'PERMANEN' ? 'bg-[#ffe227]/10 text-[#ffe227] border-[#ffe227]/30' : 
                        'bg-slate-800 text-slate-300 border-slate-600'}
                    `}>
                      {rule.finalAction}
                    </span>
                  </div>
                  <div className="md:col-span-1 flex justify-end gap-2">
                    {/* --- TAMBAHAN: Tombol Edit dipasangkan event onClick --- */}
                    <button 
                      onClick={() => handleEditClick(rule)}
                      className="w-8 h-8 rounded-lg bg-black hover:bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5 transition-colors" 
                      title="Edit JRA"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5">
              {/* --- TAMBAHAN: Judul modal berubah sesuai mode --- */}
              <h2 className="text-xl font-serif text-white">
                {editingId ? 'Edit Regulasi' : 'Tambah Regulasi'} <span className="text-[#8b5cf6] italic">{editingId ? 'JRA' : 'Baru'}</span>
              </h2>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Konfigurasi Jadwal Retensi</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Kode Klasifikasi</label>
                <input required type="text" placeholder="Contoh: KEG.01" 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition-colors"
                  value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Kategori Rekod (Series)</label>
                <input required type="text" placeholder="Contoh: Dokumen Rapat Paripurna" 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition-colors"
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Aktif (Tahun)</label>
                  <input required type="number" min="0" 
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition-colors"
                    value={formData.activeYears} onChange={(e) => setFormData({...formData, activeYears: Number(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Inaktif (Tahun)</label>
                  <input required type="number" min="0" 
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition-colors"
                    value={formData.inactiveYears} onChange={(e) => setFormData({...formData, inactiveYears: Number(e.target.value)})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nasib Akhir</label>
                <select 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition-colors"
                  value={formData.finalAction} onChange={(e) => setFormData({...formData, finalAction: e.target.value})}
                >
                  <option value="PERMANEN">PERMANEN</option>
                  <option value="MUSNAH">MUSNAH</option>
                  <option value="DINILAI KEMBALI">DINILAI KEMBALI</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#8b5cf6] hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50">
                  {/* --- TAMBAHAN: Teks tombol dinamis --- */}
                  {isSubmitting ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Simpan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}