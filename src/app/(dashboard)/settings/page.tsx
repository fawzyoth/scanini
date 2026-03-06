"use client";

import { PageHeader, Accordion } from "@/components/ui";
import {
  GeneralSection,
  AppearanceSection,
  LanguagesSection,
  ReviewsSection,
  WifiSection,
  ExtraInfoSection,
  SocialMediaSection,
  PhonePreview,
} from "@/components/settings";
import { Info, Palette, Globe, Star, Wifi, FileText, Share2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t("settings.title")} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <div className="lg:col-span-3 space-y-3 sm:space-y-4">
          <Accordion icon={<Info size={20} />} title={t("settings.general")} description={t("settings.generalDesc")}>
            <GeneralSection />
          </Accordion>

          <Accordion icon={<Palette size={20} />} title={t("settings.appearance")} description={t("settings.appearanceDesc")}>
            <AppearanceSection />
          </Accordion>

          <Accordion icon={<Globe size={20} />} title={t("settings.menuLanguages")} description={t("settings.menuLanguagesDesc")}>
            <LanguagesSection />
          </Accordion>

          <Accordion icon={<Star size={20} />} title={t("settings.reviews")} description={t("settings.reviewsDesc")}>
            <ReviewsSection />
          </Accordion>

          <Accordion icon={<Wifi size={20} />} title={t("settings.wifi")} description={t("settings.wifiDesc")}>
            <WifiSection />
          </Accordion>

          <Accordion icon={<FileText size={20} />} title={t("settings.extraInfo")} description={t("settings.extraInfoDesc")}>
            <ExtraInfoSection />
          </Accordion>

          <Accordion icon={<Share2 size={20} />} title={t("settings.socialMedia")} description={t("settings.socialMediaDesc")}>
            <SocialMediaSection />
          </Accordion>
        </div>

        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-24">
            <PhonePreview />
          </div>
        </div>
      </div>
    </>
  );
}
