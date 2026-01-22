import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Wrench,
  Zap,
  Sparkles,
  Hammer,
  Wind,
  Paintbrush,
  Droplet,
  Home,
  Leaf,
  Car,
  Dog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { categoriesApi, providersApi } from "@/lib/api";
import {
  transformProvider,
  transformCategory,
  getIconColor,
} from "@/lib/transform";

const categories = [
  {
    name: "Plumbing",
    icon: Wrench,
    description: "Repairs, installations & emergencies",
    color: "bg-blue-50 text-blue-600",
    count: 234,
  },
  {
    name: "Electrical",
    icon: Zap,
    description: "Wiring, installations & repairs",
    color: "bg-yellow-50 text-yellow-600",
    count: 189,
  },
  {
    name: "Cleaning",
    icon: Sparkles,
    description: "Home & office cleaning services",
    color: "bg-green-50 text-green-600",
    count: 312,
  },
  {
    name: "Handyman",
    icon: Hammer,
    description: "General repairs & maintenance",
    color: "bg-orange-50 text-orange-600",
    count: 156,
  },
  {
    name: "HVAC",
    icon: Wind,
    description: "Heating, cooling & ventilation",
    color: "bg-cyan-50 text-cyan-600",
    count: 98,
  },
  {
    name: "Painting",
    icon: Paintbrush,
    description: "Interior & exterior painting",
    color: "bg-purple-50 text-purple-600",
    count: 145,
  },
  {
    name: "Roofing",
    icon: Home,
    description: "Roof repair & installation",
    color: "bg-red-50 text-red-600",
    count: 87,
  },
  {
    name: "Landscaping",
    icon: Leaf,
    description: "Lawn care & garden design",
    color: "bg-emerald-50 text-emerald-600",
    count: 203,
  },
  {
    name: "Carpentry",
    icon: Hammer,
    description: "Custom woodwork & furniture",
    color: "bg-amber-50 text-amber-600",
    count: 124,
  },
  {
    name: "Pest Control",
    icon: Shield,
    description: "Inspection & extermination",
    color: "bg-lime-50 text-lime-600",
    count: 76,
  },
  {
    name: "Auto Repair",
    icon: Car,
    description: "Vehicle maintenance & repair",
    color: "bg-slate-50 text-slate-600",
    count: 142,
  },
  {
    name: "Pet Care",
    icon: Dog,
    description: "Grooming, walking & sitting",
    color: "bg-pink-50 text-pink-600",
    count: 168,
  },
  {
    name: "Gardening",
    icon: Leaf,
    description: "Garden maintenance & design",
    color: "bg-teal-50 text-teal-600",
    count: 167,
  },
  {
    name: "Locksmith",
    icon: Shield,
    description: "Lock installation & repair",
    color: "bg-slate-50 text-slate-600",
    count: 93,
  },
  {
    name: "Moving",
    icon: Car,
    description: "Packing, moving & delivery",
    color: "bg-indigo-50 text-indigo-600",
    count: 142,
  },
  {
    name: "Security",
    icon: Shield,
    description: "Alarm systems & cameras",
    color: "bg-gray-50 text-gray-600",
    count: 85,
  },
  {
    name: "Window Cleaning",
    icon: Sparkles,
    description: "Residential & commercial",
    color: "bg-sky-50 text-sky-600",
    count: 78,
  },
  {
    name: "Pool Service",
    icon: Droplet,
    description: "Cleaning, repair & maintenance",
    color: "bg-blue-50 text-blue-600",
    count: 64,
  },
];

const steps = [
  {
    step: 1,
    title: "Tell Us What You Need",
    description:
      "Search for the service you need or browse our categories. Filter by location, ratings, and availability to find the perfect match.",
    icon: Search,
  },
  {
    step: 2,
    title: "Compare & Choose",
    description:
      "Review profiles, ratings, and reviews from real customers. Compare prices and availability to select the best professional for your job.",
    icon: Star,
  },
  {
    step: 3,
    title: "Book Instantly",
    description:
      "Choose your preferred date and time slot. Book with confidence knowing all our professionals are verified, licensed, and insured.",
    icon: Clock,
  },
  {
    step: 4,
    title: "Get Quality Service",
    description:
      "Your professional arrives on time and completes the job to your satisfaction. Rate your experience and help others make informed decisions.",
    icon: CheckCircle,
  },
];

// Icon component mapping
const iconComponents: Record<string, any> = {
  Wrench,
  Zap,
  Sparkles,
  Hammer,
  Wind,
  Paintbrush,
  Home,
  Leaf,
  Car,
  Dog,
  Shield,
  Droplet,
};

