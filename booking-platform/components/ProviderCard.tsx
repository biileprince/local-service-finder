"use client";

import { Star, MapPin, Phone, CheckCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Provider } from "@/types";

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-[#f97316]">
      {provider.featured && (
        <Badge className="absolute top-3 left-3 z-10 bg-[#f97316] text-white font-bold shadow-lg">
          <Zap className="w-3 h-3 mr-1" />
          FASTEST RESPONSE
        </Badge>
      )}

      <div className="flex flex-col md:flex-row p-5 gap-5">
        <div className="relative shrink-0">
          <Avatar className="w-24 h-24 rounded-xl border-2 border-gray-100">
            <AvatarImage src={provider.avatar} alt={provider.name} />
            <AvatarFallback className="text-xl font-bold">
              {provider.name[0]}
            </AvatarFallback>
          </Avatar>
          {provider.verified && (
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg border-2 border-white">
              <CheckCircle className="text-blue-500 w-6 h-6" />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="font-bold text-xl text-gray-900">
                {provider.name}
              </h3>
              <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-green-600 text-green-600" />
                <span className="font-bold text-green-700">
                  {provider.rating}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2 font-medium capitalize">
              {provider.category} Professional
            </p>
            <p className="text-sm text-gray-600 mb-3">
              {provider.specialties.slice(0, 3).join(" • ")}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-semibold">Licensed & Insured</span> •{" "}
              {provider.yearsExperience} years experience •{" "}
              {provider.reviewCount} reviews
            </p>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center text-sm text-gray-700">
              <MapPin
                className="w-4 h-4 mr-1.5 text-[#f97316]"
                strokeWidth={2}
              />
              <span className="font-semibold">{provider.distance}</span>
              <span className="mx-1.5 text-gray-300">•</span>
              <span>{provider.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 flex gap-3 border-t border-gray-200 pt-4">
        <Link href={`/provider/${provider.id}`} className="flex-1">
          <Button className="w-full font-bold text-base shadow-lg h-12">
            View & Book
          </Button>
        </Link>
        <Button variant="outline" size="icon" className="h-12 w-12 border-2">
          <Phone className="w-5 h-5" strokeWidth={2} />
        </Button>
      </div>
    </Card>
  );
}
