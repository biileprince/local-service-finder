"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  DollarSign,
  Briefcase,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState("");
  const [specialties, setSpecialties] = useState("");

  // Categories from your seed data
  const categories = [
    "Plumbing",
    "Electrical",
    "Cleaning",
    "Handyman",
    "HVAC",
    "Painting",
    "Roofing",
    "Landscaping",
    "Carpentry",
    "Pest Control",
    "Appliance Repair",
    "Pool Service",
  ];

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "provider") {
      router.push("/");
      return;
    }
  }, [user, router]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedCategories.length === 0) {
      setError("Please select at least one category");
      return;
    }

    if (!location.trim()) {
      setError("Please enter your location");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/providers/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio: bio.trim() || null,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
          yearsExperience: parseInt(yearsExperience) || 0,
          location: location.trim(),
          categories: selectedCategories,
          specialties: specialties
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete onboarding");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("Onboarding error:", err);
      setError(err.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome aboard!
          </h1>
          <p className="text-gray-600">
            Your provider profile has been created successfully. Redirecting to
            your dashboard...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Provider Profile
          </h1>
          <p className="text-gray-600">
            Let's set up your profile so customers can find and book your
            services
          </p>
        </div>

        {error && (
          <Card className="p-4 bg-red-50 border-red-200 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bio */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold">About You</h2>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell customers about your experience, skills, and what makes you stand out..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={4}
            />
          </Card>

          {/* Categories */}
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">
                Service Categories *
              </h2>
              <p className="text-sm text-gray-600">
                Select all categories that apply to your services
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedCategories.includes(category)
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Or enter your own category:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g., Locksmith, Tutoring, Photography"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (
                      customCategory.trim() &&
                      !selectedCategories.includes(customCategory.trim())
                    ) {
                      setSelectedCategories([
                        ...selectedCategories,
                        customCategory.trim(),
                      ]);
                      setCustomCategory("");
                    }
                  }}
                  disabled={!customCategory.trim()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </Card>

          {/* Specialties */}
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">Specialties</h2>
              <p className="text-sm text-gray-600">
                List your specific skills (comma-separated, e.g., "Leak Repairs,
                Pipe Installation, Water Heaters")
              </p>
            </div>
            <input
              type="text"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder="Leak Repairs, Pipe Installation, Emergency Services"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </Card>

          {/* Experience */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-orange-600" />
              <label className="text-sm font-medium text-gray-700">
                Years of Experience
              </label>
            </div>
            <input
              type="number"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              placeholder="5"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </Card>

          {/* Location */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <label className="text-sm font-medium text-gray-700">
                Service Location *
              </label>
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco, CA"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => router.push("/")}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Skip for Now
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
