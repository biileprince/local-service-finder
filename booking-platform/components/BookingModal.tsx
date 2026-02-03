"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, DollarSign, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/store/booking";
import { Provider } from "@/types";
import { bookingsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface BookingModalProps {
  provider: Provider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({
  provider,
  open,
  onOpenChange,
}: BookingModalProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    selectedDate,
    selectedTime,
    serviceAddress,
    problemDescription,
    setServiceAddress,
    setProblemDescription,
    resetBooking,
  } = useBookingStore();

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/provider/${provider.id}`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await bookingsApi.create({
        providerId: provider.id,
        date: selectedDate || new Date().toISOString().split("T")[0],
        time: selectedTime || "9:00 AM",
        serviceAddress: serviceAddress,
        problemDescription: problemDescription,
      });

      setShowSuccess(true);

      // Show success message for 2 seconds then close and reset
      setTimeout(() => {
        setShowSuccess(false);
        onOpenChange(false);
        resetBooking();
        router.push("/bookings");
      }, 2000);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create booking. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isFormValid =
    serviceAddress.trim() !== "" && problemDescription.trim() !== "";

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-md text-center bg-white"
          onClose={() => onOpenChange(false)}
        >
          <div className="py-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-200">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="font-display font-bold text-2xl mb-2 text-gray-900">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 font-medium">
              {provider.name} will contact you shortly to confirm the
              appointment.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white"
        onClose={() => onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Confirm Your Booking
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Review your booking details and provide additional information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Booking Summary */}
          <div className="bg-[#fff7ed] rounded-xl p-5 space-y-3 border-2 border-[#f97316]/20">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {provider.name}
                </h4>
                <Badge variant="success" className="text-xs font-bold">
                  {provider.rating} ⭐ Rated
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 border-[#f97316]/20">
              <div className="flex items-center gap-2 text-sm">
                <Calendar
                  className="w-5 h-5 text-[#f97316]"
                  strokeWidth={2.5}
                />
                <span className="font-bold text-gray-900">
                  {selectedDate ? formatDate(selectedDate) : "Not selected"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-5 h-5 text-[#f97316]" strokeWidth={2.5} />
                <span className="font-bold text-gray-900">
                  {selectedTime || "Not selected"}
                </span>
              </div>
            </div>
          </div>

          {/* Service Address */}
          <div>
            <label className="text-sm font-bold mb-2 block text-gray-900">
              Service Address *
            </label>
            <Input
              placeholder="Enter the address where service is needed"
              value={serviceAddress}
              onChange={(e) => setServiceAddress(e.target.value)}
              className="border-2 focus:border-[#f97316] focus:ring-[#f97316]"
            />
          </div>

          {/* Problem Description */}
          <div>
            <label className="text-sm font-bold mb-2 block text-gray-900">
              Problem Description *
            </label>
            <Textarea
              placeholder="Describe the issue or service you need in detail..."
              rows={4}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="border-2 focus:border-[#f97316] focus:ring-[#f97316]"
            />
            <p className="text-xs text-gray-600 mt-2 font-medium">
              Be specific to help the provider prepare appropriate tools and
              materials
            </p>
          </div>

          {/* Additional Info */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-900 font-medium">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900 font-medium">
              <strong className="font-bold">Note:</strong> This is a booking
              request. {provider.name} will contact you to confirm the
              appointment. You can discuss and agree on pricing directly with
              the provider.
            </p>
          </div>
        </div>

        <DialogFooter>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-2 font-bold"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBooking}
              disabled={!isFormValid || isSubmitting}
              className="flex-1 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold shadow-lg"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Confirm Booking
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
