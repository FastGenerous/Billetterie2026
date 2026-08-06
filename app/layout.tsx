import React from 'react';

export const metadata = {
  title: 'Billetterie Caritative Automobile',
  description: 'Réservez votre baptême passager et soutenez notre cause.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-900 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
