"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  // Efek untuk mendeteksi scroll dan mengubah background Navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mesin Animasi Scroll Reveal (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 },
    ); // Akan memicu animasi jika 10% elemen sudah masuk layar

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#111111] min-h-screen text-slate-200 font-sans selection:bg-[#ffe227] selection:text-black overflow-hidden">
      {/* --- NAVBAR --- */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#111111]/90 backdrop-blur-md border-b border-white/5 py-4 shadow-2xl" : "bg-transparent py-8"}`}
      >
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-8 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
            <a
              href="#eksplorasi"
              className="hover:text-white transition-colors"
            >
              Eksplorasi
            </a>
            <a href="#timeline" className="hover:text-white transition-colors">
              Timeline
            </a>
            <a href="#jra" className="hover:text-white transition-colors">
              JRA
            </a>
          </div>

          <div className="text-3xl font-serif italic text-white lowercase tracking-tighter">
            (edrms<span className="text-[#eb3434]">.</span>)
          </div>

          <div className="flex items-center gap-8 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
            <a href="#tentang" className="hover:text-white transition-colors">
              Tentang Sistem
            </a>
            <Link
              href="/login"
              className="px-6 py-3 bg-white text-black hover:bg-[#ffe227] rounded-full transition-all shadow-lg shadow-white/10 hover:scale-105"
            >
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* --- SEKSI 1: HERO / EKSPLORASI --- */}
      <section
        id="eksplorasi"
        className="pt-40 min-h-screen flex flex-col items-center relative z-10"
      >
        <div className="text-center mb-20 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
          <p className="text-[#64748b] text-[10px] font-black tracking-[0.4em] uppercase mb-4">
            Sistem Kearsipan Terintegrasi
          </p>
          <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter italic">
            Koleksi Arsip
          </h1>
        </div>

        {/* Tumpukan Folder Interaktif */}
        <div className="relative w-full max-w-5xl h-[50vh] mt-auto flex justify-center perspective-1000">
          {/* Folder Ungu */}
          <div className="absolute bottom-0 w-[90%] md:w-[70%] h-64 bg-gradient-to-t from-[#411b99] to-[#8b5cf6] rounded-t-[3rem] shadow-2xl border-t border-white/20 transition-transform duration-700 hover:-translate-y-8 z-10 reveal-on-scroll opacity-0 translate-y-10 delay-100">
            <div className="p-8">
              <p className="text-white/80 font-mono text-[10px] uppercase tracking-[0.3em]">
                Arsip Dinamis
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">
                Jadwal Retensi
              </h3>
            </div>
          </div>

          {/* Folder Hijau */}
          <div className="absolute bottom-0 w-[95%] md:w-[85%] h-56 bg-gradient-to-t from-[#086a5a] to-[#0a8270] rounded-t-[3rem] shadow-2xl border-t border-white/20 transition-transform duration-700 hover:-translate-y-12 z-20 reveal-on-scroll opacity-0 translate-y-10 delay-200">
            <div className="p-8">
              <p className="text-white/80 font-mono text-[10px] uppercase tracking-[0.3em]">
                Arsip Kepegawaian
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">
                Dokumen Skripsi
              </h3>
            </div>
          </div>

          {/* Folder Merah (Paling Depan) */}
          <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-[#991b1b] to-[#eb3434] rounded-t-[3rem] shadow-[0_-20px_50px_rgba(235,52,52,0.3)] border-t border-white/30 transition-transform duration-700 hover:-translate-y-16 z-30 flex justify-between items-end p-10 reveal-on-scroll opacity-0 translate-y-10 delay-300">
            <div>
              <p className="text-white/80 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                KODE KLASIFIKASI: SKP.01.01
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/80 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                DIPERBARUI PADA
              </p>
              <p className="text-white font-black text-xs uppercase tracking-widest mt-1">
                24 APR 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEKSI 2: TIMELINE SIKLUS ARSIP --- */}
      <section
        id="timeline"
        className="py-32 bg-[#1a1a1a] border-y border-white/5 relative"
      >
        {/* Ornamen Cahaya */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#2358d8]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>

        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <div className="mb-20 text-center reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-4">
              Siklus Hidup <span className="italic text-[#2358d8]">Rekod.</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
              Perjalanan Dokumen dari Penciptaan hingga Penyusutan
            </p>
          </div>

          <div className="space-y-12 border-l-2 border-slate-800 ml-4 md:ml-10">
            {/* Node 1 */}
            <div className="relative pl-10 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
              <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-[#111111] border-4 border-[#0a8270] shadow-[0_0_15px_rgba(10,130,112,0.6)]"></div>
              <p className="text-[#0a8270] font-mono text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                Fase 1: Creation
              </p>
              <h3 className="text-2xl font-bold text-white mb-2">
                Penciptaan & Pendaftaran
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Dokumen fisik dialihmediakan (digitalisasi) dan didaftarkan ke
                dalam EDRMS dengan penambahan metadata presisi sesuai standar
                ISO 15489.
              </p>
            </div>

            {/* Node 2 */}
            <div className="relative pl-10 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200">
              <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-[#111111] border-4 border-[#ffe227] shadow-[0_0_15px_rgba(255,226,39,0.6)]"></div>
              <p className="text-[#ffe227] font-mono text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                Fase 2: Maintenance
              </p>
              <h3 className="text-2xl font-bold text-white mb-2">
                Penggunaan Aktif
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Arsip didistribusikan dan digunakan untuk keperluan operasional
                universitas dengan akses yang dikontrol ketat oleh sistem
                Otorisasi Berbasis Peran (RBAC).
              </p>
            </div>

            {/* Node 3 */}
            <div className="relative pl-10 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300">
              <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-[#111111] border-4 border-[#eb3434] shadow-[0_0_15px_rgba(235,52,52,0.6)]"></div>
              <p className="text-[#eb3434] font-mono text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                Fase 3: Disposition
              </p>
              <h3 className="text-2xl font-bold text-white mb-2">
                Penyusutan Final
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Berdasarkan Jadwal Retensi Arsip (JRA), sistem secara otomatis
                menandai arsip yang telah habis masa simpannya untuk dieksekusi
                musnah atau dipermanenkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEKSI 3: JRA (JADWAL RETENSI) --- */}
      <section id="jra" className="py-32 bg-[#111111] relative">
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="mb-20 text-center reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-4">
              Regulasi <span className="italic text-[#8b5cf6]">Retensi.</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
              Mesin Penggerak Penyusutan Otomatis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1a1a1a] p-10 rounded-[2.5rem] border border-white/5 hover:border-[#0a8270]/50 transition-colors group reveal-on-scroll opacity-0 translate-y-10 duration-700 delay-100">
              <div className="w-16 h-16 bg-[#0a8270]/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                📗
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Masa Aktif</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Arsip masih sering digunakan secara terus-menerus dalam kegiatan
                operasional instansi.
              </p>
              <span className="text-[#0a8270] font-mono text-[10px] font-black uppercase tracking-widest border border-[#0a8270]/30 px-3 py-1 rounded-md">
                Frekuensi Tinggi
              </span>
            </div>

            <div className="bg-[#1a1a1a] p-10 rounded-[2.5rem] border border-white/5 hover:border-[#ffe227]/50 transition-colors group reveal-on-scroll opacity-0 translate-y-10 duration-700 delay-200">
              <div className="w-16 h-16 bg-[#ffe227]/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                📒
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Masa Inaktif
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Frekuensi penggunaan arsip telah menurun drastis, disimpan
                sebagai referensi atau hukum.
              </p>
              <span className="text-[#ffe227] font-mono text-[10px] font-black uppercase tracking-widest border border-[#ffe227]/30 px-3 py-1 rounded-md">
                Frekuensi Rendah
              </span>
            </div>

            <div className="bg-[#1a1a1a] p-10 rounded-[2.5rem] border border-white/5 hover:border-[#eb3434]/50 transition-colors group reveal-on-scroll opacity-0 translate-y-10 duration-700 delay-300">
              <div className="w-16 h-16 bg-[#eb3434]/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                📕
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Nasib Akhir</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Tindakan pamungkas terhadap arsip: dimusnahkan, dipermanenkan,
                atau dinilai kembali.
              </p>
              <span className="text-[#eb3434] font-mono text-[10px] font-black uppercase tracking-widest border border-[#eb3434]/30 px-3 py-1 rounded-md">
                Eksekusi Dokumen
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEKSI 4: TENTANG SISTEM & FOOTER --- */}
      <section
        id="tentang"
        className="pt-32 bg-[#1a1a1a] border-t border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#eb3434]/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-8 relative z-10 text-center pb-32">
          <div className="text-4xl font-serif italic text-white lowercase tracking-tighter mb-8 reveal-on-scroll opacity-0 translate-y-10 duration-700">
            (edrms<span className="text-[#eb3434]">.</span>)
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-8 leading-tight reveal-on-scroll opacity-0 translate-y-10 duration-700 delay-100">
            Infrastruktur Kearsipan Digital <br /> Terstandar Functional
            Requirement ICA.
          </h2>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-16 reveal-on-scroll opacity-0 translate-y-10 duration-700 delay-200 font-serif italic">
            "Sistem ini dirancang secara eksklusif untuk Coorporate Purpose,
            memberikan kendali penuh atas autentisitas, reliabilitas,
            integritas, dan kebergunaan setiap rekod elektronik sesuai dengan
            prinsip kearsipan berstandar functional requirement ICA Module 2."
          </p>

          <Link
            href="/login"
            className="inline-block px-10 py-5 bg-[#ffe227] hover:bg-white text-black font-black rounded-full transition-all shadow-xl shadow-yellow-500/10 uppercase tracking-[0.2em] text-xs reveal-on-scroll opacity-0 translate-y-10 duration-700 delay-300 hover:-translate-y-1"
          >
            Masuk ke Dashboard Sistem
          </Link>
        </div>

        <footer className="border-t border-white/5 bg-[#111111] py-8 text-center relative z-10">
          <p className="text-[#64748b] text-[10px] font-black tracking-[0.3em] uppercase">
            © 2026 Aditya Raafi Yudhatama • Universitas Indonesia
          </p>
        </footer>
      </section>
    </div>
  );
}
