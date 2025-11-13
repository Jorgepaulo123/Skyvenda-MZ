import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Menu</h2>
          <div className="space-y-1">
            <Link
              href="/overview"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              <LayoutDashboard className="h-4 w-4" />
              Visão Geral
            </Link>
            {/* ... outros links ... */}
          </div>
        </div>
      </div>
    </div>
  );
}