"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Loader } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [autoTrackLocation, setAutoTrackLocation] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      setEmail(user.email || "");
      // Parse the name field if it exists
      const nameParts = (user.name || "").split(" ");
      if (nameParts.length > 0) {
        setFirstName(nameParts[0] || "");
        setLastName(nameParts[nameParts.length - 1] || "");
        if (nameParts.length > 2) {
          setMiddleName(nameParts.slice(1, -1).join(" ") || "");
        }
      }
    }
  }, [user, authLoading, router]);

  const handleGetLocation = async () => {
    setGpsLoading(true);
    setGpsMessage("");

    if (!navigator.geolocation) {
      setGpsMessage("Geolocation is not supported by your browser");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Use reverse geocoding API to get readable address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.address?.city || data.address?.county || data.address?.country || `${latitude}, ${longitude}`;
          setLocation(address);
          setGpsMessage("Location captured successfully!");
          setTimeout(() => setGpsMessage(""), 3000);
        } catch {
          // Fallback to coordinates if reverse geocoding fails
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setGpsMessage("Location captured (coordinates only)");
          setTimeout(() => setGpsMessage(""), 3000);
        } finally {
          setGpsLoading(false);
        }
      },
      (error) => {
        let errorMessage = "Unable to retrieve location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location permission denied. Please enable it in your browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out.";
        }
        setGpsMessage(errorMessage);
        setGpsLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");
      
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          gender,
          occupation,
          location,
        }),
      });

      if (res.ok) {
        setMessage("Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to update profile");
      }
    } catch (error) {
      setMessage("Error updating profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account information</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="bg-[#111827] border-white/10 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Section */}
          <div className="border-b border-white/10 pb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-300">
                  First Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-[#1f2937] border-white/10 text-white placeholder:text-slate-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-300">
                  Last Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-[#1f2937] border-white/10 text-white placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            {/* Middle Name */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="middleName" className="text-slate-300">
                Middle Name
              </Label>
              <Input
                id="middleName"
                type="text"
                placeholder="James (Optional)"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="bg-[#1f2937] border-white/10 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-slate-300">
                Gender
              </Label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#1f2937] border border-white/10 text-white rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Contact Section */}
          <div className="border-b border-white/10 pb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            
            {/* Email */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="email" className="text-slate-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1f2937] border-white/10 text-white placeholder:text-slate-500"
                required
                disabled
              />
              <p className="text-xs text-slate-500">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-[#1f2937] border-white/10 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
            
            {/* Occupation */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="occupation" className="text-slate-300">
                Occupation
              </Label>
              <Input
                id="occupation"
                type="text"
                placeholder="Software Engineer"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="bg-[#1f2937] border-white/10 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Location */}
            <div className="space-y-3">
              <Label className="text-slate-300">Location</Label>
              
              {/* GPS Toggle */}
              <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5">
                <input
                  type="checkbox"
                  id="autoTrackLocation"
                  checked={autoTrackLocation}
                  onChange={(e) => {
                    setAutoTrackLocation(e.target.checked);
                    if (e.target.checked) {
                      handleGetLocation();
                    }
                  }}
                  className="w-4 h-4 rounded cursor-pointer accent-indigo-500"
                />
                <label htmlFor="autoTrackLocation" className="text-sm text-slate-300 cursor-pointer flex-1">
                  Track automatically via GPS
                </label>
                {autoTrackLocation && (
                  <MapPin className="h-4 w-4 text-indigo-400" />
                )}
              </div>

              {/* GPS Status Message */}
              {gpsMessage && (
                <div
                  className={`p-2 rounded-lg text-xs ${
                    gpsMessage.includes("successfully") || gpsMessage.includes("captured")
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {gpsMessage}
                </div>
              )}

              {/* GPS Button */}
              {autoTrackLocation && (
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gpsLoading}
                  className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {gpsLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4" />
                      Get My Location
                    </>
                  )}
                </button>
              )}

              {/* Location Input */}
              <Input
                id="location"
                type="text"
                placeholder={autoTrackLocation ? "Location will appear here" : "San Francisco, CA"}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-[#1f2937] border-white/10 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.includes("successfully")
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="neon-btn w-full justify-center cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </Card>
    </div>
  );
}
