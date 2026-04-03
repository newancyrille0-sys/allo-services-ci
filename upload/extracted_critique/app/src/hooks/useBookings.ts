import { useState, useEffect, useCallback } from 'react';
import type { Booking } from '@/types';
import {
  getBookings,
  saveBooking,
  getBookingsByClient,
  getBookingsByProvider,
  generateId,
  getCurrentUser
} from '@/lib/storage';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedBookings = getBookings();
    setBookings(loadedBookings);
    setIsLoading(false);
  }, []);

  const createBooking = useCallback((bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): { success: boolean; message: string; booking?: Booking } => {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, message: 'Vous devez être connecté pour faire une réservation.' };
    }

    const newBooking: Booking = {
      ...bookingData,
      id: generateId(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    saveBooking(newBooking);
    setBookings(prev => [...prev, newBooking]);

    return { 
      success: true, 
      message: 'Réservation créée avec succès ! Le prestataire vous contactera pour confirmer.',
      booking: newBooking
    };
  }, []);

  const cancelBooking = useCallback((bookingId: string): { success: boolean; message: string } => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      return { success: false, message: 'Réservation non trouvée.' };
    }

    if (booking.status === 'completed') {
      return { success: false, message: 'Impossible d\'annuler une réservation terminée.' };
    }

    booking.status = 'cancelled';
    saveBooking(booking);
    setBookings(prev => prev.map(b => b.id === bookingId ? booking : b));

    return { success: true, message: 'Réservation annulée.' };
  }, [bookings]);

  const confirmBooking = useCallback((bookingId: string): { success: boolean; message: string } => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      return { success: false, message: 'Réservation non trouvée.' };
    }

    booking.status = 'confirmed';
    saveBooking(booking);
    setBookings(prev => prev.map(b => b.id === bookingId ? booking : b));

    return { success: true, message: 'Réservation confirmée.' };
  }, [bookings]);

  const completeBooking = useCallback((bookingId: string): { success: boolean; message: string } => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      return { success: false, message: 'Réservation non trouvée.' };
    }

    booking.status = 'completed';
    booking.completedAt = new Date().toISOString();
    saveBooking(booking);
    setBookings(prev => prev.map(b => b.id === bookingId ? booking : b));

    return { success: true, message: 'Réservation marquée comme terminée.' };
  }, [bookings]);

  const refreshBookings = useCallback(() => {
    setIsLoading(true);
    const loadedBookings = getBookings();
    setBookings(loadedBookings);
    setIsLoading(false);
  }, []);

  return {
    bookings,
    isLoading,
    createBooking,
    cancelBooking,
    confirmBooking,
    completeBooking,
    refreshBookings
  };
};

export const useClientBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const loadedBookings = getBookingsByClient(user.id);
      setBookings(loadedBookings);
    }
    setIsLoading(false);
  }, []);

  const refresh = useCallback(() => {
    const user = getCurrentUser();
    if (user) {
      const loadedBookings = getBookingsByClient(user.id);
      setBookings(loadedBookings);
    }
  }, []);

  return {
    bookings,
    isLoading,
    refresh
  };
};

export const useProviderBookings = (providerId: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (providerId) {
      const loadedBookings = getBookingsByProvider(providerId);
      setBookings(loadedBookings);
      setIsLoading(false);
    }
  }, [providerId]);

  const refresh = useCallback(() => {
    if (providerId) {
      const loadedBookings = getBookingsByProvider(providerId);
      setBookings(loadedBookings);
    }
  }, [providerId]);

  return {
    bookings,
    isLoading,
    refresh
  };
};
