"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  X,
  Grid3X3,
  List,
  Star,
  CheckCircle,
  Clock,
  Wrench,
  Zap,
  Sparkles,
  Hammer,
  Wind,
  Paintbrush,
  Filter,
} from "lucide-react";
import { useProviders, useCategories } from "@/hooks/useApi";
import { ProviderCard } from "@/components/ProviderCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Provider } from "@/types";

const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  plumbing: Wrench,
  electrical: Zap,
  cleaning: Sparkles,
  handyman: Hammer,
  hvac: Wind,
  painting: Paintbrush,
};

function ProviderGridCard({ provider }: { provider: Provider }) {
  return (
    <Link href={`/provider/${provider.id}`}>
      <Card className="p-5 hover:shadow-lg transition-all hover:-translate-y-1 h-full border-2 hover:border-[#f97316]">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Avatar className="w-14 h-14">
              <AvatarImage src={provider.avatar} alt={provider.name} />
              <AvatarFallback>{provider.name[0]}</AvatarFallback>
            </Avatar>
            {provider.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate text-base">
              {provider.name}
            </h3>
            <p className="text-sm text-gray-600 capitalize font-medium">
              {provider.category}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-gray-900">
                {provider.rating}
              </span>
              <span className="text-xs text-gray-500">
                ({provider.reviewCount})
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 text-[#f97316]" />
          <span className="font-medium">{provider.distance}</span>
          <span className="text-gray-300">•</span>
          <span>{provider.location}</span>
        </div>

        {provider.featured && (
          <Badge variant="warning" className="mb-3">
            <Clock className="w-3 h-3 mr-1" />
            Fast Response
          </Badge>
        )}

        <div className="flex items-center justify-end pt-3 border-t border-gray-200">
          <Button size="sm" className="font-bold">
            View & Book
          </Button>
        </div>
      </Card>
    </Link>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const queryParam = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [locationQuery, setLocationQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || "all",
  );
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(
    null,
  );
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");

  // Fetch data from backend
  const { categories, loading: categoriesLoading } = useCategories();
  const { providers: allProviders, loading: providersLoading } = useProviders({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    search: searchQuery || undefined,
    minRating: minRating > 0 ? minRating : undefined,
    verified: verifiedOnly || undefined,
    sortBy,
  });

  const filteredProviders = useMemo(() => {
    let filtered = [...allProviders];

    // Price filter (client-side since backend doesn't have it in the API yet)
    filtered = filtered.filter((p) => p.hourlyRate <= maxPrice);

    // Availability filter (client-side)
    if (availabilityFilter === "today") {
      filtered = filtered.filter((p) =>
        p.availability.some((a) => {
          const today = new Date().toISOString().split("T")[0];
          return a.date === today && a.times.some((t) => t.available);
        }),
      );
    }

    return filtered;
  }, [allProviders, maxPrice, availabilityFilter]);

  const activeFiltersCount = [
    minRating > 0,
    verifiedOnly,
    availabilityFilter,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setMinRating(0);
    setMaxPrice(200);
    setVerifiedOnly(false);
    setAvailabilityFilter(null);
    setSortBy("recommended");
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Inputs */}
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search services or providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}>
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <div className="flex-1 sm:max-w-[200px] flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm"
                />
              </div>
            </div>

            {/* View Toggle & Mobile Filter */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-orange-500">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Services
            </button>
            {categories.map((category) => {
              const Icon = categoryIcons[category.id] || Wrench;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 shrink-0">
            <Card className="p-6 sticky top-36">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Service Category Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Service Category
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedCategory === "all"
                        ? "bg-orange-50 border border-orange-200"
                        : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "all"}
                      onChange={() => handleCategoryChange("all")}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium">All Services</span>
                  </label>
                  {categories.map((category) => {
                    const Icon = categoryIcons[category.id] || Wrench;
                    return (
                      <label
                        key={category.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedCategory === category.id
                            ? "bg-orange-50 border border-orange-200"
                            : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => handleCategoryChange(category.id)}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <Icon className="w-4 h-4 text-[#f97316]" />
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="distance">Nearest</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[
                    { value: 0, label: "All Ratings" },
                    { value: 4.5, label: "4.5+ ⭐⭐⭐⭐⭐" },
                    { value: 4.0, label: "4.0+ ⭐⭐⭐⭐" },
                    { value: 3.5, label: "3.5+ ⭐⭐⭐" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        minRating === option.value
                          ? "bg-orange-50 border border-orange-200"
                          : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                      }`}
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === option.value}
                        onChange={() => setMinRating(option.value)}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Availability
                </label>
                <div className="space-y-2">
                  {[
                    { value: null, label: "Any time" },
                    { value: "today", label: "Available today" },
                    { value: "week", label: "This week" },
                  ].map((option) => (
                    <label
                      key={option.value || "any"}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        availabilityFilter === option.value
                          ? "bg-orange-50 border border-orange-200"
                          : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                      }`}
                    >
                      <input
                        type="radio"
                        name="availability"
                        checked={availabilityFilter === option.value}
                        onChange={() => setAvailabilityFilter(option.value)}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verified Only */}
              <div className="mb-6">
                <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Verified pros only</span>
                  </div>
                </label>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {filteredProviders.length}
                </span>{" "}
                {filteredProviders.length === 1 ? "provider" : "providers"}{" "}
                found
                {selectedCategory !== "all" && (
                  <span className="ml-1 capitalize">in {selectedCategory}</span>
                )}
              </p>

              {/* Quick Filters */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    verifiedOnly
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified
                </button>
                <button
                  onClick={() =>
                    setAvailabilityFilter(
                      availabilityFilter === "today" ? null : "today",
                    )
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    availabilityFilter === "today"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Today
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {minRating > 0 && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-gray-200"
                    onClick={() => setMinRating(0)}
                  >
                    {minRating}+ stars
                    <X className="w-3 h-3" />
                  </Badge>
                )}
                {verifiedOnly && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-gray-200"
                    onClick={() => setVerifiedOnly(false)}
                  >
                    Verified only
                    <X className="w-3 h-3" />
                  </Badge>
                )}
                {availabilityFilter && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-gray-200"
                    onClick={() => setAvailabilityFilter(null)}
                  >
                    {availabilityFilter === "today"
                      ? "Available today"
                      : "This week"}
                    <X className="w-3 h-3" />
                  </Badge>
                )}
              </div>
            )}

            {/* Loading State */}
            {(providersLoading || categoriesLoading) && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="p-4 animate-pulse">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </Card>
                ))}
              </div>
            )}

            {/* Results */}
            {!providersLoading &&
            !categoriesLoading &&
            filteredProviders.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No providers found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={resetFilters} variant="outline">
                  Clear all filters
                </Button>
              </Card>
            ) : !providersLoading ? (
              viewMode === "grid" ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredProviders.map((provider) => (
                    <ProviderGridCard key={provider.id} provider={provider} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProviders.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters & Sort</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Category
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <input
                      type="radio"
                      name="mobile-category"
                      checked={selectedCategory === "all"}
                      onChange={() => setSelectedCategory("all")}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="text-sm">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="mobile-category"
                        checked={
                          selectedCategory === (category.slug || category.id)
                        }
                        onChange={() =>
                          setSelectedCategory(category.slug || category.id)
                        }
                        className="w-4 h-4 text-orange-500"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="distance">Nearest</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[0, 4.5, 4.0, 3.5].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="mobile-rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="w-4 h-4 text-orange-500"
                      />
                      <span className="text-sm">
                        {rating === 0 ? "All Ratings" : `${rating}+ Stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Max Price: ${maxPrice}/hr
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              {/* Verified Only */}
              <div className="mb-6">
                <label className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm">Verified pros only</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={resetFilters}
                >
                  Clear All
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Show Results
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
