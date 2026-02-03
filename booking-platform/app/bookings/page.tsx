"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Phone,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useBookings, Booking } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

const statusConfig: Record<
  BookingStatus,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: AlertCircle,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-purple-100 text-purple-700",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateStr === today.toISOString().split("T")[0]) {
    return "Today";
  }
  if (dateStr === tomorrow.toISOString().split("T")[0]) {
    return "Tomorrow";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function BookingCard({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel?: (id: string) => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const status =
    statusConfig[booking.status as BookingStatus] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Provider Info */}
        <div className="flex items-start gap-4 flex-1">
          <Link href={`/provider/${booking.providerId}`}>
            <Avatar className="w-14 h-14">
              <AvatarImage
                src={booking.providerAvatar}
                alt={booking.providerName}
              />
              <AvatarFallback>{booking.providerName[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link
                  href={`/provider/${booking.providerId}`}
                  className="font-semibold text-gray-900 hover:text-orange-600"
                >
                  {booking.providerName}
                </Link>
                <p className="text-sm text-gray-500 capitalize">
                  {booking.service} • {booking.category}
                </p>
              </div>
              <Badge className={status.color}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDate(booking.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="truncate">{booking.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l sm:pl-4 border-gray-100">
          <div className="text-right">
            <p className="text-xs text-gray-500">Estimated</p>
            <p className="text-lg font-semibold">${booking.price}</p>
          </div>

          <div className="flex items-center gap-2">
            {booking.status === "pending" && (
              <>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Message</span>
                </Button>
              </>
            )}

            {(booking.status === "confirmed" ||
              booking.status === "in_progress") && (
              <>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Message</span>
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Call</span>
                </Button>
              </>
            )}

            {booking.status === "completed" && booking.canReview && (
              <Button size="sm" className="gap-1.5">
                <Star className="w-4 h-4" />
                <span>Leave Review</span>
              </Button>
            )}

            {booking.status === "completed" && !booking.canReview && (
              <Link href={`/provider/${booking.providerId}`}>
                <Button size="sm" variant="outline">
                  Book Again
                </Button>
              </Link>
            )}

            {booking.status === "cancelled" && (
              <Link href={`/provider/${booking.providerId}`}>
                <Button size="sm" variant="outline">
                  Rebook
                </Button>
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <Link
                    href={`/bookings/${booking.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/provider/${booking.providerId}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    View Provider
                  </Link>
                  {booking.canCancel && (
                    <button
                      onClick={() => onCancel?.(booking.id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { bookings, loading, error, cancelBooking, refetch } = useBookings();
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push("/login?redirect=/bookings");
    return null;
  }

  const filteredBookings = useMemo(() => {
    if (activeTab === "all") return bookings;
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;
  const inProgressCount = bookings.filter(
    (b) => b.status === "in_progress",
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed",
  ).length;
  const cancelledCount = bookings.filter(
    (b) => b.status === "cancelled",
  ).length;

  const handleCancel = async (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      setCancellingId(id);
      await cancelBooking(id);
      setCancellingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-500 mt-1">
                Manage your service appointments
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                )}
                Refresh
              </Button>
              <Link href="/search">
                <Button>Book New Service</Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-700">
                {pendingCount}
              </p>
              <p className="text-sm text-yellow-600">Pending</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">
                {confirmedCount}
              </p>
              <p className="text-sm text-blue-600">Confirmed</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-700">
                {inProgressCount}
              </p>
              <p className="text-sm text-purple-600">In Progress</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-700">
                {completedCount}
              </p>
              <p className="text-sm text-green-600">Completed</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-700">
                {cancelledCount}
              </p>
              <p className="text-sm text-gray-600">Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All", count: bookings.length },
            { key: "pending", label: "Pending", count: pendingCount },
            { key: "confirmed", label: "Confirmed", count: confirmedCount },
            {
              key: "in_progress",
              label: "In Progress",
              count: inProgressCount,
            },
            { key: "completed", label: "Completed", count: completedCount },
            { key: "cancelled", label: "Cancelled", count: cancelledCount },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as BookingStatus | "all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === "all"
                ? "You haven't made any bookings yet."
                : `You don't have any ${activeTab} bookings.`}
            </p>
            <Link href="/search">
              <Button>Find a Service Provider</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Need help with a booking?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Our support team is available 24/7 to assist you with any
                questions or issues regarding your bookings.
              </p>
              <div className="flex gap-3 mt-4">
                <Button size="sm" variant="outline">
                  Contact Support
                </Button>
                <Button size="sm" variant="ghost">
                  View FAQs
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
