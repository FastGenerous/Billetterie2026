'use client';

import React, { useState } from 'react';
import carsData from '../data/cars.json';

export default function HomePage() {
  const [selectedCar, setSelectedCar] = useState(carsData[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [donationAmount, setDonationAmount] = useState(carsData[0].minDonation);
  const [loading, setLoading] = useState(false);

  const handleCarSelect = (car: typeof carsData[0]) => {
    setSelectedCar(car);
    setSelectedSlot('');
    setDonationAmount(car.minDonation);
  };

  const handleCheckout = async () => {
    if (!selectedSlot) {
      alert('Veuillez sélectionner un horaire de baptême.');
      return;
    }
    if (donationAmount < selectedCar.minDonation) {
      alert(`Le montant minimum du don pour ce véhicule est de ${selectedCar.minDonation} €.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carName: selectedCar.name,
          slot: selectedSlot,
          amount: donationAmount,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erreur lors de la redirection vers le paiement.');
      }
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Baptêmes de Piste Caritatifs
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Choisissez votre véhicule de sport, sélectionnez votre horaire et réalisez un don.
          L'intégralité des bénéfices soutient nos actions caritatives.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-slate-200">1. Choisissez un véhicule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {carsData.map((car) => (
            <div
              key={car.id}
              onClick={() => handleCarSelect(car)}
              className={`cursor-pointer rounded-xl overflow-hidden border-2 transition ${
                selectedCar.id === car.id
                  ? 'border-red-500 bg-slate-800 shadow-lg shadow-red-500/20'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
              }`}
            >
              <img src={car.imageUrl} alt={car.name} className="h-44 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg text-white">{car.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{car.description}</p>
                <p className="text-sm font-semibold text-red-400 mt-3">
                  Don min. : {car.minDonation} €
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
        <h2 className="text-xl font-bold mb-4 text-slate-200">
          2. Créneau & Don pour : <span className="text-red-400">{selectedCar.name}</span>
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Horaires disponibles le jour J :
          </label>
          <div className="flex flex-wrap gap-3">
            {selectedCar.slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  selectedSlot === slot
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Montant de votre don (€) - Minimum : {selectedCar.minDonation} €
          </label>
          <input
            type="number"
            min={selectedCar.minDonation}
            value={donationAmount}
            onChange={(e) => setDonationAmount(Number(e.target.value))}
            className="w-full max-w-xs bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
          />
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
        >
          {loading ? 'Redirection...' : `Valider et régler le don de ${donationAmount} €`}
        </button>
      </section>
    </main>
  );
}
