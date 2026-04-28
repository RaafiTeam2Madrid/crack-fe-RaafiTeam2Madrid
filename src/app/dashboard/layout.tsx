'use client';

import LogoutButton from "@/components/auth/LogoutButton";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return '';
    };

    const role = getCookie('userRole');
    setUserRole(role.toUpperCase());
  }, []);

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊', allowedRoles: ['ADMIN', 'ARSIPARIS', 'STAFF'], hoverColor: 'group-hover:text-[#eb3434]', activeBg: 'bg-[#eb3434] text-white shadow-[0_0_15px_rgba(235,52,52,0.4)] border-[#eb3434]' },
    { name: 'Capture Arsip', href: '/dashboard/capture', icon: '📥', allowedRoles: ['ADMIN', 'ARSIPARIS'], hoverColor: 'group-hover:text-[#0a8270]', activeBg: 'bg-[#0a8270] text-white shadow-[0_0_15px_rgba(10,130,112,0.4)] border-[#0a8270]' },
    { name: 'Pencarian', href: '/dashboard/search', icon: '🔍', allowedRoles: ['ADMIN'], hoverColor: 'group-hover:text-[#ffe227]', activeBg: 'bg-[#ffe227] text-black shadow-[0_0_15px_rgba(255,226,39,0.4)] border-[#ffe227]' },
    { name: 'Daftar Arsip', href: '/dashboard/archives', icon: '📂', allowedRoles: ['ADMIN', 'ARSIPARIS', 'STAFF'], hoverColor: 'group-hover:text-[#2358d8]', activeBg: 'bg-[#2358d8] text-white shadow-[0_0_15px_rgba(35,88,216,0.4)] border-[#2358d8]' },
    { name: 'Penyusutan Arsip', href: '/dashboard/disposal', icon: '⏳', allowedRoles: ['ADMIN', 'ARSIPARIS'], hoverColor: 'group-hover:text-[#eb3434]', activeBg: 'bg-[#eb3434] text-white shadow-[0_0_15px_rgba(235,52,52,0.4)] border-[#eb3434]' },
  ];

  const adminItems = [
    { name: 'Manajemen Pengguna', href: '/dashboard/admin/users', icon: '👥', allowedRoles: ['ADMIN'], hoverColor: 'group-hover:text-[#ffe227]', activeBg: 'bg-[#ffe227] text-black shadow-[0_0_15px_rgba(255,226,39,0.4)] border-[#ffe227]' },
    { name: 'Audit Log Sistem', href: '/dashboard/admin/audit', icon: '📜', allowedRoles: ['ADMIN'], hoverColor: 'group-hover:text-[#ffe227]', activeBg: 'bg-[#ffe227] text-black shadow-[0_0_15px_rgba(255,226,39,0.4)] border-[#ffe227]' },
    { name: 'Jadwal Retensi', href: '/dashboard/admin/retention', icon: '⚖️', allowedRoles: ['ADMIN'], hoverColor: 'group-hover:text-[#8b5cf6]', activeBg: 'bg-[#8b5cf6] text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] border-[#8b5cf6]' },
  ];

  const filteredOperasional = menuItems.filter(item => item.allowedRoles.includes(userRole));
  const filteredAdmin = adminItems.filter(item => item.allowedRoles.includes(userRole));

  const renderLink = (item: any) => {
    const isActive = pathname === item.href;
    return (
      <Link key={item.href} href={item.href}
        className={`flex items-center gap-4 px-4 py-3 mx-4 rounded-2xl transition-all duration-300 group ${
          isActive ? 'bg-[#1a1a1a] shadow-lg border border-white/10' : 'hover:bg-white/5 border border-transparent'
        }`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${
          isActive ? `${item.activeBg} border scale-110` : `bg-[#111111] border border-white/5 text-slate-500 ${item.hoverColor} group-hover:scale-110`
        }`}>
          {item.icon}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors mt-0.5 ${
          isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
        }`}>
          {item.name}
        </span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-[#111111] overflow-hidden font-sans selection:bg-[#ffe227] selection:text-black">
      
      {/* Sidebar - Ramping & Tanpa Scrollbar Visual */}
      <aside className="w-[300px] bg-[#111111] border-r border-white/5 flex flex-col relative z-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="pt-10 pb-8 px-8">
          <div className="text-4xl font-serif italic text-white lowercase tracking-tighter mb-1">(edrms<span className="text-[#eb3434]">.</span>)</div>
          <p className="text-slate-500 text-[9px] font-black tracking-[0.3em] uppercase">ICA Standard</p>
        </div>
        
        {/* Trik CSS Sembunyikan Scrollbar */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          <div className="space-y-1">
            <p className="px-8 text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3">Operasional</p>
            {filteredOperasional.map(renderLink)}
          </div>

          {filteredAdmin.length > 0 && (
            <div className="space-y-1 pt-4 border-t border-white/5 mx-4">
              <p className="px-4 text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3 mt-2">Administrator</p>
              {filteredAdmin.map(renderLink)}
            </div>
          )}

        </nav>

        {/* Footer Sidebar Premium */}
        <div className="p-6 border-t border-white/5">
          <div className="mb-3 px-4 py-3 bg-[#1a1a1a] border border-white/5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Sesi Aktif</p>
              <p className="text-[10px] font-bold text-[#ffe227]">{userRole || 'MEMUAT...'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-black text-xs uppercase shadow-inner border border-white/5">
              {userRole ? userRole.charAt(0) : '?'}
            </div>
          </div>
          
          {/* Wadah untuk Logout Button */}
          <div className="bg-[#1a1a1a] p-1.5 rounded-2xl border border-white/5 shadow-inner">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Area - Tanpa Scrollbar Visual */}
      <main className="flex-1 overflow-y-auto bg-[#111111] relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="min-h-full p-8 md:p-10">
          {children}
        </div>
      </main>
      
    </div>
  );
}