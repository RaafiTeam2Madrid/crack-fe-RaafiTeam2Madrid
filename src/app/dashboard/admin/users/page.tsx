'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3001/users');
      const data = await res.json();
      setUsers(data);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchUsers(); }, []);

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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tindakan ini tidak bisa dibatalkan. Hapus otorisasi untuk ${name}?`)) return;
    
    try {
      await fetch(`http://localhost:3001/users/${id}`, { method: 'DELETE' });
      
      // [INTEGRASI AUDIT LOG] - Catat pencabutan akses
      await sendAuditLog(
        'DELETE_USER', 
        id, 
        `Mencabut hak akses untuk pengguna: ${name}`
      );
      
      fetchUsers();
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus pengguna.");
    }
  };

  return (
    <div className="text-slate-200 font-sans min-h-full">
      
      {/* HEADER MANAJEMEN PENGGUNA */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-2">
            Otorisasi <span className="italic text-[#ffe227]">Pengguna.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
            Sistem Kendali Hak Akses EDRMS
          </p>
        </div>
        
        <button 
          className="px-8 py-4 bg-[#ffe227] hover:bg-yellow-400 text-black font-black rounded-2xl transition-all shadow-lg shadow-yellow-500/10 uppercase tracking-[0.2em] text-xs flex items-center gap-3 hover:-translate-y-1"
        >
          <span className="text-lg leading-none">+</span> Pendaftaran Kredensial Baru
        </button>
      </div>

      {/* KONTAINER DAFTAR PENGGUNA */}
      <div className="bg-[#1a1a1a] rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#ffe227]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col mt-4">
          {loading ? (
            <div className="py-20 text-center">
              <p className="font-serif text-xl italic tracking-widest text-[#ffe227] animate-pulse">Menarik data kredensial...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 bg-[#111111] rounded-3xl border border-dashed border-white/10">
              <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Tidak ada data pengguna ditemukan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-12 gap-6 px-6 pb-4 border-b border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                <div className="col-span-4">Identitas Personel</div>
                <div className="col-span-4">Alamat Email</div>
                <div className="col-span-2 text-center">Tingkat Akses</div>
                <div className="col-span-2 text-right">Tindakan</div>
              </div>

              {users.map((user) => {
                const isSuperAdmin = user.role?.toUpperCase() === 'ADMIN';
                const roleBadgeColor = isSuperAdmin 
                  ? 'bg-[#ffe227]/10 text-[#ffe227] border-[#ffe227]/30' 
                  : 'bg-[#2358d8]/10 text-[#2358d8] border-[#2358d8]/30';

                return (
                  <div key={user.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center p-6 bg-[#111111] border border-white/5 rounded-2xl hover:border-white/20 transition-all group shadow-inner">
                    <div className="md:col-span-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-black text-sm uppercase shadow-inner border border-white/5">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-base truncate">{user.name}</h3>
                      </div>
                    </div>

                    <div className="md:col-span-4">
                      <p className="text-slate-400 font-mono text-sm truncate">{user.email}</p>
                    </div>

                    <div className="md:col-span-2 flex md:justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${roleBadgeColor}`}>
                        {user.role || 'ARSIPARIS'}
                      </span>
                    </div>

                    <div className="md:col-span-2 flex md:justify-end">
                      <button 
                        onClick={() => handleDelete(user.id, user.name)} 
                        className="px-6 py-3 bg-[#1a1a1a] border border-slate-800 text-slate-500 hover:bg-[#eb3434] hover:text-white hover:border-[#eb3434] font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg"
                      >
                        Cabut Akses
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}