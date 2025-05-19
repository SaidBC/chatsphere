'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

const HeaderWrapper = () => {
  const pathname = usePathname();
  
  // Don't render header on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }
  
  return <Header />;
};

export default HeaderWrapper;
