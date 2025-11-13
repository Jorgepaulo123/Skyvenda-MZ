import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  header?: boolean;
}

declare const Layout: React.FC<LayoutProps>;
export default Layout; 