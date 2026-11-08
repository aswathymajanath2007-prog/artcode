import './globals.css';

export const metadata = {
  title: 'LOKA — Discover India beyond the map',
  description: 'A community-powered cultural discovery and personalised travel platform for India.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
