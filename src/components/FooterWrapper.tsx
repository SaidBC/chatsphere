'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

const FooterWrapper = () => {
  const pathname = usePathname();
  
  // Don't render footer on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }
  
  return <Footer />;
};

export default FooterWrapper;
