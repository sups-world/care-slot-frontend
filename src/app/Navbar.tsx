// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const linkClass = (path: string) =>
    `text-sm font-medium transition ${
      pathname === path
        ? 'text-blue-600'
        : 'text-gray-600 hover:text-gray-900'
    }`;

  return (
    <nav className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/slots" className="font-bold text-lg text-gray-900">
          CareSlot
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/slots" className={linkClass('/slots')}>
            AvailableSlots
          </Link>
          <Link href="/bookings" className={linkClass('/bookings')}>
            My Bookings
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}