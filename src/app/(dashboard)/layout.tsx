import { Navbar } from "@/components/layout";
import { DashboardProvider } from "@/lib/dashboard-context";
import { I18nProvider } from "@/lib/i18n/i18n-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <DashboardProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
            {children}
          </main>
        </div>
      </DashboardProvider>
    </I18nProvider>
  );
}
