'use client';

import { useEffect, useState } from 'react';

interface RetentionRule {
  id: string;
  code: string;
  seriesName: string;
  activeYears: number;
  inactiveYears: number;
  finalAction: string;
}

export default function JRAPage() {
  const [rules, setRules] = useState<RetentionRule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [code, setCode] = useState('');
  const [seriesName, setSeriesName] = useState('');
  const [activeYears, setActiveYears] = useState('');
  const [inactiveYears, setInactiveYears] = useState('');
  const [finalAction, setFinalAction] = useState('Musnah');

  // Fungsi Helper untuk mengirim log
  const sendAuditLog = async (action: string, targetId: string, details: string) => {
    try {
      await fetch('http://localhost:3001/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action,
          performedBy: 'Administrator',
          targetId: targetId,
          details: details
        })
      });
    } catch (error) {
      console.error('Gagal mencatat audit log:', error);
    }
  };

  const fetchRules = async () => {
    try {
      const res = await fetch('http://localhost:3001/retentions');
      const data = await res.json();
      setRules(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRules(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      code: code,
      seriesName: seriesName,
      activeYears: parseInt(activeYears) || 0,
      inactiveYears: parseInt(inactiveYears) || 0,
      finalAction: finalAction
    };

    try {
      const res = await fetch('http://localhost:3001/retentions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // [INTEGRASI AUDIT LOG] - Catat pembuatan JRA
        await sendAuditLog(
          'CREATE_JRA', 
          code, 
          `Menambahkan Jadwal Retensi baru untuk seri: ${seriesName}`
        );

        setIsModalOpen(false);
        fetchRules();
        setCode(''); setSeriesName(''); setActiveYears(''); setInactiveYears(''); setFinalAction('Musnah');
      } else {
        const errorData = await res.json();
        alert(`Gagal menyimpan: ${errorData.message || 'Cek kembali isian Anda'}`);
      }
    } catch (error) {
      alert('Gagal menghubungi server backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, ruleCode: string) => {
    if (!confirm(`Tindakan ini akan menghapus aturan JRA untuk kode ${ruleCode}. Lanjutkan?`)) return;
    
    try {
      await fetch(`http://localhost:3001/retentions/${id}`, { method: 'DELETE' });
      
      // [INTEGRASI AUDIT LOG] - Catat penghapusan JRA
      await sendAuditLog(
        'DELETE_JRA', 
        ruleCode, 
        `Menghapus regulasi Jadwal Retensi untuk klasifikasi: ${ruleCode}`
      );
      
      fetchRules();
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus JRA.");
    }
  };

  const getActionBadge = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('musnah')) return 'bg-[#eb3434]/10 text-[#eb3434] border-[#eb3434]/30 shadow-red-900/20';
    if (act.includes('permanen')) return 'bg-[#0a8270]/10 text-[#0a8270] border-[#0a8270]/30 shadow-teal-900/20';
    return 'bg-[#ffe227]/10 text-[#ffe227] border-[#ffe227]/30 shadow-yellow-900/20';
  };

  return (
    <div className="text-slate-200 font-sans min-h-full relative">
      
      {/* HEADER JRA */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-2">
            Jadwal <span className="italic text-[#8b5cf6]">Retensi Arsip.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
            Panduan Otomatisasi Siklus Hidup Rekod
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-black rounded-2xl transition-all shadow-lg shadow-purple-900/20 uppercase tracking-[0.2em] text-xs flex items-center gap-3 hover:-translate-y-1"
        >
          <span className="text-lg leading-none">+</span> Tambah Aturan JRA
        </button>
      </div>

      {/* KONTAINER DAFTAR JRA */}
      <div className="bg-[#1a1a1a] rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-64 bg-[#8b5cf6]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col">
          {loading ? (
            <div className="py-20 text-center">
              <p className="font-serif text-xl italic tracking-widest text-[#8b5cf6] animate-pulse">Memuat regulasi kearsipan...</p>
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-20 bg-[#111111] rounded-3xl border border-dashed border-white/10">
              <span className="text-4xl block mb-4 opacity-50">⚖️</span>
              <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Belum ada aturan JRA yang ditetapkan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-12 gap-6 px-6 pb-4 border-b border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                <div className="col-span-2">Kode</div>
                <div className="col-span-3">Jenis / Seri Arsip</div>
                <div className="col-span-2 text-center">Masa Aktif</div>
                <div className="col-span-2 text-center">Masa Inaktif</div>
                <div className="col-span-2 text-center">Nasib Akhir</div>
                <div className="col-span-1 text-right">Aksi</div>
              </div>

              {rules.map((rule) => (
                <div key={rule.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center p-6 bg-[#111111] border border-white/5 rounded-2xl hover:border-white/20 transition-all shadow-inner group">
                  <div className="md:col-span-2">
                    <span className="font-mono font-bold text-[#8b5cf6] text-lg tracking-widest bg-[#8b5cf6]/10 px-3 py-1 rounded-lg border border-[#8b5cf6]/20">
                      {rule.code}
                    </span>
                  </div>

                  <div className="md:col-span-3 min-w-0">
                    <p className="font-bold text-white text-base truncate">{rule.seriesName}</p>
                    <p className="text-[9px] font-black text-slate-500 mt-1 uppercase tracking-widest">Sesuai Peraturan Retensi</p>
                  </div>

                  <div className="md:col-span-2 flex md:justify-center items-end gap-2">
                    <span className="text-2xl font-serif italic text-white leading-none">{rule.activeYears}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Tahun</span>
                  </div>

                  <div className="md:col-span-2 flex md:justify-center items-end gap-2">
                    <span className="text-2xl font-serif italic text-white leading-none">{rule.inactiveYears}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Tahun</span>
                  </div>

                  <div className="md:col-span-2 flex md:justify-center">
                    <span className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${getActionBadge(rule.finalAction)}`}>
                      {rule.finalAction}
                    </span>
                  </div>

                  <div className="md:col-span-1 flex md:justify-end">
                    <button 
                      onClick={() => handleDelete(rule.id, rule.code)} 
                      className="text-slate-500 hover:text-[#eb3434] transition-colors p-2 rounded-lg hover:bg-[#eb3434]/10"
                      title="Hapus Aturan"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL TAMBAH JRA --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#0b1120]/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-[#1a1a1a] w-full max-w-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden transform transition-all">
            <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-serif italic text-white tracking-tight">Registrasi <span className="text-[#8b5cf6]">Aturan Baru.</span></h3>
                <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em] mt-2">Formulir Pendaftaran JRA</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="relative z-10 w-12 h-12 bg-[#111111] border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-[#eb3434] hover:border-[#eb3434] transition-all">
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Induk Kode Klasifikasi</label>
                  <input 
                    type="text" required value={code} onChange={e => setCode(e.target.value)} 
                    className="w-full p-4 bg-[#111111] border border-slate-800 text-white rounded-2xl focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all font-mono text-sm placeholder:text-slate-700 shadow-inner" 
                    placeholder="Contoh: SKP" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Nasib Akhir</label>
                  <select 
                    value={finalAction} onChange={e => setFinalAction(e.target.value)} 
                    className="w-full p-4 bg-[#111111] border border-slate-800 text-white rounded-2xl focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all font-mono text-sm shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="Musnah">Musnah</option>
                    <option value="Permanen">Permanen</option>
                    <option value="Dinilai Kembali">Dinilai Kembali</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Jenis / Seri Arsip</label>
                <input 
                  type="text" required value={seriesName} onChange={e => setSeriesName(e.target.value)} 
                  className="w-full p-4 bg-[#111111] border border-slate-800 text-white rounded-2xl focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all font-mono text-sm placeholder:text-slate-700 shadow-inner" 
                  placeholder="Contoh: Dokumen Skripsi Mahasiswa" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Retensi Aktif (Tahun)</label>
                  <input 
                    type="number" required min="0" value={activeYears} onChange={e => setActiveYears(e.target.value)} 
                    className="w-full p-4 bg-[#111111] border border-slate-800 text-white rounded-2xl focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all font-mono text-sm placeholder:text-slate-700 shadow-inner" 
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Retensi Inaktif (Tahun)</label>
                  <input 
                    type="number" required min="0" value={inactiveYears} onChange={e => setInactiveYears(e.target.value)} 
                    className="w-full p-4 bg-[#111111] border border-slate-800 text-white rounded-2xl focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all font-mono text-sm placeholder:text-slate-700 shadow-inner" 
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-[#111111] hover:bg-slate-800 border border-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all">
                  Batalkan
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50">
                  {isSubmitting ? 'Memproses Data...' : 'Simpan Aturan JRA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}