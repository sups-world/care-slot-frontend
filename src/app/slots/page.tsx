// src/app/slots/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Slot } from '@/types';

export default function SlotsPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  // Replace with your real seeded provider ID
  const PROVIDER_ID = 'YOUR_PROVIDER_ID_HERE';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api<Slot[]>(`/providers/${PROVIDER_ID}/slots`);
      setSlots(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (slotId: string) => {
    try {
      setBookingId(slotId);
      setSuccess('');
      setError('');
      await api('/bookings', {
        method: 'POST',
        body: JSON.stringify({ slotId }),
      });
      setSuccess('Slot booked successfully!');
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBookingId(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Slots</h1>
          <p className="text-sm text-gray-500 mt-1">
            Book an appointment with the provider
          </p>
        </div>
        <button
          onClick={fetchSlots}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading slots...</div>
      ) : slots.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No available slots at the moment.</p>
          <button
            onClick={fetchSlots}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Check again
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:border-blue-200 transition"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {formatDate(slot.startTime)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Until {formatDate(slot.endTime)}
                </p>
              </div>

              <button
                onClick={() => handleBook(slot.id)}
                disabled={bookingId === slot.id}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {bookingId === slot.id ? 'Booking...' : 'Book Slot'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}