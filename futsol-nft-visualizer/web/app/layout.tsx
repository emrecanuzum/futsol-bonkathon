import './global.css';
import { SolanaProvider } from '@/components/solana/solana-provider';
import { ReactQueryProvider } from './react-query-provider';
import HeaderComponent from '@/components/ui/header';
import { Metadata } from 'next';
import PreHeader from '@/components/ui/pre-header';

export const metadata: Metadata = {
  title: 'Futsol Game',
  description:
    "Compete, win & earn. Solana's next-gen fantasy football game. Glory is one transfer away.",
};

// const links: { label: string; path: string }[] = [
//   { label: 'Account', path: '/account' },
//   { label: 'Clusters', path: '/clusters' },
// ];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <SolanaProvider>
            <HeaderComponent />
            <PreHeader />
            {children}
            {/* <UiLayout links={links}>{children}</UiLayout> */}
          </SolanaProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
