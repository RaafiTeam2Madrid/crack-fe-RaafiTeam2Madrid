'use client';

import { useState, useEffect } from 'react';

// Struktur Data diselaraskan persis dengan user.entity.ts kamu
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // Kolom di bawah ini opsional karena belum ada di entity database
  status?: string; 
  lastLogin?: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Langsung menelepon controller backend aslimu!
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`); 
        
        if (res.ok) {
          const data = await res.json();
          // Sabuk pengaman: Pastikan responsnya adalah array
          if (Array.isArray(data)) {
            setUsers(data);
          } else {
            setUsers([]);
          }
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Gagal mengambil data pengguna:', error);
        setUsers([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">
            Manajemen <span className="italic text-[#2358d8]">Pengguna.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
            Kontrol Akses dan Otorisasi Sistem
          </p>
        </div>
        <button className="px-6 py-4 bg-[#2358d8] hover:bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/50 hover:-translate-y-1">
          + Registrasi Pengguna Baru
        </button>
      </div>

      {/* Kontainer Daftar Pengguna */}
      <div className="bg-[#1a1a1a] rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Garis Aksen Biru */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2358d8] via-[#111111] to-[#2358d8] opacity-50"></div>

        <div className="p-8 space-y-6">
          
          {/* Header Kolom (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">
            <div className="col-span-4">Profil Pengguna</div>
            <div className="col-span-3">Peran (Role)</div>
            <div className="col-span-2 text-center">Status Akses</div>
            <div className="col-span-2 text-right">Aktivitas Terakhir</div>
            <div className="col-span-1 text-right">Aksi</div>
          </div>

          {/* Daftar Pengguna */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-500 font-mono text-xs uppercase tracking-widest animate-pulse">
                Menarik data dari database...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-16 bg-[#111111] rounded-[1.5rem] border border-dashed border-slate-800">
                <span className="text-4xl block mb-4">👥</span>
                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Belum ada data pengguna yang ditarik.</p>
              </div>
            ) : (
              users.map((user) => {
                const isSuperAdmin = user.role?.toUpperCase() === 'ADMIN';
                const roleBadgeColor = isSuperAdmin 
                  ? 'bg-[#ffe227]/10 text-[#ffe227] border-[#ffe227]/30' 
                  : 'bg-[#2358d8]/10 text-[#2358d8] border-[#2358d8]/30';

                return (
                  <div key={user.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center p-6 bg-[#111111] border border-white/5 rounded-2xl hover:border-white/20 transition-all shadow-inner group">
                    
                    {/* Profil Pengguna */}
                    <div className="md:col-span-4 flex items-center gap-4">
                      {/* Avatar Inisial */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-serif text-lg border ${isSuperAdmin ? 'bg-[#ffe227]/20 text-[#ffe227] border-[#ffe227]/50' : 'bg-slate-800 text-slate-300 border-slate-600'}`}>
                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-white font-bold text-sm truncate">{user.name}</p>
                        <p className="text-slate-500 text-[10px] font-mono mt-0.5 truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Role / Peran */}
                    <div className="md:col-span-3">
                      <span className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest inline-block ${roleBadgeColor}`}>
                        {user.role}
                      </span>
                    </div>

                    {/* Status Akses (Visual Fallback karena kolom belum ada di DB) */}
                    <div className="md:col-span-2 text-left md:text-center">
                      <span className="flex items-center justify-start md:justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0a8270] shadow-[0_0_8px_rgba(10,130,112,0.8)]"></span>
                        <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">
                          AKTIF
                        </span>
                      </span>
                    </div>

                    {/* Aktivitas Terakhir (Visual Fallback) */}
                    <div className="md:col-span-2 text-left md:text-right">
                      <p className="text-slate-500 text-[10px] font-mono uppercase">
                        Terdata di Sistem
                      </p>
                    </div>

                    {/* Aksi (Bisa disambungkan ke fungsi Delete nanti) */}
                    <div className="md:col-span-1 flex justify-end gap-2">
                      <button className="w-8 h-8 rounded-lg bg-black hover:bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5 transition-colors" title="Edit Pengguna">
                        ✏️
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}