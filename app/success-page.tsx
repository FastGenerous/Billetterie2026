import React from 'react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="max-w-md mx-auto my-20 p-8 bg-slate-800 rounded-xl text-center border border-slate-700">
      <h1 className="text-3xl font-extrabold text-green-400 mb-4">Réservation Confirmée !</h1>
      <p className="text-slate-300 mb-6">
        Merci pour votre don caritatif. Un e-mail de confirmation contenant votre billet d'accès vous a été envoyé.
      </p>
      <p className="text-sm text-slate-400 mb-8">
        Veuillez présenter votre e-mail de confirmation à l'accueil le jour de l'événement.
      </p>
      <Link
        href="/"
        className="inline-block bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-6 rounded-lg transition"
      >
        Retour à l'accueil
      </Link>
    </main>
  );
}
