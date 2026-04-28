// src/components/auth/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-full text-left p-2 mt-8 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
    >
      Keluar (Logout)
    </button>
  );
}