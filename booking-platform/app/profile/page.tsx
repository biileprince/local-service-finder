"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  ChevronRight,
  Camera,
  Edit2,
  LogOut,
  Star,
  Calendar,
  Settings,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

interface SettingItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick?: () => void;
  badge?: string;
  danger?: boolean;
}

function SettingItem({
  icon: Icon,
  title,
  description,
  onClick,
  badge,
  danger,
}: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left ${
        danger ? "hover:bg-red-50" : ""
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          danger ? "bg-red-100" : "bg-gray-100"
        }`}
      >
        <Icon
          className={`w-5 h-5 ${danger ? "text-red-600" : "text-gray-600"}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium ${danger ? "text-red-600" : "text-gray-900"}`}
        >
          {title}
        </p>
        <p className="text-sm text-gray-500 truncate">{description}</p>
      </div>
      {badge && (
        <Badge variant="secondary" className="shrink-0">
          {badge}
        </Badge>
      )}
      <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push("/login?redirect=/profile");
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const userAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userAvatar} alt={user?.name || "User"} />
                <AvatarFallback className="text-2xl">
                  {user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-orange-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500 mt-1">{user?.email}</p>
              <Badge variant="secondary" className="mt-2">
                {user?.role === "provider" ? "Service Provider" : "Customer"}
              </Badge>
            </div>

            {/* Edit Button */}
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              <Edit2 className="w-4 h-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <Link
              href="/bookings"
              className="bg-orange-50 rounded-xl p-4 text-center hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center justify-center gap-2 text-orange-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-2xl font-bold">-</span>
              </div>
              <p className="text-sm text-orange-600">Bookings</p>
            </Link>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-2xl font-bold">-</span>
              </div>
              <p className="text-sm text-green-600">Reviews</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-purple-600 mb-1">
                <User className="w-4 h-4" />
                <span className="text-2xl font-bold">-</span>
              </div>
              <p className="text-sm text-purple-600">Favorites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Edit Form */}
        {isEditing && (
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Full Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => setIsEditing(false)}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Personal Information */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              Personal Information
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            <SettingItem
              icon={User}
              title="Full Name"
              description={user?.name || "Not set"}
            />
            <SettingItem
              icon={Mail}
              title="Email Address"
              description={user?.email || "Not set"}
              badge="Verified"
            />
            <SettingItem
              icon={Phone}
              title="Phone Number"
              description="Not set"
            />
            <SettingItem
              icon={MapPin}
              title="Default Address"
              description="Not set"
            />
          </div>
        </Card>

        {/* Preferences */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Preferences</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <SettingItem
              icon={Bell}
              title="Notifications"
              description="Manage push and email notifications"
            />
            <SettingItem
              icon={CreditCard}
              title="Payment Methods"
              description="Add or manage payment options"
              badge="2 cards"
            />
            <SettingItem
              icon={Settings}
              title="App Settings"
              description="Language, theme, and other preferences"
            />
          </div>
        </Card>

        {/* Security */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Security</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <SettingItem
              icon={Shield}
              title="Password"
              description="Change your password"
            />
            <SettingItem
              icon={Shield}
              title="Two-Factor Authentication"
              description="Add extra security to your account"
              badge="Off"
            />
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="overflow-hidden">
          <div className="divide-y divide-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 cursor-pointer hover:bg-red-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-red-600 font-medium">Sign Out</h3>
                <p className="text-sm text-red-500">Sign out of your account</p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </Card>

        {/* Version */}
        <p className="text-center text-sm text-gray-400 py-4">
          LocalPro v1.0.0
        </p>
      </div>
    </div>
  );
}
