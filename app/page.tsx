'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import carsData from '../data/cars.json';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function HomePage() {
  const [selectedCar, setSelectedCar] = useState(carsData[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [donationAmount, setDonationAmount] = useState(carsData[0].minDonation);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Référence pour faire défiler la page automatiquement vers les créneaux
  const slotsSectionRef = useRef<HTMLDivElement>(null);

  // Charger les créneaux déjà réservés pour la voiture sélectionnée
  useEffect(() => {
    async function fetchBookedSlots() {
      const { data } = await supabase
        .from('reservations')
        .select('slot')
        .eq('car_id', selectedCar.id)
        .eq('status', 'confirmed');

      if (data) {
        setBookedSlots(data.map((r: any) => r.slot));
      }
    }
    fetchBookedSlots();
    setSelectedSlot('');
  }, [selectedCar]);

  const handleCarSelect = (car: typeof carsData[0]) => {
    setSelectedCar(car);
    setDonationAmount(car.minDonation);

    // Petit défilement fluide vers la sélection du créneau
    setTimeout(() => {
      slotsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  };

  const handleCheckout = async () => {
    if (!selectedSlot) {
      alert('Veuillez sélectionner un horaire de baptême.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: selectedCar.id,
          carName: selectedCar.name,
          slot: selectedSlot,
          amount: donationAmount,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Une erreur est survenue lors de la création de la réservation.');
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
          Réservez votre baptême en choisissant votre véhicule et votre horaire.
        </p>
      </header>

      {/* Sélection des véhicules */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-slate-200">
          1. Choisissez un véhicule <span className="text-sm font-normal text-slate-400">(Cliquez sur le modèle de votre choix)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          {carsData.map((car) => {
            const isSelected = selectedCar.id === car.id;

            return (
              <div
                key={car.id}
                onClick={() => handleCarSelect(car)}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 transform ${
                  isSelected
                    ? 'border-red-500 bg-slate-800 shadow-2xl shadow-red-500/30 scale-105 opacity-100 z-10'
                    : 'border-slate-800 bg-slate-900/60 opacity-50 grayscale hover:grayscale-0 hover:opacity-80 scale-95'
                }`}
              >
                <div className="relative">
                  <img
                    src={car.imageUrl}
                    alt={car.name}
                    className={`h-44 w-full object-cover transition-transform duration-300 ${
                      isSelected ? 'scale-110' : ''
                    }`}
                  />
                  {isSelected && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      Sélectionné
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    {car.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{car.description}</p>
                  <p className={`text-sm font-semibold mt-3 ${isSelected ? 'text-red-400' : 'text-slate-500'}`}>
                    Don min. : {car.minDonation} €
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sélection du créneau */}
      <section
        ref={slotsSectionRef}
        className="bg-slate-800 rounded-xl p-6 border-2 border-red-500/40 shadow-xl mb-8 transition-all"
      >
        <h2 className="text-xl font-bold mb-4 text-slate-200 flex items-center gap-2">
          <span>2. Créneau & Don pour :</span>
          <span className="text-red-400 underline decoration-red-500 underline-offset-4">
            {selectedCar.name}
          </span>
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Sélectionnez un horaire disponible :
          </label>
          <div className="flex flex-wrap gap-3">
            {selectedCar.slots.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              const isSlotSelected = selectedSlot === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isBooked}
                  onClick={() => !isBooked && setSelectedSlot(slot)}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isBooked
                      ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed line-through'
                      : isSlotSelected
                      ? 'bg-red-600 text-white ring-2 ring-red-400 scale-105 font-bold shadow-lg shadow-red-600/40'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                  }`}
                >
                  {slot} {isBooked ? '(Réservé)' : ''}
                </button>
              );
            })}
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
          disabled={loading || !selectedSlot}
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200 shadow-lg shadow-red-600/30"
        >
          {loading
            ? 'Redirection...'
            : selectedSlot
            ? `Valider le créneau de ${selectedSlot} (${donationAmount} €)`
            : 'Veuillez choisir un horaire ci-dessus'}
        </button>
      </section>
    </main>
  );
}
