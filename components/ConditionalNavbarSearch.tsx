'use client';

import { usePathname } from 'next/navigation';
import NavbarSearch from './NavbarSearch';

export default function ConditionalNavbarSearch() {
  const pathname = usePathname();
  
  // Only show search bar on non-homepage pages
  const showSearch = pathname !== '/';
  
  if (!showSearch) {
    return null;
  }

  return (
    <>
      {/* Desktop search bar */}
      <div className="hidden md:block flex-1 max-w-md mx-8">
        <NavbarSearch />
      </div>
      
      {/* Mobile search button */}
      <div className="md:hidden">
        <NavbarSearch />
      </div>
    </>
  );
}