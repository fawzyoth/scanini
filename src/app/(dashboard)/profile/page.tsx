"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui";
import { Camera, Eye, EyeOff, Loader2 } from "lucide-react";
import { useDashboard } from "@/lib/dashboard-context";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function ProfilePage() {
  const { profile, loading, updateProfile } = useDashboard();
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name);
      setLastName(profile.last_name);
      setEmail(profile.email);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    await updateProfile({
      first_name: firstName,
      last_name: lastName,
    } as any);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError(t("profile.passwordMinLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t("profile.passwordMismatch"));
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message);
      return;
    }

    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 2000);
  }

  return (
    <>
      <PageHeader title={t("profile.title")} />

      <div className="max-w-2xl space-y-6">
        {/* Account Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">{t("profile.accountInfo")}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{t("profile.updateDetails")}</p>
          </div>

          <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
            {/* Profile picture */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-500">
                  {firstName.charAt(0).toUpperCase()}
                </div>
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{t("profile.profilePicture")}</p>
                <p className="text-xs text-gray-500">{t("profile.pictureFormat")}</p>
              </div>
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("profile.firstName")}
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("profile.lastName")}
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t("profile.lastNamePlaceholder")}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("profile.email")}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">{t("profile.emailChangeHint")}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {profileSaved && (
                <span className="text-sm text-green-600 font-medium">{t("common.saved")}</span>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t("common.saveChanges")}
              </button>
            </div>
          </form>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">{t("profile.security")}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{t("profile.changePassword")}</p>
          </div>

          <form onSubmit={handleChangePassword} className="p-6 space-y-4">
            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {passwordError}
              </div>
            )}

            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("profile.currentPassword")}
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="block w-full rounded-lg border border-gray-300 px-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("profile.newPassword")}
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("profile.newPasswordPlaceholder")}
                  required
                  minLength={8}
                  className="block w-full rounded-lg border border-gray-300 px-3 pr-10 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("profile.confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {passwordSaved && (
                <span className="text-sm text-green-600 font-medium">{t("profile.passwordUpdated")}</span>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t("profile.changePassword")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
