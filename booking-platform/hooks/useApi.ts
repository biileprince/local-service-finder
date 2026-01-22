"use client";

import { useEffect, useState, useCallback } from "react";
import { categoriesApi, providersApi, bookingsApi } from "@/lib/api";
import { transformProvider, transformCategory } from "@/lib/transform";
import { Provider, Category } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoriesApi
      .getAll()
      .then((data) => {
        setCategories(data.categories.map(transformCategory));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { categories, loading, error };
}

export function useProviders(params?: {
  category?: string;
  search?: string;
  minRating?: number;
  verified?: boolean;
  featured?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    providersApi
      .getAll(params)
      .then((data) => {
        setProviders(data.providers.map(transformProvider));
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [
    params?.category,
    params?.search,
    params?.minRating,
    params?.verified,
    params?.featured,
    params?.sortBy,
    params?.page,
    params?.limit,
  ]);

  return { providers, total, loading, error };
}

export function useProvider(id: string) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    providersApi
      .getById(id)
      .then((data) => {
        setProvider(transformProvider(data.provider));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return { provider, loading, error };
}

// Booking type for frontend
export interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerRating: number;
  category: string;
  service: string;
  date: string;
  time: string;
  address: string;
  price: number;
  status: "upcoming" | "completed" | "cancelled";
  canCancel?: boolean;
  canReview?: boolean;
}

function transformBooking(backendBooking: any): Booking {
  const today = new Date();
  const bookingDate = new Date(backendBooking.date);
  const isUpcoming = bookingDate >= today;

  let status: "upcoming" | "completed" | "cancelled" = "upcoming";
  if (backendBooking.status === "cancelled") {
    status = "cancelled";
  } else if (backendBooking.status === "completed" || !isUpcoming) {
    status = "completed";
  }

  return {
    id: backendBooking.id,
    providerId: backendBooking.provider?.id || backendBooking.providerId,
    providerName: backendBooking.provider?.user?.name || "Service Provider",
    providerAvatar:
      backendBooking.provider?.user?.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=Provider`,
    providerRating: backendBooking.provider?.rating || 4.5,
    category:
      backendBooking.provider?.categories?.[0]?.category?.name || "Service",
    service: backendBooking.problemDescription || "Service",
    date: backendBooking.date,
    time: backendBooking.time || backendBooking.startTime,
    address: backendBooking.serviceAddress || backendBooking.address || "Address not specified",
    price: backendBooking.totalAmount || 0,
    status,
    canCancel: status === "upcoming" && backendBooking.status !== "cancelled",
    canReview: status === "completed" && !backendBooking.hasReview,
  };
}

export function useBookings(status?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookingsApi.getAll({ status });
      setBookings(data.bookings.map(transformBooking));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const cancelBooking = async (id: string) => {
    try {
      await bookingsApi.updateStatus(id, { status: "cancelled" });
      await fetchBookings();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking");
      return false;
    }
  };

  return { bookings, loading, error, refetch: fetchBookings, cancelBooking };
}
