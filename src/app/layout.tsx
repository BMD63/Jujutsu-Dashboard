import { Providers } from './providers';
import { ToastProvider } from './components/Toaster';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          {children}
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}