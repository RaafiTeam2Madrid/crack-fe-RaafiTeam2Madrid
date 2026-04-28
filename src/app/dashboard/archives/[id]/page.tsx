// src/app/dashboard/archives/[id]/page.tsx
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

// --- Simulasi Database Backend ---
const mockDatabase: Record<string, any> = {
  'ARS-001': {
    title: 'Keputusan Menteri Kehutanan tentang Penetapan Kawasan',
    creator: 'Kementerian Kehutanan',
    date: '2025-05-13',
    subject: 'HK.01.02 - Keputusan Menteri',
    description: 'Berkas keputusan menteri terkait penetapan kawasan. Telah melalui proses alih media dan diinput ke dalam sistem arsip elektronik.',
    status: 'Inaktif',
    retention: 'Musnah (2030)',
    securityLevel: 'Biasa / Terbuka'
  },
  'ARS-004': {
    title: 'Data Industri Pupuk & Pestisida Nasional',
    creator: 'Kementerian Perindustrian',
    date: '2024-09-08',
    subject: 'IN.03 - Produksi',
    description: 'Rekapitulasi agenda rapat dan kompilasi data produksi industri pupuk dan pestisida.',
    status: 'Aktif',
    retention: 'Permanen',
    securityLevel: 'Terbatas'
  },
  'ARS-005': {
    title: 'Nota Dinas dan Data Klien Proyek Konstruksi',
    creator: 'Divisi Konstruksi Perumnas',
    date: '2024-08-12',
    subject: 'KN.01 - Proyek',
    description: 'Pemberkasan arsip konstruksi, pelabelan fisik, dan kompilasi nota dinas klien.',
    status: 'Inaktif',
    retention: 'Dinilai Kembali (2029)',
    securityLevel: 'Rahasia'
  }
};

export default function ArchiveDetailPage() {
  const params = useParams();
  const id = params.id as string; // Mengambil ID dari URL (misal: ARS-001)

  // Mencari data di "database"
  const archive = mockDatabase[id];

  if (!archive) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Arsip Tidak Ditemukan</h2>
        <p className="text-gray-500 mt-2">Arsip dengan ID {id} tidak ada dalam sistem atau Anda tidak memiliki akses.</p>
        <Link href="/dashboard/search" className="mt-4 inline-block text-blue-600 hover:underline">
          &larr; Kembali ke Pencarian
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Tombol Kembali */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <Link href="/dashboard/search" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
            &larr; Kembali ke Hasil Pencarian
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">{archive.title}</h2>
          <p className="text-gray-500 mt-1">ID Sistem: <span className="font-mono text-blue-600 font-semibold">{id}</span></p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium">
            Unduh Metadata
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Metadata Dublin Core (Lebih Lengkap) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Metadata Arsip</h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500 font-medium">Pencipta (Creator)</dt>
                <dd className="text-gray-900 font-semibold">{archive.creator}</dd>
              </div>
              <div>
                <dt className="text-gray-500 font-medium">Tanggal Diciptakan</dt>
                <dd className="text-gray-900">{archive.date}</dd>
              </div>
              <div>
                <dt className="text-gray-500 font-medium">Klasifikasi</dt>
                <dd className="text-gray-900">{archive.subject}</dd>
              </div>
              <div>
                <dt className="text-gray-500 font-medium">Tingkat Keamanan</dt>
                <dd>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${archive.securityLevel === 'Rahasia' ? 'bg-red-100 text-red-800' : archive.securityLevel === 'Terbatas' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {archive.securityLevel}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 font-medium">Status Retensi JRA</dt>
                <dd className="text-gray-900 font-semibold text-orange-600">{archive.retention}</dd>
              </div>
              <div className="pt-4 border-t">
                <dt className="text-gray-500 font-medium mb-1">Deskripsi Isi Ringkas</dt>
                <dd className="text-gray-700 leading-relaxed">{archive.description}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Kolom Kanan: Pratinjau Dokumen & Audit Trail */}
        <div className="lg:col-span-2 space-y-6">
          {/* Area Viewer PDF Palsu */}
          <div className="bg-slate-800 rounded-lg h-[500px] flex flex-col items-center justify-center text-gray-400 border border-gray-200 shadow-sm relative overflow-hidden">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p>Pratinjau Dokumen Elektronik</p>
            <p className="text-xs mt-2 opacity-70">Viewer PDF akan dirender di sini pada fase integrasi backend.</p>
            
            {/* Watermark Keamanan */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none rotate-[-30deg]">
              <span className="text-6xl font-black uppercase tracking-widest text-white">CONFIDENTIAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}