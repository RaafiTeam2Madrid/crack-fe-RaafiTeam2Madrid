'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STAFF');

  // STATE ANIMASI
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (response.ok) {
        alert(`Pendaftaran Kredensial Berhasil untuk role ${role}! Silakan Otorisasi Masuk.`);
        router.push('/login');
      } else {
        const data = await response.json();
        alert(data.message || 'Gagal mendaftarkan kredensial. Email mungkin sudah digunakan.');
      }
    } catch (error) {
      alert('Gagal menghubungi server pangkalan data di port 3001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-slate-200 font-sans flex items-center justify-center p-6 selection:bg-[#ffe227] selection:text-black relative overflow-hidden">
      
      {/* Ornamen Latar Belakang */}
      <div className={`absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#eb3434] rounded-full opacity-5 blur-[120px] pointer-events-none transition-all duration-1000 ${mounted ? 'scale-100' : 'scale-50'}`}></div>
      <div className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#411b99] rounded-full opacity-5 blur-[120px] pointer-events-none transition-all duration-1000 delay-500 ${mounted ? 'scale-100' : 'scale-50'}`}></div>

      {/* Container Utama dengan Animasi Slide Up & Scale */}
      <div className={`relative z-10 w-full max-w-5xl flex flex-col md:flex-row bg-[#1a1a1a] rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden transition-all duration-1000 ease-out transform ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}>

        {/* --- PANEL KIRI (Masuk dari kiri) --- */}
        <div className={`w-full md:w-5/12 bg-gradient-to-br from-[#eb3434] to-[#991b1b] p-10 md:p-14 flex flex-col justify-between relative overflow-hidden transition-all duration-1000 delay-300 ease-out ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-[150px] pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/20 rounded-tr-[100px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <p className="text-white/80 text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Registrasi Personel</p>
            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
              Akses <br/><span className="italic font-light">Terotorisasi.</span>
            </h1>
          </div>

          <div className="mt-16 relative z-10 hidden md:block">
            <p className="text-white/90 text-[11px] font-mono uppercase tracking-[0.15em] leading-relaxed font-bold mb-8">
              Daftarkan kredensial Anda untuk mendapatkan hak akses ke dalam Pangkalan Data EDRMS Vokasi UI.
            </p>
            <div className="bg-black/20 p-5 rounded-2xl border border-white/10 backdrop-blur-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Enkripsi Kredensial</p>
                <p className="text-[9px] font-mono uppercase tracking-widest text-white/60 mt-1">Dilindungi Protokol Keamanan</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- PANEL KANAN (Masuk dari kanan) --- */}
        <div className={`w-full md:w-7/12 p-10 md:p-14 flex flex-col justify-center bg-[#111111] relative transition-all duration-1000 delay-500 ease-out ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
          <div className="mb-10">
            <div className="text-3xl font-serif italic text-white lowercase tracking-tighter mb-2">(edrms<span className="text-[#eb3434]">.</span>)</div>
            <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">Pendaftaran Akun Baru</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Identitas Personel</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/5 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-[#ffe227] focus:ring-1 focus:ring-[#ffe227] transition-all font-mono text-sm placeholder:text-slate-700 shadow-inner" placeholder="Nama Lengkap Anda" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Alamat Email Institusi</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/5 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-[#ffe227] focus:ring-1 focus:ring-[#ffe227] transition-all font-mono text-sm placeholder:text-slate-700 shadow-inner" placeholder="nama@kearsipan.ui.ac.id" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Kata Sandi</label>
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/5 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-[#ffe227] focus:ring-1 focus:ring-[#ffe227] transition-all font-mono text-sm placeholder:text-slate-700 shadow-inner tracking-widest" placeholder="••••••••" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Tingkat Akses</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/5 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-[#ffe227] focus:ring-1 focus:ring-[#ffe227] transition-all font-mono text-sm appearance-none shadow-inner cursor-pointer">
                  <option value="STAFF">Staff Terbatas</option>
                  <option value="ARSIPARIS">Arsiparis</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-6 px-6 py-5 bg-[#ffe227] hover:bg-yellow-400 text-black rounded-2xl font-black shadow-lg shadow-yellow-500/10 tracking-[0.2em] uppercase text-xs transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
              {loading ? 'Memproses Pendaftaran...' : 'Daftarkan Kredensial'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase text-center">
              Sudah memiliki Otorisasi? <br className="md:hidden" />
              <Link href="/login" className="text-[#ffe227] hover:text-white transition-colors ml-2">Masuk ke Sistem</Link>
            </p>
            <Link href="/" className="text-slate-600 hover:text-white text-[9px] font-black tracking-[0.2em] uppercase transition-colors"> Kembali ke Beranda</Link>
          </div>
        </div>

      </div>
    </div>
  );
}