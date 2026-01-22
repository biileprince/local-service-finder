"use client";

import { notFound } from "next/navigation";
import {
  Star,
  MapPin,
  Phone,
  CheckCircle,
  Briefcase,
  Clock,
  Shield,
  MessageSquare,
  Share2,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BookingWidget } from "@/components/BookingWidget";
import { BookingModal } from "@/components/BookingModal";
import { useState, use } from "react";
import Link from "next/link";
import { useBookingStore } from "@/store/booking";
import { useProvider } from "@/hooks/useApi";

type TabType = "overview" | "reviews" | "about";

export default function ProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { provider, loading, error } = useProvider(resolvedParams.id);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const setSelectedProvider = useBookingStore(
    (state) => state.setSelectedProvider,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading provider details...</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    notFound();
  }

  const handleBookClick = () => {
    setSelectedProvider(provider.id);
    setShowBookingModal(true);
  };

  const tabs = [
    { key: "overview" as TabType, label: "Overview" },
    { key: "reviews" as TabType, label: `Reviews (${provider.reviewCount})` },
    { key: "about" as TabType, label: "About" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/search"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to results</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className={
                  isFavorite
                    ? "text-red-500 border-red-200 hover:bg-red-50"
                    : ""
                }
              >
                <Heart
                  className={`w-4 h-4 mr-1.5 ${isFavorite ? "fill-red-500" : ""}`}
                />
                {isFavorite ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1.5" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Header Card */}
            <Card className="p-6 overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative shrink-0">
                  <Avatar className="w-28 h-28 rounded-2xl">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback className="text-2xl rounded-2xl">
                      {provider.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {provider.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg">
                      <CheckCircle className="text-blue-500 w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {provider.name}
                      </h1>
                      <p className="text-gray-500 capitalize mb-2">
                        {provider.category} Professional
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {provider.location} • {provider.distance}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                        <Star className="w-4 h-4 text-green-600 fill-green-600" />
                        <span className="font-semibold text-green-700">
                          {provider.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {provider.reviewCount} reviews
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {provider.verified && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified Pro
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="bg-purple-50 text-purple-700"
                    >
                      <Briefcase className="w-3 h-3 mr-1" />
                      {provider.yearsExperience} Years Experience
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-green-50 text-green-700"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      Licensed & Insured
                    </Badge>
                    {provider.featured && (
                      <Badge variant="warning">
                        <Clock className="w-3 h-3 mr-1" />
                        Fast Response
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
                <Button variant="outline" className="flex-1 sm:flex-none gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">{provider.phone}</span>
                  <span className="sm:hidden">Call</span>
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </Button>
              </div>
            </Card>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b-2 border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-[#f97316] text-[#f97316]"
                      : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Gallery */}
                <Card className="p-6 border-2 border-gray-200">
                  <h2 className="font-bold text-xl mb-4 text-gray-900">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      "photo-1581578731548-c64695cc6952", // Tools/plumbing
                      "photo-1621905251189-08b45d6a269e", // Construction work
                      "photo-1504307651254-35680f356dfd", // Electrical work
                      "photo-1581092918056-0c4c3acd3789", // Handyman tools
                      "photo-1581092160562-40aa08e78837", // Home repair
                      "photo-1585128903994-c72b2b8c3f23", // Professional work
                    ].map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-xl bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group relative"
                      >
                        <img
                          src={`https://images.unsplash.com/${photo}?w=400&h=400&fit=crop&auto=format`}
                          alt={`Work sample ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Services & Specialties */}
                <Card className="p-6 border-2 border-gray-200">
                  <h2 className="font-bold text-xl mb-4 text-gray-900">
                    Specialties
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {provider.specialties.map((specialty, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-[#fff7ed] rounded-xl border border-[#f97316]/20"
                      >
                        <CheckCircle
                          className="w-5 h-5 text-[#f97316] shrink-0"
                          strokeWidth={2.5}
                        />
                        <span className="text-sm font-bold text-gray-900">
                          {specialty}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent Reviews Preview */}
                <Card className="p-6 border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-xl text-gray-900">
                      Recent Reviews
                    </h2>
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className="text-sm font-bold text-[#f97316] hover:text-[#ea580c]"
                    >
                      See all →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {provider.reviews.slice(0, 2).map((review) => (
                      <div
                        key={review.id}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={review.userAvatar}
                              alt={review.userName}
                            />
                            <AvatarFallback className="font-bold">
                              {review.userName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-sm text-gray-900">
                                {review.userName}
                              </h4>
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-bold text-gray-900">
                                  {review.rating}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2 font-medium">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "reviews" && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg">
                    All Reviews ({provider.reviewCount})
                  </h2>
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-green-600 fill-green-600" />
                    <span className="font-semibold text-green-700">
                      {provider.rating}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {provider.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={review.userAvatar}
                            alt={review.userName}
                          />
                          <AvatarFallback>{review.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{review.userName}</h4>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 text-yellow-500 fill-yellow-500"
                                  />
                                ),
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            {new Date(review.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "about" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="font-semibold text-lg mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {provider.bio}
                  </p>
                </Card>

                <Card className="p-6">
                  <h2 className="font-semibold text-lg mb-4">Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Experience</p>
                      <p className="font-semibold">
                        {provider.yearsExperience} years
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="font-semibold">{provider.location}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Service Area</p>
                      <p className="font-semibold">
                        Within {provider.distance}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <p className="font-semibold capitalize">
                        {provider.category}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingWidget
                providerId={provider.id}
                availability={provider.availability}
                onBookClick={handleBookClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        provider={provider}
        open={showBookingModal}
        onOpenChange={setShowBookingModal}
      />
    </div>
  );
}
