// Transform backend data to frontend format

import { Provider, TimeSlot, Review, Category } from "@/types";

// Convert 24-hour time (09:00) to 12-hour format (9:00 AM)
function convertTo12Hour(time24: string): string {
  const [hours, minutes] = time24.split(":");
  let hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";

  if (hour > 12) {
    hour -= 12;
  } else if (hour === 0) {
    hour = 12;
  }

  return `${hour}:${minutes} ${ampm}`;
}

export function transformProvider(backendProvider: any): Provider {
  // Generate dates for next 7 days
  const generateAvailability = (): TimeSlot[] => {
    const availability: TimeSlot[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      availability.push({
        date: dateStr,
        times: [
          { time: "9:00 AM", available: true, isFastest: i === 0 },
          { time: "10:00 AM", available: true },
          { time: "11:00 AM", available: true },
          { time: "12:00 PM", available: true },
          { time: "1:00 PM", available: true },
          { time: "2:00 PM", available: true },
          { time: "3:00 PM", available: true },
          { time: "4:00 PM", available: true },
          { time: "5:00 PM", available: true },
        ],
      });
    }

    return availability;
  };

  // Transform availability from backend format to frontend format
  const availability: TimeSlot[] =
    backendProvider.availability?.length > 0
      ? backendProvider.availability.map((avail: any) => ({
          date: avail.date,
          times: (avail.times || avail.timeSlots || []).map((slot: any, index: number) => ({
            time: slot.time.includes(':') && !slot.time.includes('AM') && !slot.time.includes('PM') 
              ? convertTo12Hour(slot.time) 
              : slot.time,
            available: slot.available,
            isFastest: index === 0 && slot.available,
          })),
        }))
      : generateAvailability();

  // Transform reviews
  const reviews: Review[] =
    backendProvider.reviews?.map((review: any) => ({
      id: review.id,
      userName: review.user.name,
      userAvatar:
        review.user.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user.name}`,
      rating: review.rating,
      date: new Date(review.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      comment: review.comment,
    })) || [];

  return {
    id: backendProvider.id,
    name: backendProvider.name,
    avatar:
      backendProvider.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${backendProvider.name}`,
    category:
      backendProvider.category ||
      backendProvider.categories?.[0]?.name ||
      "General",
    hourlyRate: backendProvider.hourlyRate,
    rating: backendProvider.rating || 0,
    reviewCount: backendProvider.reviewCount || 0,
    location: backendProvider.location,
    distance: backendProvider.distance || "0 mi",
    bio: backendProvider.bio || "",
    verified: backendProvider.verified || false,
    featured: backendProvider.featured || false,
    availability,
    reviews,
    phone: backendProvider.phone || "",
    yearsExperience: backendProvider.yearsExperience || 0,
    specialties:
      backendProvider.specialties?.map((s: any) => s.specialty || s) || [],
  };
}

export function transformCategory(backendCategory: any): Category {
  // Map category names to icon names
  const iconMap: Record<string, string> = {
    "Home Cleaning": "Sparkles",
    Plumbing: "Wrench",
    Electrical: "Zap",
    Landscaping: "Leaf",
    Painting: "Paintbrush",
    HVAC: "Wind",
    Carpentry: "Hammer",
    Moving: "Car",
    "Pest Control": "Shield",
    "Appliance Repair": "Wrench",
    Roofing: "Home",
    Security: "Shield",
    "Pool Services": "Droplet",
    Handyman: "Hammer",
    "Window Cleaning": "Sparkles",
    "Interior Design": "Home",
    Flooring: "Home",
    "Smart Home": "Zap",
  };

  return {
    id: backendCategory.slug || backendCategory.id,
    name: backendCategory.name,
    slug: backendCategory.slug,
    icon: iconMap[backendCategory.name] || "Wrench",
    description: backendCategory.description || "",
  };
}

export function getIconColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    Plumbing: "bg-blue-50 text-blue-600",
    Electrical: "bg-yellow-50 text-yellow-600",
    "Home Cleaning": "bg-green-50 text-green-600",
    Handyman: "bg-orange-50 text-orange-600",
    HVAC: "bg-cyan-50 text-cyan-600",
    Painting: "bg-purple-50 text-purple-600",
    Roofing: "bg-red-50 text-red-600",
    Landscaping: "bg-emerald-50 text-emerald-600",
    Carpentry: "bg-amber-50 text-amber-600",
    "Pest Control": "bg-lime-50 text-lime-600",
    Moving: "bg-indigo-50 text-indigo-600",
    "Appliance Repair": "bg-slate-50 text-slate-600",
    Security: "bg-gray-50 text-gray-600",
    "Pool Services": "bg-sky-50 text-sky-600",
    "Window Cleaning": "bg-teal-50 text-teal-600",
    "Interior Design": "bg-pink-50 text-pink-600",
    Flooring: "bg-stone-50 text-stone-600",
    "Smart Home": "bg-violet-50 text-violet-600",
  };

  return colorMap[categoryName] || "bg-gray-50 text-gray-600";
}
