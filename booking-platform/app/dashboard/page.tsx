"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  User,
  Check,
  X,
  Loader2,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { bookingsApi } from "@/lib/api";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  service: string;
  date: string;
  time: string;
  status: string;
  totalAmount: number | null;
  serviceAddress: string;
  problemDescription: string;
  createdAt: string;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-purple-100 text-purple-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

interface BookingCardProps {
  booking: Booking;
  onStatusUpdate: (id: string, status: string) => void;
  isUpdating: boolean;
}

function BookingCard({
  booking,
  onStatusUpdate,
  isUpdating,
}: BookingCardProps) {
  const canConfirm = booking.status === "pending";
  const canStart = booking.status === "confirmed";
  const canComplete = booking.status === "in_progress";
  const canCancel = ["pending", "confirmed"].includes(booking.status);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {booking.customerName}
            </h3>
            <p className="text-sm text-gray-500">{booking.customerEmail}</p>
          </div>
        </div>
        <Badge className={getStatusColor(booking.status)}>
          {formatStatus(booking.status)}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(booking.date)}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{formatTime(booking.time)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{booking.serviceAddress}</span>
        </div>
        {booking.problemDescription && (
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {booking.problemDescription}
          </p>
        )}
        {booking.totalAmount && (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <DollarSign className="w-4 h-4" />
            <span>${booking.totalAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {canConfirm && (
          <Button
            size="sm"
            onClick={() => onStatusUpdate(booking.id, "confirmed")}
            disabled={isUpdating}
            className="flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            Confirm
          </Button>
        )}
        {canStart && (
          <Button
            size="sm"
            onClick={() => onStatusUpdate(booking.id, "in_progress")}
            disabled={isUpdating}
            className="flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            Start Job
          </Button>
        )}
        {canComplete && (
          <Button
            size="sm"
            onClick={() => onStatusUpdate(booking.id, "completed")}
            disabled={isUpdating}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-3 h-3" />
            Complete
          </Button>
        )}
        {canCancel && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusUpdate(booking.id, "cancelled")}
            disabled={isUpdating}
            className="flex items-center gap-1 text-red-600 hover:bg-red-50"
          >
            <X className="w-3 h-3" />
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Redirect if not authenticated or not a provider
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard");
    } else if (!authLoading && user && user.role !== "provider") {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Fetch provider bookings
  useEffect(() => {
    async function fetchBookings() {
      if (!isAuthenticated || user?.role !== "provider") return;

      try {
        setLoading(true);
        const response = await bookingsApi.getAll({ role: "provider" });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedBookings = response.bookings.map((b: any) => ({
          id: b.id,
          customerName: b.customer?.name || "Customer",
          customerEmail: b.customer?.email || "",
          service: b.provider?.businessName || "Service",
          date: b.date,
          time: b.time,
          status: b.status,
          totalAmount: b.totalAmount,
          serviceAddress: b.serviceAddress,
          problemDescription: b.problemDescription || "",
          createdAt: b.createdAt,
        }));
        setBookings(transformedBookings);
      } catch (err: any) {
        console.error("Fetch bookings error:", err);
        if (err.message === "Not a provider") {
          // Redirect to onboarding if provider profile doesn't exist
          router.push("/onboarding");
          return;
        }
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [isAuthenticated, user, router]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await bookingsApi.updateStatus(id, { status });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b)),
      );
    } catch (err) {
      console.error("Failed to update booking status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter bookings by tab
  const filteredBookings = useMemo(() => {
    if (activeTab === "all") return bookings;
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  // Stats
  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const inProgress = bookings.filter(
      (b) => b.status === "in_progress",
    ).length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const totalEarnings = bookings
      .filter((b) => b.status === "completed" && b.totalAmount)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return { pending, confirmed, inProgress, completed, totalEarnings };
  }, [bookings]);

  if (authLoading || (loading && isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "provider") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-linear-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-2">Provider Dashboard</h1>
          <p className="text-orange-100">
            Manage your bookings and track your business
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-700 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span className="text-2xl font-bold">{stats.pending}</span>
            </div>
            <p className="text-sm text-yellow-600">Pending</p>
          </Card>
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-2xl font-bold">{stats.confirmed}</span>
            </div>
            <p className="text-sm text-blue-600">Confirmed</p>
          </Card>
          <Card className="p-4 bg-purple-50 border-purple-200">
            <div className="flex items-center gap-2 text-purple-700 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-2xl font-bold">{stats.inProgress}</span>
            </div>
            <p className="text-sm text-purple-600">In Progress</p>
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-2xl font-bold">{stats.completed}</span>
            </div>
            <p className="text-sm text-green-600">Completed</p>
          </Card>
          <Card className="p-4 bg-orange-50 border-orange-200 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-orange-700 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-2xl font-bold">
                ${stats.totalEarnings.toFixed(0)}
              </span>
            </div>
            <p className="text-sm text-orange-600">Total Earnings</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Bookings List */}
        {error ? (
          <Card className="p-8 text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry
            </Button>
          </Card>
        ) : filteredBookings.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab === "all" ? "" : activeTab.replace(/_/g, " ")}{" "}
              bookings
            </h3>
            <p className="text-gray-500">
              {activeTab === "pending"
                ? "You'll see new booking requests here"
                : "No bookings found in this category"}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onStatusUpdate={handleStatusUpdate}
                isUpdating={updatingId === booking.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
