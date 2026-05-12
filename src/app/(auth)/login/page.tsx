'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent } from 'react';

export default function LoginPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // STATE ANIMASI
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Memicu animasi beberapa milidetik setelah halaman dimuat
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        document.cookie = `accessToken=${data.accessToken}; path=/`;
        const userRole = data.role || data.user?.role || 'STAFF';
        document.cookie = `userRole=${userRole}; path=/`;
        
        router.push('/dashboard');
      } else {
        alert(data.message || 'Kredensial tidak valid. Silakan periksa kembali Email atau Kata Sandi Anda.');
      }
    } catch (error) {
      alert('Gagal terhubung ke pangkalan data keamanan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-slate-200 font-sans flex items-center justify-center p-6 selection:bg-[#ffe227] selection:text-black relative overflow-hidden">
      
      {/* Ornamen Latar Belakang */}
      <div className={`absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#eb3434] rounded-full opacity-5 blur-[120px] pointer-events-none transition-all duration-1000 ${mounted ? 'scale-100' : 'scale-50'}`}></div>
      <div className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#2358d8] rounded-full opacity-5 blur-[120px] pointer-events-none transition-all duration-1000 delay-500 ${mounted ? 'scale-100' : 'scale-50'}`}></div>

      {/* Container Utama dengan Animasi Slide Up & Scale */}
      <div className={`relative z-10 w-full max-w-5xl flex flex-col md:flex-row bg-[#1a1a1a] rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden transition-all duration-1000 ease-out transform ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}>

        {/* --- PANEL KIRI (Masuk dari kiri) --- */}
        <div className={`w-full md:w-5/12 bg-gradient-to-br from-[#eb3434] to-[#991b1b] p-10 md:p-14 flex flex-col justify-between relative overflow-hidden transition-all duration-1000 delay-300 ease-out ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-[150px] pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/20 rounded-tr-[100px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <p className="text-white/80 text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Portal Manajemen Rekod</p>
            <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight leading-tight">
              Akses <br/><span className="italic font-light">Terpusat.</span>
            </h1>
          </div>

          <div className="mt-16 relative z-10">
            <p className="text-white/90 text-[11px] font-mono uppercase tracking-[0.15em] leading-relaxed font-bold mb-8">
              Sistem Pengelolaan Arsip Dinamis untuk masa depan institusi yang lebih terstruktur.
            </p>
            <div className="bg-black/20 p-5 rounded-2xl border border-white/10 backdrop-blur-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Integritas Data</p>
                <p className="text-[9px] font-mono uppercase tracking-widest text-white/60 mt-1">Terstandarisasi ISO 15489</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- PANEL KANAN (Masuk dari kanan) --- */}
        <div className={`w-full md:w-7/12 p-10 md:p-16 flex flex-col justify-center bg-[#111111] relative transition-all duration-1000 delay-500 ease-out ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
          <div className="mb-12">
            <div className="text-3xl font-serif italic text-white lowercase tracking-tighter mb-2">(edrms<span className="text-[#eb3434]">.</span>)</div>
            <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">Vokasi UI Edition</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Alamat Email Institusi</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/5 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-[#ffe227] focus:ring-1 focus:ring-[#ffe227] transition-all font-mono text-sm placeholder:text-slate-700 shadow-inner" placeholder="nama@kearsipan.ui.ac.id" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Kata Sandi</label>
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/5 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-[#ffe227] focus:ring-1 focus:ring-[#ffe227] transition-all font-mono text-sm placeholder:text-slate-700 shadow-inner tracking-widest" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading} className="w-full mt-4 px-6 py-5 bg-[#ffe227] hover:bg-yellow-400 text-black rounded-2xl font-black shadow-lg shadow-yellow-500/10 tracking-[0.2em] uppercase text-xs transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
              {loading ? 'Memverifikasi...' : 'Loading'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
              Belum memiliki akses? <Link href="/register" className="text-[#ffe227] hover:text-white transition-colors ml-2">Daftar Akun Baru</Link>
            </p>
            <Link href="/" className="text-slate-600 hover:text-white text-[9px] font-black tracking-[0.2em] uppercase transition-colors">Kembali ke Beranda</Link>
          </div>
        </div>

      </div>
    </div>
  );
}