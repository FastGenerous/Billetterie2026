import './globals.css';

export const metadata = {
  title: 'Billetterie Fast & Generous',
  description: 'Réservation de baptêmes caritatifs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