// Disable caching for this page to show fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  // Fetch data from backend
  const [categoriesData, providersData] = await Promise.all([
    categoriesApi.getAll().catch(() => ({ categories: [] })),
    providersApi
      .getAll({ featured: true, limit: 3 })
      .catch(() => ({ providers: [] })),
  ]);

  const categories = categoriesData.categories.map((cat) => {
    const transformed = transformCategory(cat);
    const IconComponent = iconComponents[transformed.icon] || Wrench;
    return {
      name: transformed.name,
      icon: IconComponent,
      description: transformed.description,
      color: getIconColor(transformed.name),
      count: cat.providerCount,
      slug: cat.slug,
    };
  });

  const featuredProviders = providersData.providers.map(transformProvider);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-100 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="warning" className="mb-4 px-4 py-1.5">
                <span className="mr-1">⭐</span> Trusted by 50,000+ customers
              </Badge>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Find Trusted Local Service Providers
                <span className="text-primary-500"> Near You</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Connect with verified professionals for plumbing, electrical,
                cleaning, and more. Book instantly and get the job done right.
              </p>

              <div className="bg-white rounded-2xl shadow-2xl p-3 max-w-xl mx-auto lg:mx-0 border-2 border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-[#f97316] focus-within:ring-2 focus-within:ring-[#f97316] focus-within:ring-opacity-20 transition-all">
                    <Search
                      className="w-5 h-5 text-[#f97316] shrink-0"
                      strokeWidth={2.5}
                    />
                    <input
                      type="text"
                      placeholder="What service do you need?"
                      className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-[#f97316] focus-within:ring-2 focus-within:ring-[#f97316] focus-within:ring-opacity-20 transition-all">
                    <MapPin
                      className="w-5 h-5 text-[#f97316] shrink-0"
                      strokeWidth={2.5}
                    />
                    <input
                      type="text"
                      placeholder="Your location"
                      className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <Link
                    href="/search"
                    className="focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#f97316] focus-visible:ring-offset-4 rounded-xl"
                  >
                    <Button
                      size="lg"
                      className="w-full sm:w-auto sm:px-10 font-bold text-base shadow-xl"
                    >
                      Search Now
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Verified Pros</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    Same Day Service
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">4.9 Rating</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <Card className="p-6 shadow-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={featuredProviders[0]?.avatar} />
                      <AvatarFallback>MP</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {featuredProviders[0]?.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {featuredProviders[0]?.category} Expert
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {featuredProviders[0]?.rating}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({featuredProviders[0]?.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/provider/${featuredProviders[0]?.id}`}>
                  <Button className="w-full">Book Now</Button>
                </Link>
              </Card>

              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Booking Confirmed</p>
                    <p className="text-sm font-medium">Today, 2:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-white">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                        />
                      </Avatar>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium">2,500+ Pros</p>
                    <p className="text-xs text-gray-500">Ready to help</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Simplified and Primary Focus */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What service do you need?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse by category to find the perfect professional for your needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/search?category=${category.name.toLowerCase()}`}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-4 rounded-2xl"
              >
                <Card className="p-6 lg:p-8 text-center hover:shadow-xl hover:border-primary-200 transition-all group-hover:-translate-y-2 h-full">
                  <div
                    className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className="w-8 h-8 lg:w-10 lg:h-10" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <p className="text-sm text-primary-600 font-semibold">
                    {category.count} available
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Improved */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get connected with trusted professionals in just 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-16 left-[60%] w-full h-1 bg-linear-to-r from-[#f97316] to-[#fb923c] z-0"
                    style={{
                      clipPath:
                        "polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)",
                    }}
                  />
                )}

                <div className="relative z-10 text-center">
                  {/* Icon Container */}
                  <div className="relative inline-flex mb-6">
                    <div className="w-32 h-32 bg-linear-to-br from-[#f97316] to-[#ea580c] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#f97316]/30 group-hover:shadow-[#f97316]/40 transition-all">
                      <step.icon
                        className="w-14 h-14 text-white"
                        strokeWidth={2}
                      />
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl font-bold text-[#f97316] text-xl border-4 border-[#fff7ed]">
                      {step.step}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link href="/search">
              <Button size="lg" className="font-bold shadow-xl px-10">
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Providers Section - Simplified */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Top-Rated Professionals
              </h2>
              <p className="text-lg text-gray-600">
                Verified experts ready to help you
              </p>
            </div>
            <Link
              href="/search"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-4 rounded-lg"
            >
              <Button variant="outline" size="lg">
                View All
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProviders.map((provider) => (
              <Link
                key={provider.id}
                href={`/provider/${provider.id}`}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-4 rounded-2xl"
              >
                <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-2 h-full border-2 hover:border-primary-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={provider.avatar}
                          alt={provider.name}
                        />
                        <AvatarFallback>{provider.name[0]}</AvatarFallback>
                      </Avatar>
                      {provider.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize mb-2">
                        {provider.category} • {provider.location}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-green-600 text-green-600" />
                          <span className="text-sm font-bold text-green-700">
                            {provider.rating}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          ({provider.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {provider.bio}
                  </p>

                  <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                    <Button size="sm" className="w-full font-semibold">
                      Book Now
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Simplified and More Direct */}
      <section className="py-20 lg:py-28 bg-linear-to-br from-primary-500 via-primary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to find your service provider?
          </h2>
          <p className="text-lg md:text-xl text-primary-50 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers. Get matched with verified
            professionals in minutes.
          </p>
          <Link
            href="/search"
            className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-primary-600 rounded-xl"
          >
            <Button
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50 shadow-2xl text-lg px-8 py-6 h-auto font-bold"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
