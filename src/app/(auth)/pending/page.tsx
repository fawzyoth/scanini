"use client";

import Link from "next/link";
import { Phone, Clock, CheckCircle2, LogOut, MessageCircle, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PendingApprovalPage() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/signin");
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3" />
                <circle cx="5" cy="5" r="2" />
                <circle cx="19" cy="5" r="2" />
                <circle cx="5" cy="19" r="2" />
                <circle cx="19" cy="19" r="2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Scanini</span>
          </Link>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 px-8 py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">
              Account under review
            </h1>
            <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
              Your account has been created successfully. Our team will review it and contact you shortly.
            </p>
          </div>

          {/* Steps */}
          <div className="px-8 py-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">What happens next</h2>

            <div className="space-y-0">
              {/* Step 1 - Done */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={18} className="text-green-600" />
                  </div>
                  <div className="w-px h-full bg-green-200 my-1" />
                </div>
                <div className="pb-6">
                  <p className="text-sm font-semibold text-gray-900">Account created</p>
                  <p className="text-xs text-gray-500 mt-0.5">Your information has been received successfully</p>
                </div>
              </div>

              {/* Step 2 - In progress */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 ring-2 ring-indigo-200 ring-offset-2">
                    <Phone size={18} className="text-indigo-600" />
                  </div>
                  <div className="w-px h-full bg-gray-200 my-1" />
                </div>
                <div className="pb-6">
                  <p className="text-sm font-semibold text-gray-900">Verification call</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    We will reach out via phone or WhatsApp to verify your restaurant details
                  </p>
                </div>
              </div>

              {/* Step 3 - Pending */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={18} className="text-gray-300" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Account activated</p>
                  <p className="text-xs text-gray-400 mt-0.5">Full access to build your digital menu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Time estimate */}
          <div className="mx-8 mb-6 bg-indigo-50 rounded-xl p-4 flex items-start gap-3">
            <Clock size={18} className="text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-indigo-900">
                Response within 24 hours
              </p>
              <p className="text-xs text-indigo-600 mt-0.5">
                Make sure your phone is reachable. We usually respond much faster.
              </p>
            </div>
          </div>

          {/* Contact info */}
          <div className="mx-8 mb-6 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
            <MessageCircle size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Need help?</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Contact us on WhatsApp if you have any questions about the approval process.
              </p>
            </div>
          </div>

          {/* Sign out */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-center">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
