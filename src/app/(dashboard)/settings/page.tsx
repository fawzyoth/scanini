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

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <div className="lg:col-span-3 space-y-3 sm:space-y-4">
          <Accordion icon={<Info size={20} />} title="General" description="All the details about your establishment.">
            <GeneralSection />
          </Accordion>

          <Accordion icon={<Palette size={20} />} title="Appearance" description="Customize the look and feel of your menus.">
            <AppearanceSection />
          </Accordion>

          <Accordion icon={<Globe size={20} />} title="Menu languages" description="Present your menus in additional languages.">
            <LanguagesSection />
          </Accordion>

          <Accordion icon={<Star size={20} />} title="Reviews" description="Get feedback from your customers">
            <ReviewsSection />
          </Accordion>

          <Accordion icon={<Wifi size={20} />} title="Wi-Fi" description="Allow your customers to connect to your Wi-Fi network.">
            <WifiSection />
          </Accordion>

          <Accordion icon={<FileText size={20} />} title="Extra information" description="Show a text with additional information on the public page.">
            <ExtraInfoSection />
          </Accordion>

          <Accordion icon={<Share2 size={20} />} title="Social media" description="Link your profiles for better visibility.">
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
