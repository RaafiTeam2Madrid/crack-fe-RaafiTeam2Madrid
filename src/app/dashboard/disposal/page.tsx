'use client';

import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Archive {
  id: string;
  code: string;
  title: string;
  category: string;
  uploadDate: string;
  retentionDate?: string;
  isDestroyed?: boolean;
  destroyedAt?: string;
  destroyedBy?: string;
}

export default function DisposalPage() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [destroyedArchives, setDestroyedArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'EKSEKUSI' | 'BERITA_ACARA'>('EKSEKUSI');

  const fetchData = async () => {
    try {
      const resActive = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/archives`);
      if (resActive.ok) {
        const data = await resActive.json();
        setArchives(data);
      }

      const resDestroyed = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/archives/destroyed`);
      if (resDestroyed.ok) {
        const data = await resDestroyed.json();
        setDestroyedArchives(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDestroy = async (id: string, title: string) => {
    const confirmMessage = `PERINGATAN STANDAR ANRI:\n\nApakah Anda yakin ingin memusnahkan arsip "${title}" secara permanen? \nFile digital akan dihapus dan tindakan ini akan dicatat dalam Berita Acara Pemusnahan.`;
    
    if (confirm(confirmMessage)) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/archives/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          alert('Arsip berhasil dimusnahkan. Cek tab Berita Acara.');
          fetchData(); 
        } else {
          alert('Gagal mengeksekusi pemusnahan.');
        }
      } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan jaringan.');
      }
    }
  };

  // --- FITUR BARU: CETAK PDF BERITA ACARA ---
  const handlePrintPDF = () => {
    if (destroyedArchives.length === 0) {
      alert('Belum ada data arsip yang dimusnahkan untuk dicetak.');
      return;
    }

    const doc = new jsPDF();

    // 1. Kop Surat / Header Dokumen
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SISTEM TEMU KEMBALI REKOD INSTITUSI', 105, 15, { align: 'center' });
    doc.text('FAKULTAS VOKASI - UNIVERSITAS INDONESIA', 105, 22, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Gedung Vokasi UI, Kampus UI Depok, Jawa Barat 16424', 105, 28, { align: 'center' });
    doc.line(14, 32, 196, 32); // Garis kop surat
    doc.line(14, 33, 196, 33); // Garis ganda

    // 2. Judul Laporan
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BERITA ACARA PEMUSNAHAN ARSIP', 105, 45, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Sesuai Peraturan Kepala ANRI Nomor 22 Tahun 2015', 105, 51, { align: 'center' });

    // 3. Waktu Cetak
    const printDate = new Date().toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    doc.text(`Tanggal Cetak: ${printDate}`, 14, 65);

    // 4. Tabel Data (AutoTable)
    const tableColumn = ["No", "Kode Arsip", "Judul Dokumen", "Waktu Eksekusi", "Eksekutor"];
    const tableRows: any[] = [];

    destroyedArchives.forEach((archive, index) => {
      const archiveData = [
        index + 1,
        archive.code || '-',
        archive.title,
        archive.destroyedAt ? new Date(archive.destroyedAt).toLocaleString('id-ID') : '-',
        archive.destroyedBy || 'Sistem'
      ];
      tableRows.push(archiveData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 70,
      theme: 'grid',
      styles: { fontSize: 8, font: 'helvetica' },
      headStyles: { fillColor: [235, 52, 52], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // 5. Tanda Tangan (Signature Block)
    const finalY = (doc as any).lastAutoTable.finalY || 70;
    doc.text('Mengetahui dan Mengesahkan,', 140, finalY + 20);
    doc.text('Admin EDRMS / Arsiparis', 140, finalY + 25);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Aditya Raafi Yudhatama (2026)', 140, finalY + 45);
    doc.setLineWidth(0.5);
    doc.line(140, finalY + 46, 190, finalY + 46);

    // 6. Simpan File
    doc.save('Berita-Acara-Pemusnahan-Arsip.pdf');
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* HEADER */}
      <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">
            Penyusutan <span className="italic text-[#eb3434]">Arsip.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
            Manajemen Jadwal Retensi dan Eksekusi Rekod
          </p>
        </div>

        {/* TAB NAVIGASI */}
        <div className="flex bg-[#111111] p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('EKSEKUSI')}
            className={`px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'EKSEKUSI' 
              ? 'bg-[#eb3434]/20 text-[#eb3434] shadow-[0_0_10px_rgba(235,52,52,0.2)]' 
              : 'text-slate-500 hover:text-white'
            }`}
          >
            Antrean Eksekusi
          </button>
          <button 
            onClick={() => setActiveTab('BERITA_ACARA')}
            className={`px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'BERITA_ACARA' 
              ? 'bg-[#0a8270]/20 text-[#0a8270] shadow-[0_0_10px_rgba(10,130,112,0.2)]' 
              : 'text-slate-500 hover:text-white'
            }`}
          >
            Berita Acara (Log)
          </button>
        </div>
      </div>

      {/* KONTEN TAB: ANTREAN EKSEKUSI */}
      {activeTab === 'EKSEKUSI' && (
        <div className="bg-[#1a1a1a] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative animate-[fadeIn_0.3s_ease-out]">
          <div className="h-1 w-full bg-gradient-to-r from-[#eb3434] via-[#111111] to-[#eb3434] opacity-50"></div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111111] border-b border-white/5">
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Kode</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Judul & Detail Rekod</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Jatuh Tempo (JRA)</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Tindakan Eksekusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={4} className="p-10 text-center text-slate-500 font-mono text-xs uppercase">Menyinkronkan data retensi...</td></tr>
                ) : archives.length === 0 ? (
                  <tr><td colSpan={4} className="p-10 text-center text-slate-500 font-mono text-xs uppercase">Tidak ada arsip dalam antrean.</td></tr>
                ) : (
                  archives.map((archive) => (
                    <tr key={archive.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-6 font-mono text-xs text-white/80 font-bold">{archive.code || '-'}</td>
                      <td className="p-6">
                        <p className="text-white font-semibold text-sm mb-1">{archive.title}</p>
                        <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">
                          KATEGORI AWAL: {archive.category}
                        </p>
                      </td>
                      <td className="p-6">
                        {archive.retentionDate ? (
                          <span className="px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest bg-[#eb3434]/10 text-[#eb3434] border-[#eb3434]/30">
                            {new Date(archive.retentionDate).toLocaleDateString('id-ID')}
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30">
                            PERMANEN
                          </span>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => handleDestroy(archive.id, archive.title)}
                          className="px-5 py-2.5 bg-transparent border border-[#eb3434]/50 hover:bg-[#eb3434] hover:text-white text-[#eb3434] rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                          🔥 Eksekusi Musnah
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KONTEN TAB: BERITA ACARA PEMUSNAHAN */}
      {activeTab === 'BERITA_ACARA' && (
        <div className="bg-[#1a1a1a] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative animate-[fadeIn_0.3s_ease-out]">
          <div className="h-1 w-full bg-gradient-to-r from-[#0a8270] via-[#111111] to-[#0a8270] opacity-50"></div>
          
          <div className="p-6 bg-[#111111] border-b border-white/5 flex justify-between items-center">
            <div>
              <h2 className="text-white font-bold text-sm mb-1">Log Definitif Pemusnahan</h2>
              <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Sesuai Peraturan Kepala ANRI No. 22 Tahun 2015</p>
            </div>
            {/* Tombol Cetak PDF yang sudah tersambung fungsi */}
            <button 
              onClick={handlePrintPDF}
              className="px-5 py-2.5 bg-[#2358d8] hover:bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(35,88,216,0.3)] flex items-center gap-2 hover:-translate-y-0.5"
            >
              <span>📥</span> CETAK DOKUMEN PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-white/5">
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Kode & Judul Arsip</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Waktu Pemusnahan</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Dieksekusi Oleh</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status Hukum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={4} className="p-10 text-center text-slate-500 font-mono text-xs uppercase">Menyinkronkan log audit...</td></tr>
                ) : destroyedArchives.length === 0 ? (
                  <tr><td colSpan={4} className="p-10 text-center text-slate-500 font-mono text-xs uppercase">Belum ada catatan pemusnahan arsip.</td></tr>
                ) : (
                  destroyedArchives.map((archive) => (
                    <tr key={archive.id} className="hover:bg-white/5 transition-colors group opacity-80 hover:opacity-100">
                      <td className="p-6">
                        <span className="font-mono text-xs text-white/60 font-bold mr-2">{archive.code || '-'}</span>
                        <span className="text-white font-semibold text-sm line-through decoration-[#eb3434]/50">{archive.title}</span>
                      </td>
                      <td className="p-6 font-mono text-xs text-slate-400">
                        {archive.destroyedAt ? new Date(archive.destroyedAt).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="p-6">
                        <span className="bg-slate-800 text-white px-3 py-1.5 rounded-md text-[9px] font-black uppercase shadow-inner">
                          {archive.destroyedBy || 'SISTEM'}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest bg-black text-slate-400 border-slate-700 flex items-center w-max gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#eb3434]"></span> MUSNAH TOTAL
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}