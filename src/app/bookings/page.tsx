// src/app/bookings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Booking } from '@/types';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api<Booking[]>('/bookings/me');
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      setCancellingId(id);
      setError('');
      await api(`/bookings/${id}/cancel`, { method: 'PATCH' });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: 'CANCELLED' } : b,
        ),
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCancellingId(null);
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
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your appointments
          </p>
        </div>
        <button
          onClick={fetchBookings}
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

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">You don’t have any bookings yet.</p>
          <button
            onClick={() => router.push('/slots')}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Browse available slots
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {formatDate(booking.slot.startTime)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Until {formatDate(booking.slot.endTime)}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'ACTIVE'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              {booking.status === 'ACTIVE' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  disabled={cancellingId === booking.id}
                  className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
                >
                  {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}